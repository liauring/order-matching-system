const redisClient = require('../../util/cache')
const createCsvWriter = require('csv-writer').createArrayCsvWriter
const { v4: uuidv4 } = require('uuid')
let { rabbitmqPub, rabbitmqSendToQueue, rabbitmqGetLength } = require('../../util/rabbitmq')
let { CurrentFiveTicks, NewOrderFiveTicks } = require('../FiveTicks')

class MatchLogic {
  constructor(order, dealerType, orderType) {
    this.order = order
    this.dealerType = dealerType
    this.orderType = orderType
    this.bestDealerOrderID = null
    this.bestDealer = null
    this.bestDealerScore = null
    this.finalQTY = null
    this.hasRemainingQuantity = false
    this.executionID = null
    this.executionTime = null
    this.executionDetail = {}
    this.executionBuyer = {}
    this.executionSeller = {}
    this.execBuyerMessage = {}
    this.execSellerMessage = {}
    this.kLineInfo = {}
    this.csvWriter = null
  }

  //----- for stress test -----
  // createFile() {
  //   const csvWriter = createCsvWriter({
  //     header: ['orderID', 'consumeFromRabbitmq', 'matchFinish', 'allExecutionFinish'],
  //     // header: false,
  //     path: 'matchLogicTime.csv',
  //     append: true,
  //   })

  //   csvWriter
  //     .writeRecords([this.order.matchTime]) // returns a promise
  //     .then(() => {
  //       console.log(`[writeFile] ${this.orderID} is done.`)
  //     })
  // }

  getOrderIDForMatchTime() {
    if (!this.order.matchTime) {
      this.order.matchTime = []
      this.order.matchTime.push(this.order.orderID)
    }
    return
  }

  getOrderFromRabbitMQTime() {
    let currentTime = new Date().getTime()
    this.order.matchTime.push({ pubRabbitmq: currentTime })
    return
  }

  getMatchFinishTime() {
    let currentTime = new Date().getTime()
    this.order.matchTime.push({ matchFinish: currentTime })
    return
  }

  getExecutionFinishTime() {
    let currentTime = new Date().getTime()
    this.order.matchTime.push({ execFinish: currentTime })
    return
  }

  addEmptyValueForSocket() {
    let currentTime = new Date().getTime()
    this.order.matchTime.push(currentTime)
    return
  }

  async sendOrderTimeToRabbitMQ() {
    return await rabbitmqSendToQueue('matchTime', this.order.matchTime)
  }

  deleteMatchTime() {
    // this.order.matchTime.splice(-4)
    delete this.order.matchTime
  }

  //----------

  async getBestDealerOrderIDUtil(head, tail) {
    ;[this.bestDealerOrderID, this.bestDealerScore] = await redisClient.zrange(
      `${this.order.symbol}-${this.dealerType}`,
      head,
      tail,
      'WITHSCORES'
    )
    return
  }

  compareBestDealerPriceWithOrderPrice() {
    //由子層實作
    throw new Error('compareBestDealerPriceWithOrderPrice() function should be implemented by child.')
  }

  async haveBestDealer() {
    if (this.bestDealerOrderID === undefined || this.compareBestDealerPriceWithOrderPrice()) {
      await this.#addNewDealer()
      await new NewOrderFiveTicks().addNewOrderFiveTicks(
        `${this.order.symbol}-${this.orderType}`,
        this.order.price,
        this.order.quantity,
        '+'
      )
      return false
    }
    return true
  }

  async getBestDealerOrderInfo() {
    this.bestDealer = await redisClient.get(this.bestDealerOrderID)
    this.bestDealer = JSON.parse(this.bestDealer)
    return
  }

  async deleteBestDealer() {
    await redisClient.zrem(`${this.order.symbol}-${this.dealerType}`, this.bestDealerOrderID)
    await redisClient.del(`${this.bestDealerOrderID}`)
    return
  }

  async matchExecutionQuantity() {
    if (this.order.quantity === this.bestDealer.quantity) {
      this.finalQTY = this.order.quantity
      this.hasRemainingQuantity = false
      this.order.orderStatus = 3
      this.bestDealer.orderStatus = 3
      await new NewOrderFiveTicks().addNewOrderFiveTicks(
        `${this.order.symbol}-${this.dealerType}`,
        this.bestDealer.price,
        this.finalQTY,
        '-'
      )
    } else if (this.order.quantity < this.bestDealer.quantity) {
      this.finalQTY = this.order.quantity
      this.bestDealer.quantity -= this.order.quantity
      await redisClient.zadd(
        `${this.order.symbol}-${this.dealerType}`,
        this.bestDealerScore,
        JSON.stringify(this.bestDealer.orderID)
      )
      await redisClient.set(`${this.bestDealer.orderID}`, JSON.stringify(this.bestDealer))
      this.hasRemainingQuantity = false
      this.order.orderStatus = 3
      this.bestDealer.orderStatus = 2
      await new NewOrderFiveTicks().addNewOrderFiveTicks(
        `${this.order.symbol}-${this.dealerType}`,
        this.bestDealer.price,
        this.finalQTY,
        '-'
      )
    } else if (this.order.quantity > this.bestDealer.quantity) {
      this.finalQTY = this.bestDealer.quantity
      this.order.quantity -= this.bestDealer.quantity
      this.hasRemainingQuantity = true
      this.order.orderStatus = 2
      this.bestDealer.orderStatus = 3
      await new NewOrderFiveTicks().addNewOrderFiveTicks(
        `${this.order.symbol}-${this.dealerType}`,
        this.bestDealer.price,
        this.finalQTY,
        '-'
      )
    } else {
      console.error('matchExecutionQuantity() Error')
    }
    return
  }

  createExecutionIDAndTime() {
    this.executionID = uuidv4()
    this.executionTime = new Date().getTime()
    return
  }

  getSeller() {
    //由子層實作
    throw new Error('getSeller() function should be implemented by child.')
  }

  getBuyer() {
    //由子層實作
    throw new Error('getBuyer() function should be implemented by child.')
  }

  createExecutionDetail() {
    this.executionDetail = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      seller: this.getSeller().account,
      sellerOrderID: this.getSeller().orderID,
      sellerOrderTime: this.getSeller().createTime,
      buyer: this.getBuyer().account,
      buyerOrderID: this.getBuyer().orderID,
      buyerOrderTime: this.getBuyer().createTime,
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionQuantity: this.finalQTY,
    }
    return
  }

  createExecutionBuyer() {
    this.executionBuyer = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      dealer: this.getBuyer().account,
      orderID: this.getBuyer().orderID,
      orderTime: this.getBuyer().createTime,
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionQuantity: this.finalQTY,
      orderStatus: this.getBuyer().orderStatus,
      matchTime: this.getBuyer().matchTime, //TODO:
    }
    return
  }

  createExecutionSeller() {
    this.executionSeller = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      dealer: this.getSeller().account,
      orderID: this.getSeller().orderID,
      orderTime: this.getSeller().createTime,
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionQuantity: this.finalQTY,
      orderStatus: this.getSeller().orderStatus,
      matchTime: this.getSeller().matchTime, //TODO:
    }
    return
  }

  createExecutionMsg() {
    this.execSellerMessage = { brokerID: this.getSeller().broker, execution: this.executionSeller }
    this.execBuyerMessage = { brokerID: this.getBuyer().broker, execution: this.executionBuyer }
    return
  }

  createkLineInfo() {
    this.kLineInfo = {
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionTime: this.executionTime,
    }
    return
  }

  async sendExecutionToRabbitmqForStorage() {
    return await rabbitmqSendToQueue('saveNewExec', this.executionDetail)
  }

  async emitExeuction() {
    await redisClient.publish('sendExec', JSON.stringify(this.execSellerMessage))
    await redisClient.publish('sendExec', JSON.stringify(this.execBuyerMessage))
    return
  }

  async emitKLine() {
    return await redisClient.publish('kLine', JSON.stringify(this.kLineInfo))
  }

  async #addNewDealer() {
    let setScore = this.order.orderID

    await redisClient.zadd(`${this.order.symbol}-${this.orderType}`, setScore, JSON.stringify(this.order.orderID))
    await redisClient.set(`${this.order.orderID}`, JSON.stringify(this.order))

    return
  }
}

class NewOrder {
  constructor(order) {
    this.order = order
    this.orderID = null
    // this.todayRestTime = null
  }

  //----- for stress test -----
  getOrderIDForJourneyTime() {
    this.order.matchTime = []
    this.order.matchTime.push(this.order.orderID)
    return
  }

  getRequestTime() {
    let currentTime = new Date().getTime()
    this.order.matchTime.push(currentTime)
    return
  }

  async getRabbitmqLength(queue) {
    let queueLength = await rabbitmqGetLength(queue)
    this.order.matchTime.push(queueLength)
    return
  }
  //----------

  formatOrder() {
    this.order.account = parseInt(this.order.account)
    this.order.broker = parseInt(this.order.broker)
    this.order.symbol = parseInt(this.order.symbol)
    this.order.price = parseFloat(this.order.price)
    this.order.quantity = parseInt(this.order.quantity)
    this.order.orderStatus = 1 //1: 委託成功, 2: 部分成交, 3: 完全成交
    return
  }

  createOrderID() {
    this.order.orderID = parseInt('' + parseInt(parseFloat(this.order.price) * 100) + `${this.order.orderTime}`, 10)
    return
  }

  async shardingToRabbitmq() {
    let symbolSharding = this.order.symbol % 5
    await rabbitmqPub('matchNewOrder', symbolSharding.toString(), JSON.stringify(this.order))
  }

  createGetOrderResponse() {
    this.order.orderStatus = 1
    this.order.executionQuantity = 0
  }

  createOrderResponse() {
    let orderResponse = {
      orderStatus: 1,
      account: this.order.account,
      symbol: this.order.symbol,
      quantity: this.order.quantity,
      price: this.order.price,
      executionQuantity: 0,
      orderTime: this.order.createTime,
      orderID: this.order.orderID,
      BS: this.order.BS,
    }
    return orderResponse
  }
}

module.exports = { MatchLogic, NewOrder }

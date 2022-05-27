const { v4: uuidv4 } = require('uuid')

class ExecutionUpdater {
  #queueProvider
  #cacheProvider
  #executionID
  #executionTime
  #seller
  #buyer
  #symbol
  #dealerPrice
  #finalQTY
  constructor(queueProvider, cacheProvider) {
    this.#queueProvider = queueProvider
    this.#cacheProvider = cacheProvider
    this.#executionID = null
    this.#executionTime = null
    this.#seller = null
    this.#buyer = null
    this.#symbol = null
    this.#dealerPrice = null
    this.#finalQTY = null
  }

  async udpate(symbol, seller, buyer, dealerPrice, finalQTY) {
    this.#updateExecutionIDAndTime()
    this.#seller = seller
    this.#buyer = buyer
    this.#symbol = symbol
    this.#dealerPrice = dealerPrice
    this.#finalQTY = finalQTY
    await this.#sendExecutionToRabbitmqForStorage()
    await this.#emitExeuction()
    await this.#emitKLine()
  }

  async #sendExecutionToRabbitmqForStorage() {
    let executionDetail = {
      executionID: this.#executionID,
      executionTime: this.#executionTime,
      seller: this.#seller.account,
      sellerOrderID: this.#seller.orderID,
      sellerOrderTime: this.#seller.createTime,
      buyer: this.#buyer.account,
      buyerOrderID: this.#buyer.orderID,
      buyerOrderTime: this.#buyer.createTime,
      symbol: this.#symbol,
      price: this.#dealerPrice,
      executionQuantity: this.#finalQTY,
    }

    return await this.#queueProvider.sendToSingleQueue('saveNewExec', executionDetail)
  }

  async #emitExeuction() {
    await this.#cacheProvider.publishChannel('sendExec', JSON.stringify(this.#getExecSellerMessage()))
    await this.#cacheProvider.publishChannel('sendExec', JSON.stringify(this.#getExecBuyerMessage()))
  }

  #getExecSellerMessage() {
    let executionSeller = {
      executionID: this.#executionID,
      executionTime: this.#executionTime,
      dealer: this.#seller.account,
      orderID: this.#seller.orderID,
      orderTime: this.#seller.createTime,
      symbol: this.#symbol,
      price: this.#dealerPrice,
      executionQuantity: this.#finalQTY,
      orderStatus: this.#seller.orderStatus,
    }

    return { brokerID: this.#seller.broker, execution: executionSeller }
  }

  #getExecBuyerMessage() {
    let executionBuyer = {
      executionID: this.#executionID,
      executionTime: this.#executionTime,
      dealer: this.#buyer.account,
      orderID: this.#buyer.orderID,
      orderTime: this.#buyer.createTime,
      symbol: this.#symbol,
      price: this.#dealerPrice,
      executionQuantity: this.#finalQTY,
      orderStatus: this.#buyer.orderStatus,
    }
    return { brokerID: this.#buyer.broker, execution: executionBuyer }
  }

  async #emitKLine() {
    return await this.#cacheProvider.publishChannel('kLine', JSON.stringify(this.#getKLineInfo()))
  }

  #getKLineInfo() {
    return {
      symbol: this.#symbol,
      price: this.#dealerPrice,
      executionTime: this.#executionTime,
    }
  }

  #updateExecutionIDAndTime() {
    this.#executionID = uuidv4()
    this.#executionTime = new Date().getTime()
  }
}

module.exports = { ExecutionUpdater }

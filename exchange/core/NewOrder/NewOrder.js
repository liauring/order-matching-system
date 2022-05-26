class NewOrder {
  constructor(order, queueProvider) {
    this.order = order
    this.queueProvider = queueProvider
    this.orderID = null
  }

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
    await this.queueProvider.shardingToQueue('matchNewOrder', symbolSharding.toString(), JSON.stringify(this.order))
    return
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

class SellerOrder extends NewOrder {
  orderTimeInDayPeriod() {
    this.order.createTime = new Date().getTime()
    let midnight = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let todayRestTime = this.order.createTime - midnight
    todayRestTime = todayRestTime.toString().padStart(8, '0')
    this.order.orderTime = todayRestTime.toString()
    return
  }
}

class BuyerOrder extends NewOrder {
  orderTimeInDayPeriod() {
    this.order.createTime = new Date().getTime()
    let midnight = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
    let todayRestTime = midnight - this.order.createTime
    todayRestTime = todayRestTime.toString().padStart(8, '0')
    this.order.orderTime = todayRestTime.toString()
    return
  }
}

module.exports = { BuyerOrder, SellerOrder }

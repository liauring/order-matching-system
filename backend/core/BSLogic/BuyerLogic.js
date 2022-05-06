const { MatchLogic, NewOrder } = require('./MatchLogic')

class BuyerLogic extends MatchLogic {
  constructor(order) {
    super(order, 'seller', 'buyer')
  }

  async getBestDealerOrderID() {
    await this.getBestDealerOrderIDUtil(0, 0)
    return
  }

  compareBestDealerPriceWithOrderPrice() {
    return parseInt(this.bestDealerScore.toString().slice(0, -8)) > this.order.price * 100
  }

  getSeller() {
    return this.bestDealer
  }

  getBuyer() {
    return this.order
  }
}

class BuyerOrder extends NewOrder {
  orderTimeInDayPeriod() {
    this.time = new Date()
    let midnight = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
    let todayRestTime = midnight - this.time
    todayRestTime = todayRestTime.toString().padStart(8, '0')
    console.log('buyerOrder ', todayRestTime)
    this.order.orderTime = todayRestTime.toString()
    return
  }
}

module.exports = { BuyerLogic, BuyerOrder }

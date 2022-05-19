const { MatchLogic, NewOrder } = require('./MatchLogic')

class SellerLogic extends MatchLogic {
  constructor(order, queueProvider) {
    super(order, 'buyer', 'seller', queueProvider)
  }

  async getBestDealerOrderID() {
    await this.getBestDealerOrderIDUtil(-1, -1)
    return
  }

  compareBestDealerPriceWithOrderPrice() {
    let compareResult = parseInt(this.bestDealerScore.toString().slice(0, -8)) < this.order.price * 100
    return compareResult
  }

  getSeller() {
    return this.order
  }

  getBuyer() {
    return this.bestDealer
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

module.exports = { SellerLogic, SellerOrder }

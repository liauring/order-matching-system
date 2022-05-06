const { MatchLogic, NewOrder } = require('./MatchLogic')

class SellerLogic extends MatchLogic {
  constructor(order) {
    super(order, 'buyer', 'seller')
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
    this.time = new Date().getTime()
    let midnight = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let todayRestTime = this.time - midnight
    todayRestTime = todayRestTime.toString().padStart(8, '0')
    console.log('sellerOrder ', todayRestTime)
    this.order.orderTime = todayRestTime.toString()
    return
  }
}

module.exports = { SellerLogic, SellerOrder }

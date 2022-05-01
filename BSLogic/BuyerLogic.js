const MatchLogic = require('./MatchLogic')

class BuyerLogic extends MatchLogic {
  constructor(order) {
    super(order, 'seller', 'buyer');
  }

  async getBestDealerOrderID() {
    await this.getBestDealerOrderIDUtil(0, 0);
    return;
  }

  compareBestDealerPriceWithOrderPrice() {
    return (parseInt(this.bestDealerScore.toString().slice(0, -8)) > this.order.price * 100)
  }

  getSeller() {
    return this.bestDealer;
  }

  getBuyer() {
    return this.order;
  }
}

module.exports = BuyerLogic
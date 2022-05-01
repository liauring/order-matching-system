const MatchLogic = require('./MatchLogic')

class SellerLogic extends MatchLogic {
  constructor(order) {
    super(order, 'buyer', 'seller');
  }

  async getBestDealerOrderID() {
    await this.getBestDealerOrderIDUtil(-1, -1);
    return;
  }

  compareBestDealerPriceWithOrderPrice() {
    let compareResult = (parseInt(this.bestDealerScore.toString().slice(0, -8)) < this.order.price * 100);
    return compareResult;
  }

  getSeller() {
    return this.order;
  }

  getBuyer() {
    return this.bestDealer;
  }
}

module.exports = SellerLogic
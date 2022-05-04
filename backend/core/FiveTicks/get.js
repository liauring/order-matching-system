const redisClient = require('../../util/cache');

class CurrentFiveTicks {
  constructor(symbol) {
    this.symbol = symbol
  }

  async getFiveTicks() {
    // 取現在五檔
    let buyerfiveTicks = await redisClient.zrange(`${this.symbol}-buyer-fiveTicks`, -5, -1, 'WITHSCORES');
    let sellerFiveTicks = await redisClient.zrange(`${this.symbol}-seller-fiveTicks`, 0, 4, 'WITHSCORES');
    let formattedBuyerFiveTicks = this.#formatFiveTicks(buyerfiveTicks).reverse();
    let formattedSellerFiveTicks = this.#formatFiveTicks(sellerFiveTicks);
    let FiveTicks = {
      buyer: formattedBuyerFiveTicks,
      seller: formattedSellerFiveTicks,
    }

    return FiveTicks;
  }

  #formatFiveTicks(fiveTicks) {
    let formattedFiveTicks = fiveTicks.reduce((accumulator, currentValue, currentIndex) => {

      let tick = {};
      if (currentIndex % 2 === 1) {
        parseInt(currentValue)
        let originalPrice = currentValue / 100;
        accumulator[Math.floor(currentIndex / 2)].price = originalPrice;
      } else {
        let originalSize = parseInt(currentValue.slice(5));
        tick.size = originalSize;
        accumulator.push(tick);
      }

      return accumulator;
    }, [])
    return formattedFiveTicks
  }

}


//TODO:這有copy給app.js用


module.exports = { CurrentFiveTicks }
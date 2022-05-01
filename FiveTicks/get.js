const redisClient = require('../util/cache');

let getFiveTicks = async function (symbol) {
  // 取現在五檔
  let buyerfiveTicks = await redisClient.zrange(`${symbol}-buyer-fiveTicks`, -5, -1, 'WITHSCORES');
  let sellerFiveTicks = await redisClient.zrange(`${symbol}-seller-fiveTicks`, 0, 4, 'WITHSCORES');
  let formattedBuyerFiveTicks = formatFiveTicks(buyerfiveTicks).reverse();
  let formattedSellerFiveTicks = formatFiveTicks(sellerFiveTicks);
  let FiveTicks = {
    buyer: formattedBuyerFiveTicks,
    seller: formattedSellerFiveTicks,
  }

  return FiveTicks;
}

//TODO:這有copy給app.js用
let formatFiveTicks = function (fiveTicks) {
  let formattedFiveTicks = fiveTicks.reduce((accumulator, currentValue, currentIndex) => {

    let tick = {};
    if (currentIndex % 2 === 1) {
      parseInt(currentValue)
      originalPrice = currentValue / 100;
      accumulator[Math.floor(currentIndex / 2)].price = originalPrice;
    } else {
      originalSize = parseInt(currentValue.slice(5));
      tick.size = originalSize;
      accumulator.push(tick);
    }

    return accumulator;
  }, [])
  return formattedFiveTicks
}

module.exports = { getFiveTicks }
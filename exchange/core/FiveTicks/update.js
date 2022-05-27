const redisClient = require('../../util/redis')

class UpdateOrderFiveTicks {
  static async updateOrderFiveTicks(redisKeyPrefix, newOrderPrice, newOrderQuantity, operator) {
    let scoreForVal = parseInt(newOrderPrice * 100)
      .toString()
      .padStart(5, '0')
    let score = parseInt(scoreForVal, 10)
    let fiveTicksSize
    // get the quantity of the current price
    let [orderFiveTicks, orderFiveTicksScore] = await redisClient.zrange(
      `${redisKeyPrefix}-fiveTicks`,
      score,
      score,
      'BYSCORE',
      'WITHSCORES'
    )
    if (orderFiveTicks === undefined) {
      fiveTicksSize = scoreForVal + newOrderQuantity.toString()
      await redisClient.zadd(`${redisKeyPrefix}-fiveTicks`, score, fiveTicksSize)
      return
    }

    orderFiveTicks = orderFiveTicks.slice(5)
    let originalQuantity = parseInt(orderFiveTicks)
    let newQuantity
    if (operator === '+') {
      newQuantity = originalQuantity + newOrderQuantity
      fiveTicksSize = scoreForVal + newQuantity.toString()
    } else if (operator === '-') {
      newQuantity = originalQuantity - newOrderQuantity
      fiveTicksSize = scoreForVal + newQuantity.toString()
    } else {
      console.error('UpdateOrderFiveTicks error: no operator')
    }

    await redisClient.zremrangebyscore(`${redisKeyPrefix}-fiveTicks`, score, score)
    if (newQuantity > 0) {
      // If the quatity less than 1, the tick can not add to the sorted set
      await redisClient.zadd(`${redisKeyPrefix}-fiveTicks`, score, fiveTicksSize)
    }
  }
}

module.exports = { UpdateOrderFiveTicks }

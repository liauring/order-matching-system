const redisClient = require('../../util/Redis')

class NewOrderFiveTicks {
  async addNewOrderFiveTicks(redisKeyPrefix, newOrderPrice, newOrderQuantity, operator) {
    let scoreForVal = parseInt(newOrderPrice * 100)
      .toString()
      .padStart(5, '0')
    let score = parseInt(scoreForVal, 10)
    let fiveTicksSize
    // 取現在該價格的值
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
      console.error('addNewOrderFiveTicks error: no operator')
    }

    await redisClient.zremrangebyscore(`${redisKeyPrefix}-fiveTicks`, score, score)
    if (newQuantity > 0) {
      //防止減到零還存入五檔
      await redisClient.zadd(`${redisKeyPrefix}-fiveTicks`, score, fiveTicksSize)
    }
    return
  }
}

module.exports = { NewOrderFiveTicks }

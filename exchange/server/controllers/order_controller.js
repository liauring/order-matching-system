const redisClient = require('../../util/redis')
let { CurrentFiveTicks, UpdateOrderFiveTicks } = require('../../core/FiveTicks')

const updateOrder = async (req, res) => {
  //get redis lock
  let requestTimeForLock = new Date().getTime()
  let waitingPeriod, orderIsLock, stockSetIsLock, fiveTicksIsLock
  do {
    orderIsLock = await redisClient.setnx(`lock-${orderID}`, 'updateOrder')
    stockSetIsLock = await redisClient.setnx(`lock-${symbol}-${BS}`, 'updateOrder')
    fiveTicksIsLock = await redisClient.setnx(`lock-${symbol}-${BS}-fiveTicks`, 'updateOrder')
    let currentTime = new Date().getTime()
    waitingPeriod = currentTime - requestTimeForLock
  } while ((orderIsLock == 0 || stockSetIsLock == 0 || fiveTicksIsLock == 0) && waitingPeriod < 5000)

  if (orderIsLock == 0 || stockSetIsLock == 0 || fiveTicksIsLock == 0) {
    return res.status(500).json('Please try again later.') //TODO:error handling
  }
  //------------------

  let { orderID, symbol, quantity, BS } = req.body
  orderID = parseInt(orderID)
  symbol = parseInt(symbol)
  quantity = parseInt(quantity)

  let orderInfo = await redisClient.get(`${orderID}`)

  if (!orderInfo) {
    // await redisClient.set(`updateOrderNotMatch-${orderInfo.orderID}`, quantity)
    await releaseRedisLock(orderID, BS, symbol)
    return res.status(400).json('There is not unmatched order. Try again later.')
  }

  orderInfo = JSON.parse(orderInfo)
  await redisClient.del(`${orderID}`)
  orderInfo.quantity = parseInt(orderInfo.quantity)
  orderInfo.quantity -= quantity

  let response
  if (orderInfo.quantity <= 0) {
    // delete the order in the zset of redis
    await redisClient.zrem(`${symbol}-${BS}`, orderID.toString())
    response = {
      orderStatus: 0, //delete remaining order
      quantity: 0,
      price: orderInfo.price,
      orderTime: orderInfo.orderTime,
      orderID: orderInfo.orderID,
    }
  } else {
    await redisClient.set(`${orderID}`, JSON.stringify(orderInfo))
    response = {
      orderStatus: orderInfo.orderStatus,
      quantity: orderInfo.quantity,
      price: orderInfo.price,
      orderTime: orderInfo.orderTime,
      orderID: orderInfo.orderID,
    }
  }

  //update fiveTicks
  let newFiveTicks = new CurrentFiveTicks(symbol)
  let fiveTicks = await newFiveTicks.getFiveTicks()
  let dealerFiveTicks = fiveTicks[BS]
  for (let i = 0; i < dealerFiveTicks.length; i++) {
    if (dealerFiveTicks[i].price == orderInfo.price) {
      await new UpdateOrderFiveTicks().updateOrderFiveTicks(`${symbol}-${BS}`, orderInfo.price, quantity, '-')
      let getCurrentFiveTicks = new CurrentFiveTicks(symbol)
      let updatedFiveTicks = await getCurrentFiveTicks.getFiveTicks()
      console.debug('[fiveTicks]', updatedFiveTicks)
      await redisClient.publish('fiveTicks', JSON.stringify(updatedFiveTicks))
      break
    }
  }

  //release redis lock
  await releaseRedisLock(orderID, BS, symbol)
  return res.status(200).json(response)
}

async function releaseRedisLock(orderID, BS, symbol) {
  let lockOrderValue = await redisClient.get(`lock-${orderID}`)
  let lockStockValue = await redisClient.get(`lock-${symbol}-${BS}`)
  let lockFiveTicksValue = await redisClient.get(`lock-${symbol}-${BS}-fiveTicks`)
  if (lockOrderValue === 'updateOrder') {
    await redisClient.del(`lock-${orderID}`)
  }
  if (lockStockValue === 'updateOrder') {
    await redisClient.del(`lock-${symbol}-${BS}`)
  }
  if (lockFiveTicksValue === 'updateOrder') {
    await redisClient.del(`lock-${symbol}-${BS}-fiveTicks`)
  }
}

// updateOrder.body {
//   orderID: int
//   symbol:  int
//   quantity:  int
//   BS:  string
// }

module.exports = { updateOrder }

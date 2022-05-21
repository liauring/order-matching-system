const redisClient = require('../../util/redis')

// TODO: 錯誤處理：1.找不到orderID
const updateOrder = async (req, res) => {
  let { orderID, symbol, quantity, BS } = req.body
  orderID = parseInt(orderID)
  symbol = parseInt(symbol)
  quantity = parseInt(quantity)

  //get redis lock
  let requestTimeForLock = new Date().getTime()
  let waitingPeriod, orderIsLock, stockSetIsLock, fiveTicksIsLock
  do {
    orderIsLock = await redisClient.setnx(`lock-${orderID}`, 'updateOrder')
    stockSetIsLock = await redisClient.setnx(`lock-${symbol}-${BS}`, 'updateOrder')
    let currentTime = new Date().getTime()
    waitingPeriod = currentTime - requestTimeForLock
  } while ((orderIsLock == 0 || stockSetIsLock == 0) && waitingPeriod < 30000)

  if (orderIsLock == 0 || stockSetIsLock == 0) {
    res.status(500).json('Please try again later.') //TODO:error handling
  }

  let orderInfo = await redisClient.get(`${orderID}`)
  orderInfo = JSON.parse(orderInfo)
  await redisClient.del(`${orderID}`)
  orderInfo.quantity = parseInt(orderInfo.quantity)
  orderInfo.quantity -= quantity
  if (orderInfo.quantity <= 0) {
    // 刪除redis裏zset的order
    await redisClient.zrem(`${symbol}-${BS}`, orderID.toString())
    let response = {
      orderStatus: 0, //剩餘委託刪除
      quantity: 0,
      price: orderInfo.price,
      orderTime: orderInfo.orderTime,
      orderID: orderInfo.orderID,
    }
    res.status(200).json(response)
  }
  await redisClient.set(`${orderID}`, JSON.stringify(orderInfo))
  let response = {
    orderStatus: orderInfo.orderStatus,
    quantity: orderInfo.quantity,
    price: orderInfo.price,
    orderTime: orderInfo.orderTime,
    orderID: orderInfo.orderID,
  }

  let lockOrderValue = await redisClient.get(`lock-${orderID}`)
  let lockStockValue = await redisClient.get(`lock-${symbol}-${BS}`)
  if (lockOrderValue === 'updateOrder') {
    await redisClient.del(`lock-${orderID}`)
  }
  if (lockStockValue === 'updateOrder') {
    await redisClient.del(`lock-${symbol}-${BS}`)
  }
  //TODO:五檔也要更新
  res.status(200).json(response)
}

// updateOrder.body {
//   orderID: int
//   symbol:  int
//   quantity:  int
//   BS:  string
// }

module.exports = { updateOrder }

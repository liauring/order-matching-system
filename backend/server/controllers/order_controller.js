const redisClient = require('../../util/cache')

// TODO: 錯誤處理：1.找不到orderID
const updateOrder = async (req, res) => {
  let { orderID, symbol, quantity, BS } = req.body
  orderID = parseInt(orderID)
  symbol = parseInt(symbol)
  quantity = parseInt(quantity)
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
    return res.send(response)
  }
  await redisClient.set(`${orderID}`, JSON.stringify(orderInfo))
  let response = {
    orderStatus: orderInfo.orderStatus,
    quantity: orderInfo.quantity,
    price: orderInfo.price,
    orderTime: orderInfo.orderTime,
    orderID: orderInfo.orderID,
  }

  res.status(200).json(response)
}

// updateOrder.body {
//   orderID: int
//   symbol:  int
//   quantity:  int
//   BS:  string
// }

module.exports = { updateOrder }

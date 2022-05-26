const axios = require('axios').default
const { getOrderInfo, getOrderInfoSingle, updateOrderInfo, createOrderHistory } = require('../models/order_model')

const getOrder = async (req, res) => {
  let { account, symbol } = req.body
  account = parseInt(account)
  symbol = parseInt(symbol)
  let response = await getOrderInfo(account, symbol)
  return res.status(200).json(response)
}

// postOrder.body {
//   account: int,
//   symbol: int
// }

const updateOrder = async (req, res) => {
  let reqBody = req.body
  let updateResponse = await axios.patch(`${process.env.apiHost}/api/order`, reqBody)
  await updateOrderInfo(updateResponse.data)
  await createOrderHistory(reqBody, updateResponse.data)
  let response = await getOrderInfoSingle(updateResponse.data.orderID)
  return res.status(200).json(response[0])
}

// updateOrder.body {
//   orderID: int
//   quantity:  int
//   symbol: int
// }

// patch.res  = {
//   orderStatus: orderInfo.orderStatus,
//   quantity: orderInfo.quantity,
//   price: orderInfo.price,
//   executionCount: -1,
//   orderTime: orderInfo.orderTime,
//   orderID: orderInfo.orderID
// }

module.exports = { getOrder, updateOrder }

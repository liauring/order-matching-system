const axios = require('axios').default
const { getOrderInfo, getOrderInfoSingle, updateOrderInfo, createOrderHistory } = require('../modals/order_modal')

const getOrder = async (req, res) => {
  let { account, symbol } = req.body
  account = parseInt(account)
  symbol = parseInt(symbol)
  let response = await getOrderInfo(account, symbol)
  res.status(200).json(response)
}

// postOrder.body {
//   account: int,
//   symbol: int
// }

// TODO: 錯誤處理：1.找不到orderID
const updateOrder = async (req, res) => {
  let reqBody = req.body
  let updateResponse = await axios.patch(`${process.env.apiHost}/api/order`, reqBody)
  await updateOrderInfo(updateResponse.data)
  await createOrderHistory(reqBody, updateResponse.data)
  let response = await getOrderInfoSingle(updateResponse.data.orderID)
  res.status(200).json(response[0])
}

// updateOrder.body {
//   orderID: int
//   price: float
//   quantity:  int
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

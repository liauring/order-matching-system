const axios = require('axios').default
const { createNewOrder, createNewOrderHistory } = require('../models/newOrder_model')

const postNewOrder = async (req, res, next) => {
  let reqBody = req.body
  console.log('broker getNewBody request', reqBody)
  let getNewBody = await axios.post(`${process.env.apiHost}/api/newOrder/orderID`, reqBody)
  console.log('broker getNewBody response from exchange api', getNewBody.data)
  await createNewOrder(getNewBody.data)
  await createNewOrderHistory(getNewBody.data)
  let response = await axios.post(`${process.env.apiHost}/api/newOrder`, getNewBody.data)

  return res.status(200).json(response.data)
}

// newOrder.body {
//   account: '3', //改int
//   broker: 1030,
//   symbol: '2330',  //改int
//   BS: 'seller',
//   orderType: 'limit',
//   duration: 'ROD',
//   price: 105,
//   quantity: 20,
//   brokerName: '土銀' (1020:合庫),
//   symbolName: '台積電',
//   createTime -> for mysql only
// x orderTime: 836452,
// x orderID: 10500836452,
// x orderStatus: 1
// }

//  postAPI.res = {
//       orderStatus: 1,
//       symbol: this.order.symbol,
//       quantity: this.order.quantity,
//       price: this.order.price,
//       executionQuantity: 0,
//       orderTime: this.time.toLocaleString(),
//       orderID: this.order.orderID,
//       BS: this.order.BS
//  }

module.exports = { postNewOrder }

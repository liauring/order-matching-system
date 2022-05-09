const axios = require('axios').default
const { createNewOrder, createNewOrderHistory } = require('../modals/newOrder_modal')

const postNewOrder = async (req, res, next) => {
  let getNewBody = await axios.get(`${process.env.apiHost}/api/newOrder`, req.body)
  await createNewOrder(getNewBody.data)
  await createNewOrderHistory(getNewBody.data)
  let response = await axios.post(`${process.env.apiHost}/api/newOrder`, getNewBody)

  res.status(200).json(response.data)
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

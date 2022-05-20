const BSLogicMap = require('../../core/BSLogic')[0]
const redisClient = require('../../util/redis')
const { QueueProvider } = require('../../serviceProviders/queue_provider')

const getNewOrderID = async (req, res, next) => {
  await QueueProvider.connect()
  let dealer = new BSLogicMap[req.body.BS](req.body, QueueProvider)
  dealer.formatOrder()
  dealer.orderTimeInDayPeriod()
  dealer.createOrderID()
  dealer.createGetOrderResponse()
  res.status(200).json(dealer.order)
}

const postNewOrder = async (req, res, next) => {
  await QueueProvider.connect()
  let dealer = new BSLogicMap[req.body.BS](req.body, QueueProvider)
  dealer.formatOrder()
  await dealer.shardingToRabbitmq()
  let orderResponse = dealer.createOrderResponse()
  res.status(200).json(orderResponse)
}

const postNewOrderStressTest = async (req, res, next) => {
  await QueueProvider.connect()
  await redisClient.incr('requestCount')
  let dealer = new BSLogicMap[req.body.BS](req.body, QueueProvider)
  dealer.formatOrder()
  dealer.orderTimeInDayPeriod()
  dealer.createOrderID()
  await dealer.shardingToRabbitmq()
  let orderResponse = dealer.createOrderResponse()
  res.status(200).json(orderResponse)
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
// x orderStatus: '未成交'
// }

module.exports = { getNewOrderID, postNewOrder, postNewOrderStressTest }

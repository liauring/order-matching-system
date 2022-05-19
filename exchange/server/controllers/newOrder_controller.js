const BSLogicMap = require('../../core/BSLogic')[0]
const redisClient = require('../../util/cache')
const { QueueProvider } = require('../../serviceProvider/queue')

let queueProvier

//TODO:委託失敗失敗：每個都要有值/沒有單可以賣/沒有註冊過
//不做：沒有這個broker/沒有這檔股票
// ;(async () => {
//   let rabbitmqConn = await rabbitmqCreateConnect()
//   console.log('newOrder')
//   queueProvier = new QueueProvider(rabbitmqConn)
// })()

const getNewOrderID = async (req, res, next) => {
  let queueProvier = await QueueProvider.getInstance()
  let dealer = new BSLogicMap[req.body.BS](req.body, queueProvier)
  dealer.formatOrder()
  dealer.orderTimeInDayPeriod()
  dealer.createOrderID()
  dealer.createGetOrderResponse()
  res.status(200).json(dealer.order)
}

const postNewOrder = async (req, res, next) => {
  let queueProvier = await QueueProvider.getInstance()
  let dealer = new BSLogicMap[req.body.BS](req.body, queueProvier)
  dealer.formatOrder()
  // dealer.orderTimeInDayPeriod()
  // dealer.createOrderID()
  await dealer.shardingToRabbitmq()
  let orderResponse = dealer.createOrderResponse()
  res.status(200).json(orderResponse)
}

const postNewOrderStressTest = async (req, res, next) => {
  await redisClient.incr('requestCount')
  let queueProvier = await QueueProvider.getInstance()
  let dealer = new BSLogicMap[req.body.BS](req.body, queueProvier)
  dealer.formatOrder()
  dealer.orderTimeInDayPeriod()
  dealer.createOrderID()
  //----- for stress test -----
  dealer.getOrderIDForJourneyTime()
  dealer.getRequestTime()
  await dealer.getRabbitmqLength('matchNewOrder-stock-0')
  //----------
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

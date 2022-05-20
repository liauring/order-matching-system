require('dotenv').config({ path: __dirname + '/./../.env' })
const redisClient = require('../util/Redis')
const BSLogicMap = require('../core/BSLogic')[1]
const CONSUMEQUEUE = 'matchNewOrder-stock-0'
const { CurrentFiveTicks } = require('../core/FiveTicks')
const { QueueProvider } = require('../serviceProviders/queue_provider')

async function matchLogic(orderFromQueue) {
  let order = JSON.parse(orderFromQueue.content.toString())
  let { BS } = order
  let dealer = new BSLogicMap[BS](order, QueueProvider)

  try {
    await dealer.matchWorkFlow()
  } catch (error) {
    console.error(error)
    saveLogs('logsOfNewOrderExchange-Error')
  } finally {
    let newFiveTicks = new CurrentFiveTicks(order.symbol)
    let fiveTicks = await newFiveTicks.getFiveTicks()
    console.debug('[fiveTicks]', fiveTicks)
    await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks))
    QueueProvider.queueConnect.ack(orderFromQueue)
  }
}

;(async () => {
  await QueueProvider.connect()
  QueueProvider.prefetch(1)
  QueueProvider.consumeQueue(CONSUMEQUEUE, matchLogic)
})()

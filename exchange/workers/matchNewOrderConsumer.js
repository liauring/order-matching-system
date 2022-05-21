require('dotenv').config({ path: __dirname + '/./../.env' })
const redisClient = require('../util/redis')
const BSLogicMap = require('../core/BSLogic')[1]
const CONSUMEQUEUE = 'matchNewOrder-stock-0'
const { CurrentFiveTicks } = require('../core/FiveTicks')
const { QueueProvider } = require('../serviceProviders/queue_provider')
const { CacheProvider } = require('../serviceProviders/cach_provider')
const { saveLogs } = require('../util/util')

async function matchLogic(orderFromQueue) {
  let order = JSON.parse(orderFromQueue.content.toString())
  let { BS } = order
  let dealer = new BSLogicMap[BS](order, QueueProvider, CacheProvider)

  try {
    //get redis lock
    let requestTimeForLock = new Date().getTime()
    let waitingPeriod, orderIsLock, stockSetIsLock
    do {
      orderIsLock = await redisClient.setnx(`lock-${dealer.order.orderID}`, 'updateOrder')
      stockSetIsLock = await redisClient.setnx(`lock-${dealer.order.symbol}-${dealer.order.BS}`, 'updateOrder')
      let currentTime = new Date().getTime()
      waitingPeriod = currentTime - requestTimeForLock
    } while ((orderIsLock == 0 || stockSetIsLock == 0) && waitingPeriod < 30000)
    if (orderIsLock == 0 || stockSetIsLock == 0) {
      let error = new Error('Can not get redis lock.')
      throw error
    }
    await dealer.matchWorkFlow()
  } catch (error) {
    console.error(error)
    saveLogs('logsOfNewOrderExchange-Error')
  } finally {
    let newFiveTicks = new CurrentFiveTicks(order.symbol)
    let fiveTicks = await newFiveTicks.getFiveTicks()
    console.debug('[fiveTicks]', fiveTicks)
    await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks))

    //release redis lock
    let lockOrderValue = await redisClient.get(`lock-${dealer.order.orderID}`)
    let lockStockValue = await redisClient.get(`lock-${dealer.order.symbol}-${dealer.order.BS}`)
    if (lockOrderValue === 'updateOrder') {
      await redisClient.del(`lock-${dealer.order.orderID}`)
    }
    if (lockStockValue === 'updateOrder') {
      await redisClient.del(`lock-${dealer.order.symbol}-${dealer.order.BS}`)

      QueueProvider.queueConnect.ack(orderFromQueue)
    }
  }
}

;(async () => {
  await QueueProvider.connect()
  QueueProvider.prefetch(1)
  QueueProvider.consumeQueue(CONSUMEQUEUE, matchLogic)
})()

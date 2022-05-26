require('dotenv').config({ path: __dirname + '/./../.env' })
const redisClient = require('../util/redis')
const BSDealerInfoMap = require('../core/BSLogic').dealerInfo
const CONSUMEQUEUE = 'matchNewOrder-stock-0'
const { DealerProvider } = require('../core/BSLogic/DealerProvider')
const { ExecutionUpdater } = require('../core/BSLogic/ExecutionUpdater')
const { CurrentFiveTicks } = require('../core/FiveTicks')
const { QueueProvider } = require('../core/BSLogic/serviceProviders/queue_provider')
const { CacheProvider } = require('../core/BSLogic/serviceProviders/cach_provider')
const { MatchLogic } = require('../core/BSLogic/MainMatchLogic')
const { saveLogs } = require('../util/util')

async function matchLogic(orderFromQueue) {
  let order = JSON.parse(orderFromQueue.content.toString())
  let { BS } = order
  let dealerInfo = new BSDealerInfoMap[BS](order.price)
  let dealerProvider = new DealerProvider(dealerInfo, order.symbol, CacheProvider)
  let executionUpdater = new ExecutionUpdater(QueueProvider, CacheProvider)
  let matchLogic = new MatchLogic(order, dealerProvider, QueueProvider, CacheProvider, executionUpdater)

  try {
    //get redis lock
    // let requestTimeForLock = new Date().getTime()
    // let waitingPeriod, orderIsLock, stockSetIsLock
    // do {
    //   orderIsLock = await redisClient.setnx(`lock-${matchLogic.order.orderID}`, 'updateOrder')
    //   stockSetIsLock = await redisClient.setnx(`lock-${matchLogic.order.symbol}-${matchLogic.order.BS}`, 'updateOrder')
    //   let currentTime = new Date().getTime()
    //   waitingPeriod = currentTime - requestTimeForLock
    // } while ((orderIsLock == 0 || stockSetIsLock == 0) && waitingPeriod < 30000)
    // if (orderIsLock == 0 || stockSetIsLock == 0) {
    //   let error = new Error('Can not get redis lock.')
    //   throw error
    // }

    await matchLogic.matchWorkFlow()
  } catch (error) {
    console.error(error)
    saveLogs('logsOfNewOrderExchange-Error')
  } finally {
    let newFiveTicks = new CurrentFiveTicks(order.symbol)
    let fiveTicks = await newFiveTicks.getFiveTicks()
    console.debug('[fiveTicks]', fiveTicks)
    await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks))

    //release redis lock
    // let lockOrderValue = await redisClient.get(`lock-${matchLogic.order.orderID}`)
    // let lockStockValue = await redisClient.get(`lock-${matchLogic.order.symbol}-${matchLogic.order.BS}`)
    // if (lockOrderValue === 'updateOrder') {
    //   await redisClient.del(`lock-${matchLogic.order.orderID}`)
    // }
    // if (lockStockValue === 'updateOrder') {
    //   await redisClient.del(`lock-${matchLogic.order.symbol}-${matchLogic.order.BS}`)

    QueueProvider.queueConnect.ack(orderFromQueue)
    // }
  }
}

;(async () => {
  await QueueProvider.connect()
  QueueProvider.prefetch(1)
  QueueProvider.consumeQueue(CONSUMEQUEUE, matchLogic)
})()

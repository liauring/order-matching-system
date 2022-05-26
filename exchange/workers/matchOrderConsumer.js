require('dotenv').config({ path: __dirname + '/./../.env' })
const redisClient = require('../util/redis')
const BSDealerInfoMap = require('../core/MatchLogic').dealerInfo
const CONSUMEQUEUE = 'matchNewOrder-stock-0'
const { DealerProvider } = require('../core/MatchLogic/DealerProvider')
const { ExecutionUpdater } = require('../core/MatchLogic/ExecutionUpdater')
const { CurrentFiveTicks } = require('../core/FiveTicks')
const { QueueProvider } = require('../core/MatchLogic/serviceProviders/queue_provider')
const { CacheProvider } = require('../core/MatchLogic/serviceProviders/cach_provider')
const { MatchLogic } = require('../core/MatchLogic/MainMatchLogic')
const { saveLogs } = require('../util/util')

async function matchLogic(orderFromQueue) {
  let order = JSON.parse(orderFromQueue.content.toString())
  //get redis lock
  let requestTimeForLock = new Date().getTime()
  let waitingPeriod, orderIsLock, stockSetIsLock, fiveTicksIsLock
  do {
    orderIsLock = await redisClient.setnx(`lock-${order.orderID}`, 'match')
    stockSetIsLock = await redisClient.setnx(`lock-${order.symbol}-${order.BS}`, 'match')
    fiveTicksIsLock = await redisClient.setnx(`lock-${order.symbol}-${order.BS}-fiveTicks`, 'match')
    let currentTime = new Date().getTime()
    waitingPeriod = currentTime - requestTimeForLock
  } while ((orderIsLock == 0 || stockSetIsLock == 0 || fiveTicksIsLock == 0) && waitingPeriod < 5000)
  if (orderIsLock == 0 || stockSetIsLock == 0 || fiveTicksIsLock == 0) {
    let error = new Error('Can not get redis lock.')
    throw error
  }
  //----------------------

  //check if the order was updated before matching
  // let updateQuantity = await redisClient.get(`updateOrderNotMatch-${order.orderID}`)
  // if (updateQuantity) {
  //   order.quantity -= updateQuantity
  //   if (order.quantity <= 0) {
  //     return
  //   }
  // }
  //---------------

  let { BS } = order
  let dealerInfo = new BSDealerInfoMap[BS](order.price)
  let dealerProvider = new DealerProvider(dealerInfo, order.symbol, CacheProvider)
  let executionUpdater = new ExecutionUpdater(QueueProvider, CacheProvider)
  let matchLogic = new MatchLogic(order, dealerProvider, QueueProvider, CacheProvider, executionUpdater)

  try {
    await matchLogic.matchWorkFlow()
  } catch (error) {
    console.error(error)
    saveLogs('logsOfNewOrderExchange-Error')
  } finally {
    let newFiveTicks = new CurrentFiveTicks(order.symbol)
    let fiveTicks = await newFiveTicks.getFiveTicks()
    console.debug('[fiveTicks]', fiveTicks)
    await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks))

    // release redis lock
    let lockOrderValue = await redisClient.get(`lock-${order.orderID}`)
    let lockStockValue = await redisClient.get(`lock-${order.symbol}-${order.BS}`)
    let lockFiveTicksValue = await redisClient.get(`lock-${order.symbol}-${order.BS}-fiveTicks`)
    let lockDealerValue = await redisClient.get(`lock-${dealerProvider.orderID}`)
    if (lockOrderValue === 'match') {
      await redisClient.del(`lock-${order.orderID}`)
    }
    if (lockStockValue === 'match') {
      await redisClient.del(`lock-${order.symbol}-${order.BS}`)
    }
    if (lockFiveTicksValue === 'match') {
      await redisClient.del(`lock-${order.symbol}-${order.BS}-fiveTicks`)
    }
    if (lockDealerValue === 'match') {
      await redisClient.del(`lock-${dealerProvider.orderID}`)
    }

    QueueProvider.queueConnect.ack(orderFromQueue)
  }
}

;(async () => {
  await QueueProvider.connect()
  QueueProvider.prefetch(1)
  QueueProvider.consumeQueue(CONSUMEQUEUE, matchLogic)
})()

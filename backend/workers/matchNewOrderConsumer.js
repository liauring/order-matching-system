require('dotenv').config({ path: __dirname + '/./../.env' })
const redisClient = require('../util/cache')
let { rabbitmqConn } = require('../util/rabbitmq')
const BSLogicMap = require('../core/BSLogic')[1]
const CONSUMEQUEUE = 'matchNewOrder-stock-0'
const { CurrentFiveTicks, NewOrderFiveTicks } = require('../core/FiveTicks')

;(async () => {
  rabbitmqConn = await rabbitmqConn
  rabbitmqConn.prefetch(1)
  rabbitmqConn.consume(
    CONSUMEQUEUE,
    async (newOrder) => {
      let order = JSON.parse(newOrder.content.toString())
      let { BS } = order
      let dealer = new BSLogicMap[BS](order)
      try {
        do {
          await dealer.getBestDealerOrderID()
          if (!(await dealer.haveBestDealer())) {
            return
          }
          await dealer.getBestDealerOrderInfo()
          await dealer.deleteBestDealer()
          await dealer.matchExecutionQuantity()
          dealer.createExecutionIDAndTime()
          dealer.createExecutionDetail()
          dealer.createExecutionBuyer()
          dealer.createExecutionSeller()
          await dealer.sendExecutionToRabbitmqForStorage()
          dealer.createExecutionMsg()
          await dealer.emitExeuction()
          dealer.createkLineInfo()
          await dealer.emitKLine()
        } while (dealer.hasRemainingQuantity)
        // rabbitmqConn.ack(newOrder)
      } catch (error) {
        console.error(error)
        //TODO:rabbitmqConn.ack false
      } finally {
        let newFiveTicks = new CurrentFiveTicks(order.symbol)
        let fiveTicks = await newFiveTicks.getFiveTicks()
        // console.debug('[fiveTicks]', fiveTicks)
        await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks))
        rabbitmqConn.ack(newOrder)
      }
    },
    { noAck: false }
  )
})()

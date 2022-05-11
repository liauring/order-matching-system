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
          // //----- for stress test -----
          dealer.getOrderIDForMatchTime()
          dealer.getOrderFromRabbitMQTime()
          // //----------

          await dealer.getBestDealerOrderID()
          if (!(await dealer.haveBestDealer())) {
            //----- for stress test -----
            // dealer.getMatchFinishTimeNotExec()
            // dealer.getExecutionFinishTimeNotExec()
            // dealer.addEmptyValueForSocket()
            // await dealer.sendOrderTimeToRabbitMQ()
            // dealer.deleteMatchTime()
            //----------
            return
          }

          await dealer.getBestDealerOrderInfo()
          await dealer.deleteBestDealer()
          await dealer.matchExecutionQuantity()
          //----- for stress test -----
          dealer.getMatchFinishTime()
          //----------
          dealer.createExecutionIDAndTime()
          dealer.createExecutionDetail()
          dealer.createExecutionBuyer()
          dealer.createExecutionSeller()
          await dealer.sendExecutionToRabbitmqForStorage()
          //----- for stress test -----
          dealer.getExecutionFinishTime()
          //----------
          dealer.createExecutionMsg()
          await dealer.emitExeuction()
          dealer.createkLineInfo()
          await dealer.emitKLine()

          //----- for stress test -----

          dealer.deleteMatchTime()
          // await dealer.sendOrderTimeToRabbitMQ() socketSub 才送rabbitmq
          //----------
        } while (dealer.hasRemainingQuantity)
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

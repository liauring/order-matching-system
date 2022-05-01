require('dotenv').config();
const redisClient = require('./util/cache');
let { rabbitmqConn } = require('./util/rabbitmq');
const BSLogicMap = require('./BSLogic');
const CONSUMEQUEUE = 'matchNewOrder-stock-0';
let { getFiveTicks } = require('./FiveTicks');


// const BSClassMap = { buyer: BuyerMatchLogic, seller: SellerMatchLogic };

(async () => {
  rabbitmqConn = await rabbitmqConn;
  rabbitmqConn.prefetch(1);
  rabbitmqConn.consume(CONSUMEQUEUE, async (newOrder) => {
    let order = JSON.parse(newOrder.content.toString());
    let { BS } = order;
    let dealer = new BSLogicMap[BS](order);
    try {
      do {
        await dealer.getBestDealerOrderID();
        if (!(await dealer.haveBestDealer())) {
          return
        };
        await dealer.getBestDealerOrderInfo();
        await dealer.deleteBestDealer();
        await dealer.matchExecutionQuantity();
        dealer.createExecutionIDAndTime();
        dealer.createExecutionDetail();
        dealer.createExecutionBuyer();
        dealer.createExecutionSeller();
        await dealer.sendExecutionToRabbitmqForStorage();
        dealer.createExecutionMsg();
        await dealer.emitExeuction();
        dealer.createkLineInfo();
        await dealer.emitKLine();
      } while (dealer.hasRemainingQuantity)
    } catch (error) {
      console.error(error)
    } finally {
      let fiveTicks = await getFiveTicks(order.symbol);
      console.debug('[fiveTicks]', fiveTicks)
      await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks));
      rabbitmqConn.ack(newOrder);
    }
  }, { noAck: false })
})();
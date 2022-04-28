//市價api切在哪

class buyerMatchLogic {
  constructor(order) {
    this.order = order;

  }

  getBestDealerOrderID() {
    return await redisClient.zrange(`${symbol}-seller`, 0, 0, 'WITHSCORES');
  }

  haveBestDealer(bestSellerOrderID, bestSellerScore, order) {
    if (bestSellerOrderID === undefined || parseInt(bestSellerScore.toString().slice(0, -8)) > price * 100) {
      await addNewBuyer(order);
      await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, order.quantity, '+')
      return; //TODO:怎麼整個return >> true false判斷return
    }
    return
  }

  getBestDealerOrderInfo(bestSellerOrderID) {
    return await redisClient.get(bestSellerOrderID)
  }

  deleteBestDealer(bestSellerOrderID) {
    await redisClient.zrem(`${symbol}-seller`, bestSellerOrderID);
    await redisClient.del(`${bestSellerOrderID}`)
    return
  }

  matchExecutionQuantity(bestSeller, order, hasRemainingQuantity) {
    let finalQTY
    if (quantity === bestSeller.quantity) {
      finalQTY = quantity;
      hasRemainingQuantity = false;
      order.orderStatus = '完全成交';
      bestSeller.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${order.symbol}-seller`, bestSeller.price, finalQTY, '-')
    } else if (quantity < bestSeller.quantity) {
      finalQTY = quantity
      bestSeller.quantity -= quantity;
      await redisClient.zadd(`${symbol}-seller`, bestSellerScore, JSON.stringify(bestSeller.orderID));
      await redisClient.set(`${bestSeller.orderID}`, JSON.stringify(bestSeller));
      hasRemainingQuantity = false;
      order.orderStatus = '完全成交';
      bestSeller.orderStatus = '部分成交';
      await addNewOrderFiveTicks(`${order.symbol}-seller`, bestSeller.price, finalQTY, '-')
    } else if (quantity > bestSeller.quantity) {
      finalQTY = bestSeller.quantity;
      quantity -= bestSeller.quantity;
      order.quantity = quantity;
      hasRemainingQuantity = true;
      order.orderStatus = '部分成交';
      bestSeller.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${order.symbol}-seller`, bestSeller.price, finalQTY, '-')
    } else {
      console.error('matchNewOrderConsumer0-buyer condition Error')
    }
    return { bestSeller, order, hasRemainingQuantity } //TODO: 確認變數都可以帶回global
  }

  sendExecutionToRabbitmqForStorage(pubQueue, executionDetail) {
    return await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(executionDetail)), { deliveryMode: true });
  }

  emitExeuction(execSellerMessage, execBuyerMessage) {
    await redisClient.publish('sendExec', JSON.stringify(execSellerMessage));
    await redisClient.publish('sendExec', JSON.stringify(execBuyerMessage));
    return
  }

  emitKLine(kLineInfo) {
    return await redisClient.publish('kLine', JSON.stringify(kLineInfo))
  }



}
require('dotenv').config();
const redisClient = require('./util/cache');
const { v4: uuidv4 } = require('uuid');
let { rabbitmqConn } = require('./util/rabbitmq');
const consumeQueue = 'matchNewOrder-stock-0';
const pubQueue = 'saveNewExec';


// TODO: 包成class
(async () => {
  rabbitmqConn = await rabbitmqConn;
  rabbitmqConn.prefetch(1);
  rabbitmqConn.consume(consumeQueue, async (newOrder) => {
    let order = JSON.parse(newOrder.content.toString())
    let { symbol, BS, price, quantity } = order;
    let hasRemainingQuantity = false;
    let bestBuyerOrderID, bestBuyer, bestBuyerScore, bestSellerOrderID, bestSeller, bestSellerScore;
    try {
      if (BS === 'buyer') {
        do {
          // getBestDealerOrderID()
          [bestSellerOrderID, bestSellerScore] = await redisClient.zrange(`${symbol}-seller`, 0, 0, 'WITHSCORES');

          // haveBestDealer(bestSellerOrderID,bestSellerScore,order)
          if (bestSellerOrderID === undefined || parseInt(bestSellerScore.toString().slice(0, -8)) > price * 100) {
            await addNewBuyer(order);
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, order.quantity, '+')
            return;
          }

          // getBestDealerOrderInfo(bestSellerOrderID)
          bestSeller = await redisClient.get(bestSellerOrderID)
          bestSeller = JSON.parse(bestSeller); //上移


          // deleteBestDealer(bestSellerOrderID)
          await redisClient.zrem(`${symbol}-seller`, bestSellerOrderID);
          await redisClient.del(`${bestSellerOrderID}`)


          // matchExecutionQuantity(bestSeller, order, hasRemainingQuantity)
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

          let executionID = uuidv4(); //下移
          let executionTime = (+new Date())


          let executionDetail = {
            executionID: executionID,
            executionTime: executionTime,
            seller: bestSeller.account,
            sellerOrderID: bestSeller.orderID,
            sellerOrderTime: bestSeller.orderTime,
            buyer: order.account,
            buyerOrderID: order.orderID,
            buyerOrderTime: order.orderTime,
            stock: order.symbol,
            price: bestSeller.price,
            quantity: finalQTY,
          }

          let executionBuyer = {
            executionID: executionID,
            executionTime: executionTime,
            orderID: order.orderID,
            orderTime: order.orderTime,
            stock: order.symbol,
            price: bestSeller.price,
            quantity: finalQTY,
            orderStatus: order.orderStatus,
          }

          let executionSeller = {
            executionID: executionID,
            executionTime: executionTime,
            orderID: bestSeller.orderID,
            orderTime: bestSeller.orderTime,
            stock: order.symbol,
            price: bestSeller.price,
            quantity: finalQTY,
            orderStatus: bestSeller.orderStatus,
          }

          let kLineInfo = {
            stock: order.symbol,
            price: bestSeller.price,
            executionTime: executionTime,
          }

          console.debug('[executionDetail]', executionDetail)

          // sendExecutionToRabbitmqForStorage(pubQueue, executionDetail)
          await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(executionDetail)), { deliveryMode: true });


          let execBuyerMessage = { brokerID: order.broker, execution: executionBuyer };
          let execSellerMessage = { brokerID: bestSeller.broker, execution: executionSeller };

          // socket.sendExec(order.broker, executionBuyer);
          // socket.sendExec(bestSeller.broker, executionSeller);

          // emitExeuction(execSellerMessage, execBuyerMessage)
          await redisClient.publish('sendExec', JSON.stringify(execSellerMessage));
          await redisClient.publish('sendExec', JSON.stringify(execBuyerMessage));

          // emitKLine(kLineInfo) 
          await redisClient.publish('kLine', JSON.stringify(kLineInfo))

        } while (hasRemainingQuantity);

      } else {

        do {

          [bestBuyerOrderID, bestBuyerScore] = await redisClient.zrange(`${symbol}-buyer`, -1, -1, 'WITHSCORES'); //TODO: race condition


          if (bestBuyerOrderID === undefined || parseInt(bestBuyerScore.toString().slice(0, -8)) < price * 100) {
            await addNewSeller(order);
            await addNewOrderFiveTicks(`${order.symbol}-seller`, order.price, order.quantity, '+')
            return;
          }

          bestBuyer = await redisClient.get(bestBuyerOrderID)
          bestBuyer = JSON.parse(bestBuyer);


          await redisClient.zrem(`${symbol}-buyer`, bestBuyerOrderID);
          await redisClient.del(`${bestBuyerOrderID}`)

          let finalQTY
          if (quantity === bestBuyer.quantity) {
            finalQTY = quantity;
            hasRemainingQuantity = false;
            order.orderStatus = '完全成交';
            bestBuyer.orderStatus = '完全成交';
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, bestBuyer.price, finalQTY, '-')
          } else if (quantity < bestBuyer.quantity) {
            finalQTY = quantity;
            bestBuyer.quantity -= quantity;
            await redisClient.zadd(`${symbol}-buyer`, bestBuyerScore, JSON.stringify(bestBuyer.orderID));
            await redisClient.set(`${bestBuyer.orderID}`, JSON.stringify(bestBuyer))
            hasRemainingQuantity = false;
            order.orderStatus = '完全成交';
            bestBuyer.orderStatus = '部分成交';
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, bestBuyer.price, finalQTY, '-')
          } else if (quantity > bestBuyer.quantity) {
            finalQTY = bestBuyer.quantity;
            quantity -= bestBuyer.quantity;
            newOrder.quantity = quantity;
            hasRemainingQuantity = true;
            order.orderStatus = '部分成交';
            bestBuyer.orderStatus = '完全成交';
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, bestBuyer.price, finalQTY, '-')
          } else {
            console.error('matchNewOrderConsumer0-seller condition Error')
          }


          let executionID = uuidv4();
          let executionTime = new Date();


          let executionDetail = {
            executionID: executionID,
            executionTime: executionTime,
            seller: order.account,
            sellerOrderID: order.orderID,
            sellerOrderTime: order.orderTime,
            buyer: bestBuyer.account,
            buyerOrderID: bestBuyer.orderID,
            buyerOrderTime: bestBuyer.orderTime,
            stock: order.symbol,
            price: bestBuyer.price,
            quantity: finalQTY,
          }

          let executionBuyer = {
            executionID: executionID,
            executionTime: executionTime,
            orderID: bestBuyer.orderID,
            orderTime: bestBuyer.orderTime,
            stock: order.symbol,
            price: bestBuyer.price,
            quantity: finalQTY,
            orderStatus: bestBuyer.orderStatus,
          }

          let executionSeller = {
            executionID: executionID,
            executionTime: executionTime,
            orderID: order.orderID,
            orderTime: order.orderTime,
            stock: order.symbol,
            price: bestBuyer.price,
            quantity: finalQTY,
            orderStatus: order.orderStatus,
          }

          let kLineInfo = {
            stock: order.symbol,
            price: bestBuyer.price,
            executionTime: executionTime,
          }


          console.debug('[executionDetail]', executionDetail)
          await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(executionDetail)), { deliveryMode: true });
          // console.log(order.broker)
          // console.log(executionSeller)

          let execBuyerMessage = { brokerID: bestBuyer.broker, execution: executionBuyer }
          let execSellerMessage = { brokerID: order.broker, execution: executionSeller }

          // socket.sendExec(order.broker, executionSeller);
          // socket.sendExec(bestBuyer.broker, executionBuyer);

          await redisClient.publish('sendExec', JSON.stringify(execSellerMessage));
          await redisClient.publish('sendExec', JSON.stringify(execBuyerMessage));
          await redisClient.publish('kLine', JSON.stringify(kLineInfo))

        } while (hasRemainingQuantity);
      }


    } catch (error) {
      console.error(error)
    } finally {
      let fiveTicks = await getFiveTicks(symbol);
      console.debug('[fiveTicks]', fiveTicks)
      await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks));
      rabbitmqConn.ack(newOrder);
    }
  }, { noAck: false })


})();

let addNewBuyer = async function (buyerInfo) {
  let setScore = buyerInfo.orderID;
  await redisClient.zadd(`${buyerInfo.symbol}-buyer`, setScore, JSON.stringify(buyerInfo.orderID));
  await redisClient.set(`${buyerInfo.orderID}`, JSON.stringify(buyerInfo))
  return buyerInfo;
}

let addNewSeller = async function (sellerInfo) {
  let setScore = sellerInfo.orderID;
  await redisClient.zadd(`${sellerInfo.symbol}-seller`, setScore, JSON.stringify(sellerInfo.orderID));
  await redisClient.set(`${sellerInfo.orderID}`, JSON.stringify(sellerInfo));
  return sellerInfo;
}

let addNewOrderFiveTicks = async function (redisKeyPrefix, newOrderPrice, newOrderQuantity, operator) {
  let scoreForVal = parseInt(newOrderPrice * 100).toString().padStart(5, '0');
  let score = parseInt(scoreForVal, 10)
  let fiveTicksSize
  // 取現在該價格的值
  let [orderFiveTicks, orderFiveTicksScore] = await redisClient.zrange(`${redisKeyPrefix}-fiveTicks`, score, score, 'BYSCORE', 'WITHSCORES');
  if (orderFiveTicks === undefined) {
    fiveTicksSize = scoreForVal + newOrderQuantity.toString();
    await redisClient.zadd(`${redisKeyPrefix}-fiveTicks`, score, fiveTicksSize);
    return
  }

  orderFiveTicks = orderFiveTicks.slice(5);
  let originalQuantity = parseInt(orderFiveTicks)
  let newQuantity
  if (operator === '+') {
    newQuantity = originalQuantity + newOrderQuantity;
    fiveTicksSize = scoreForVal + newQuantity.toString();
  } else if (operator === '-') {
    newQuantity = originalQuantity - newOrderQuantity;
    fiveTicksSize = scoreForVal + newQuantity.toString();
  } else {
    //TODO: error(there is no such operator.)
  }

  let zrem = await redisClient.zremrangebyscore(`${redisKeyPrefix}-fiveTicks`, score, score);
  if (newQuantity > 0) { //防止減到零還存入五檔
    await redisClient.zadd(`${redisKeyPrefix}-fiveTicks`, score, fiveTicksSize);
  }
  return;
}

let getFiveTicks = async function (symbol) {
  // 取現在五檔
  let buyerfiveTicks = await redisClient.zrange(`${symbol}-buyer-fiveTicks`, -5, -1, 'WITHSCORES');
  let sellerFiveTicks = await redisClient.zrange(`${symbol}-seller-fiveTicks`, 0, 4, 'WITHSCORES');
  let formattedBuyerFiveTicks = formatFiveTicks(buyerfiveTicks).reverse();
  let formattedSellerFiveTicks = formatFiveTicks(sellerFiveTicks);
  let FiveTicks = {
    buyer: formattedBuyerFiveTicks,
    seller: formattedSellerFiveTicks,
  }

  // console.log(FiveTicks)
  return FiveTicks;
}

//TODO:這有copy給app.js用
let formatFiveTicks = function (fiveTicks) {
  let formattedFiveTicks = fiveTicks.reduce((accumulator, currentValue, currentIndex) => {

    let tick = {};
    if (currentIndex % 2 === 1) {
      parseInt(currentValue)
      originalPrice = currentValue / 100;
      accumulator[Math.floor(currentIndex / 2)].price = originalPrice;
    } else {
      originalSize = parseInt(currentValue.slice(5));
      tick.size = originalSize;
      accumulator.push(tick);
    }

    return accumulator;
  }, [])
  return formattedFiveTicks
}






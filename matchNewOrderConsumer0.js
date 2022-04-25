require('dotenv').config();
const redisClient = require('./util/cache');
const { v4: uuidv4 } = require('uuid');
let { rabbitmqConn } = require('./util/rabbitmq');
const consumeQueue = 'matchNewOrder-stock-0';
const pubQueue = 'saveNewExec';


// TODO: 要不要改更簡化的，bestSeller跟bestBuyer合併為dealer
(async () => {
  rabbitmqConn = await rabbitmqConn;
  rabbitmqConn.prefetch(1);
  rabbitmqConn.consume(consumeQueue, async (newOrder) => {
    let order = JSON.parse(newOrder.content.toString())
    //console.log(order);
    let { broker, symbol, BS, price, quantity } = order;
    let hasRemainingQuantity = false;
    let bestBuyer, bestBuyerScore, bestSeller, bestSellerScore;
    try {
      if (BS === 'buyer') {
        do {
          // bestSeller = await redisClient.zrange(`${symbol}-seller`, scoreLeft, scoreRight, 'BYSCORE', 'WITHSCORES', 'LIMIT', 0, 1)
          // let testbestSeller = await redisClient.zrange(`${symbol}-seller`, 0, -1, 'WITHSCORES'); //TODO: 先比對(>/<)再拿出
          [bestSeller, bestSellerScore] = await redisClient.zrange(`${symbol}-seller`, 0, 0, 'WITHSCORES');
          if (bestSeller === undefined || JSON.parse(bestSeller).price * 100 > price * 100) {
            await addNewBuyer(order);
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, order.quantity, '+')
            return;
          }

          await redisClient.zrem(`${symbol}-seller`, bestSeller); //需要防止後面未完成嗎
          bestSeller = JSON.parse(bestSeller);


          let executionID = uuidv4();
          let finalQTY
          if (quantity === bestSeller.quantity) {
            finalQTY = quantity;
            hasRemainingQuantity = false;
            order.orderStatus = '完全成交';
            bestSeller.orderStatus = '完全成交';
            await addNewOrderFiveTicks(`${order.symbol}-seller`, order.price, bestSeller.quantity, '-')
          } else if (quantity < bestSeller.quantity) {
            finalQTY = quantity
            bestSeller.quantity -= quantity;
            await redisClient.zadd(`${symbol}-seller`, bestSellerScore, JSON.stringify(bestSeller));
            hasRemainingQuantity = false;
            order.orderStatus = '完全成交';
            bestSeller.orderStatus = '部分成交';
            await addNewOrderFiveTicks(`${order.symbol}-seller`, order.price, bestSeller.quantity, '-')
          } else {
            finalQTY = bestSeller.quantity;
            quantity -= bestSeller.quantity;
            order.quantity = quantity;
            hasRemainingQuantity = true;
            order.orderStatus = '部分成交';
            bestSeller.orderStatus = '完全成交';
            // await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, order.quantity, '+')
            // await addNewOrderFiveTicks(`${order.symbol}-seller`, order.price, bestSeller.quantity, '-')
          }


          let executionDetail = {
            executionID: executionID,
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
            orderID: order.orderID,
            orderTime: order.orderTime,
            stock: order.symbol,
            price: bestSeller.price,
            quantity: finalQTY,
            orderStatus: order.orderStatus,
          }

          let executionSeller = {
            executionID: executionID,
            orderID: bestSeller.orderID,
            orderTime: bestSeller.orderTime,
            stock: order.symbol,
            price: bestSeller.price,
            quantity: finalQTY,
            orderStatus: bestSeller.orderStatus,
          }

          console.debug('executionDetail: ', executionDetail)
          await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(executionDetail)), { deliveryMode: true });
          let execBuyerMessage = { brokerID: order.broker, execution: executionBuyer };
          let execSellerMessage = { brokerID: bestSeller.broker, execution: executionSeller };

          // socket.sendExec(order.broker, executionBuyer);
          // socket.sendExec(bestSeller.broker, executionSeller);


          await redisClient.publish('sendExec', JSON.stringify(execSellerMessage));
          await redisClient.publish('sendExec', JSON.stringify(execBuyerMessage));

        } while (hasRemainingQuantity);

      } else {

        do {
          // console.log(await redisClient.zrange(`${req.body.symbol}-buyer`, 0, -1, 'WITHSCORES'))
          [bestBuyer, bestBuyerScore] = await redisClient.zrange(`${symbol}-buyer`, -1, -1, 'WITHSCORES'); //TODO: race condition
          if (bestBuyer === undefined || JSON.parse(bestBuyer).price * 100 < price * 100) {
            let sellerInfo = await addNewSeller(order);
            await addNewOrderFiveTicks(`${order.symbol}-seller`, order.price, order.quantity, '+')
            return;
          }

          await redisClient.zrem(`${symbol}-buyer`, bestBuyer);
          bestBuyer = JSON.parse(bestBuyer);

          let executionID = uuidv4();
          let finalQTY
          if (quantity === bestBuyer.quantity) {
            finalQTY = quantity;
            hasRemainingQuantity = false;
            order.orderStatus = '完全成交';
            bestBuyer.orderStatus = '完全成交';
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, bestBuyer.quantity, '-')
          } else if (quantity < bestBuyer.quantity) {
            finalQTY = quantity;
            bestBuyer.quantity -= quantity;
            await redisClient.zadd(`${symbol}-buyer`, bestBuyerScore, JSON.stringify(bestBuyer));
            hasRemainingQuantity = false;
            order.orderStatus = '完全成交';
            bestBuyer.orderStatus = '部分成交';
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, bestBuyer.quantity, '-')
          } else {
            finalQTY = bestBuyer.quantity;
            quantity -= bestBuyer.quantity;
            newOrder.quantity = quantity;
            hasRemainingQuantity = true;
            order.orderStatus = '部分成交';
            bestBuyer.orderStatus = '完全成交';
            await addNewOrderFiveTicks(`${order.symbol}-seller`, order.price, order.quantity, '+')
            await addNewOrderFiveTicks(`${order.symbol}-buyer`, order.price, bestBuyer.quantity, '-')
          }

          let executionDetail = {
            executionID: executionID,
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
            orderID: bestBuyer.orderID,
            orderTime: bestBuyer.orderTime,
            stock: order.symbol,
            price: bestBuyer.price,
            quantity: finalQTY,
            orderStatus: bestBuyer.orderStatus,
          }

          let executionSeller = {
            executionID: executionID,
            orderID: order.orderID,
            orderTime: order.orderTime,
            stock: order.symbol,
            price: bestBuyer.price,
            quantity: finalQTY,
            orderStatus: order.orderStatus,
          }



          // console.debug(executionDetail)
          await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(executionDetail)), { deliveryMode: true });
          // console.log(order.broker)
          // console.log(executionSeller)
          let execSellerMessage = { brokerID: order.broker, execution: executionSeller }
          let execBuyerMessage = { brokerID: bestBuyer.broker, execution: executionBuyer }
          // socket.sendExec(order.broker, executionSeller);
          // socket.sendExec(bestBuyer.broker, executionBuyer);
          await redisClient.publish('sendExec', JSON.stringify(execSellerMessage));
          await redisClient.publish('sendExec', JSON.stringify(execBuyerMessage));


        } while (hasRemainingQuantity);
      }


    } catch (error) {
      console.error(error)
    } finally {
      let fiveTicks = await getFiveTicks(symbol);
      await redisClient.publish('fiveTicks', JSON.stringify(fiveTicks)); //TODO: subFiveTicks socket in app.js
      rabbitmqConn.ack(newOrder);
    }
  }, { noAck: false })


})();

let addNewBuyer = async function (buyerInfo) {
  let setScore = buyerInfo.orderID;
  await redisClient.zadd(`${buyerInfo.symbol}-buyer`, setScore, JSON.stringify(buyerInfo));
  return buyerInfo;
}

let addNewSeller = async function (sellerInfo) {
  let setScore = sellerInfo.orderID;
  await redisClient.zadd(`${sellerInfo.symbol}-seller`, setScore, JSON.stringify(sellerInfo));
  return sellerInfo;
}

let addNewOrderFiveTicks = async function (redisKeyPrefix, newOrderPrice, newOrderQuantity, operator) {
  let scoreForVal = (parseFloat(newOrderPrice) * 100).toString().padStart(5, '0');
  let score = parseInt(scoreForVal, 10)
  let fiveTicksSize
  // 取現在該價格的值
  let [orderFiveTicks] = await redisClient.zrange(`${redisKeyPrefix}-fiveTicks`, score, score, 'BYSCORE', 'WITHSCORES');
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

  await redisClient.zremrangebyscore(`${redisKeyPrefix}-fiveTicks`, score, score);
  if (newQuantity !== 0) { //防止減到零還存入五檔
    await redisClient.zadd(`${redisKeyPrefix}-fiveTicks`, score, fiveTicksSize);
  }
  return;
}

let getFiveTicks = async function (symbol) {
  // 取現在五檔
  let buyerfiveTicks = await redisClient.zrange(`${symbol}-buyer-fiveTicks`, -5, -1, 'WITHSCORES');
  let sellerFiveTicks = await redisClient.zrange(`${symbol}-seller-fiveTicks`, 0, 4, 'WITHSCORES');
  let formattedBuyerFiveTicks = formatFiveTicks(buyerfiveTicks);
  let formattedSellerFiveTicks = formatFiveTicks(buyerfiveTicks);
  let FiveTicks = {
    buyer: formattedBuyerFiveTicks,
    seller: formattedSellerFiveTicks,
  }
  //TODO: 更改五檔格式，還沒value換回數量

  return FiveTicks;
}

// let fiveTicksInfo = {
//   buyer: [{ size: 10, price: 90 }, { size: 20, price: 100 }, { size: 10, price: 110 }],
//   seller: [{ size: 10, price: 90 }, { size: 20, price: 100 }, { size: 10, price: 110 }]
// }
// { "buyer": ["0900010", "9000", "0990010", "9900", "9910100", "9910"], "seller": ["0980010", "9800", "09900100", "9900", "099105", "9910", "099205", "9920", "0993095", "9930"] }

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





const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('./util/cache');
const { rabbitmqPub } = require('./util/rabbitmq');
const http = require('http');
const server = http.createServer(app);

require('./util/socket.js').config(server);
const socket = require('./util/socket');


app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const TIME_FILLTER = '00000';

app.post('/newOrder', async (req, res, next) => {
  req.body.broker = parseInt(req.body.broker)
  req.body.price = parseFloat(req.body.price)
  req.body.quantity = parseInt(req.body.quantity)
  let { account, broker, symbol, BS, price, quantity } = req.body;
  // let scoreLeft = parseInt('' + (price * 100) + '00000000', 10);
  // let scoreRight = parseInt('' + (price * 100) + '99999999', 10);
  let bestBuyer, bestBuyerScore, bestSeller, bestSellerScore;
  let orderID = uuidv4();
  req.body.orderID = orderID;
  if (BS === 'buyer') {
    do {
      // bestSeller = await redisClient.zrange(`${symbol}-seller`, scoreLeft, scoreRight, 'BYSCORE', 'WITHSCORES', 'LIMIT', 0, 1)
      // let testbestSeller = await redisClient.zrange(`${symbol}-seller`, 0, -1, 'WITHSCORES'); //TODO: 先比對(>/<)再拿出
      [bestSeller, bestSellerScore] = await redisClient.zrange(`${symbol}-seller`, 0, 0, 'WITHSCORES');
      if (bestSeller === undefined || JSON.parse(bestSeller).price * 100 > price * 100) {
        let buyerInfo = await addNewBuyer(req.body);
        return res.send(buyerInfo);
      }


      bestSeller = JSON.parse(bestSeller);
      console.log(bestSeller);

      let executionID = uuidv4();
      let finalQTY
      if (quantity === bestSeller.quantity) {
        finalQTY = quantity;
      } else if (quantity < bestSeller.quantity) {
        finalQTY = quantity
      } else {
        finalQTY = bestSeller.quantity
      }


      let executionDetail = {
        executionID: executionID,
        seller: bestSeller.account,
        sellerOrderID: bestSeller.orderID,
        buyer: req.body.account,
        buyerOrderID: req.body.orderID,
        price: bestSeller.price,
        quantity: finalQTY,
      }

      let executionBuyer = {
        executionID: executionID,
        orderID: req.body.orderID,
        price: bestSeller.price,
        quantity: finalQTY,
      }

      let executionSeller = {
        executionID: executionID,
        orderID: bestSeller.orderID,
        price: bestSeller.price,
        quantity: finalQTY,
      }

      console.log('executionDetail: ', executionDetail)
      await rabbitmqPub('saveNewOrder', 'newOrder', JSON.stringify(executionDetail))
      await redisClient.zrem(`${symbol}-seller`, JSON.stringify(bestSeller));
      socket.sendExec(broker, executionBuyer);
      socket.sendExec(bestSeller.broker, executionSeller);



      if (quantity === bestSeller.quantity) {
        break;
      } else if (quantity < bestSeller.quantity) {
        bestSeller.quantity -= quantity;
        let scores = [{ score: bestSellerScore, buyer: JSON.stringify(bestSeller) }];
        await redisClient.zadd(`${symbol}-seller`, ...scores.map(({ score, buyer }) => [score, buyer]));
        break;
      } else {
        quantity -= bestSeller.quantity;
        req.body.quantity = quantity;
        continue;
      };


    } while (true);


    return res.send('buyer order success')

  } else {

    do {
      // console.log(await redisClient.zrange(`${req.body.symbol}-buyer`, 0, -1, 'WITHSCORES'))
      [bestBuyer, bestBuyerScore] = await redisClient.zrange(`${symbol}-buyer`, -1, -1, 'WITHSCORES');
      if (bestBuyer === undefined || JSON.parse(bestBuyer).price * 100 < price * 100) {
        let sellerInfo = await addNewSeller(req.body);
        return res.send(sellerInfo);
      }
      bestBuyer = JSON.parse(bestBuyer);
      console.log(bestBuyer);

      let executionID = uuidv4();
      let finalQTY
      if (quantity === bestBuyer.quantity) {
        finalQTY = quantity;
      } else if (quantity < bestBuyer.quantity) {
        finalQTY = quantity
      } else {
        finalQTY = bestBuyer.quantity
      }



      let executionDetail = {
        executionID: executionID,
        seller: req.body.account,
        sellerOrderID: req.body.orderID,
        buyer: bestBuyer.account,
        buyerOrderID: bestBuyer.orderID,
        price: bestBuyer.price,
        quantity: finalQTY,
      }

      let executionBuyer = {
        executionID: executionID,
        orderID: bestBuyer.orderID,
        price: bestBuyer.price,
        quantity: finalQTY,
      }

      let executionSeller = {
        executionID: executionID,
        orderID: req.body.orderID,
        price: bestBuyer.price,
        quantity: finalQTY,
      }



      console.log(executionDetail)
      //save the order
      await rabbitmqPub('saveNewOrder', 'newOrder', JSON.stringify(executionDetail))
      await redisClient.zrem(`${symbol}-buyer`, JSON.stringify(bestBuyer));
      socket.sendExec(broker, executionSeller);
      socket.sendExec(bestBuyer.broker, executionBuyer);

      if (quantity === bestBuyer.quantity) {
        break;
      } else if (quantity < bestBuyer.quantity) {
        bestBuyer.quantity -= quantity;
        let scores = [{ score: bestBuyerScore, buyer: JSON.stringify(bestBuyer) }];
        await redisClient.zadd(`${symbol}-buyer`, ...scores.map(({ score, buyer }) => [score, buyer]));
        break;
      } else {
        quantity -= bestBuyer.quantity;
        req.body.quantity = quantity;
        continue;
      }



    } while (true);


    return res.send('seller order success')
  }

  //TODO:send noti to brokers 從redis拿到五檔
  // let fiveTicks =
  // socket.io.emit('ticks',)
})





var bCount = 0;
let addNewBuyer = async function (buyerInfo) {
  let time = (+new Date());
  let midnight = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
  let todayRestTime = midnight - time;
  if (todayRestTime.length < 8) {
    todayRestTime = (TIME_FILLTER + todayRestTime).slice(-8);
  }
  buyerInfo.time = todayRestTime;

  let setScore = parseInt('' + (parseFloat(buyerInfo.price) * 100) + `${todayRestTime}`, 10);
  buyerInfo.tradeID = setScore;
  // let scores = [{ score: setScore, buyer: JSON.stringify(buyerInfo) }];
  // await redisClient.zadd(`${buyerInfo.symbol}-buyer`, ...scores.map(({ score, buyer }) => [score, buyer]));
  await redisClient.zadd(`${buyerInfo.symbol}-buyer`, setScore, JSON.stringify(buyerInfo));
  bCount++;
  // console.debug(buyerInfo.account)
  // console.debug('buyer count', bCount);
  return buyerInfo;
}

var sCount = 0;
let addNewSeller = async function (sellerInfo) {
  let time = (+new Date());
  let midnight = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  let todayRestTime = time - midnight;
  if (todayRestTime.length < 8) {
    todayRestTime = (TIME_FILLTER + todayRestTime).slice(-8);
  }
  sellerInfo.time = todayRestTime;

  let setScore = parseInt('' + (parseFloat(sellerInfo.price) * 100) + `${todayRestTime}`, 10);
  sellerInfo.tradeID = setScore;
  // let scores = [{ score: setScore, buyer: JSON.stringify(sellerInfo) }];
  // await redisClient.zadd(`${sellerInfo.symbol}-seller`, ...scores.map(({ score, buyer }) => [score, buyer])); //TODO:只有一組不需要用到map
  await redisClient.zadd(`${sellerInfo.symbol}-seller`, setScore, JSON.stringify(sellerInfo));
  sCount++;
  // console.debug(sellerInfo.account) //TODO: console.debug(debug不印)
  // console.debug('seller count', sCount);
  return sellerInfo;
}





server.listen(7000, () => {
  console.log('Server runs on port 7000.')
})




// app.post('/seller', async (req, res, next) => {
  // console.log(await redisClient.zrange('salary', 0, -1))
  // await redisClient.zrem('salary', 'May')
  // console.log(await redisClient.zrange('salary', 0, -1))
  // let test = await redisClient.zrange('100-buyer', 0, -1, 'WITHSCORES')
  // console.log(test[0])
  // let { uid, symbol, price, quantity, time } = req.body
  // if (sellerList[price]) {
  //   sellerList[price].push(req.body)
  // } else {
  //   sellerList[price] = []
  //   sellerList[price].push(req.body)
  // }
  // console.log(sellerList)

  // let sellerPrice = new priorityQueue()
  // sellerPrice.queue(price)
  // console.log(sellerPrice)
  // res.send(sellerPrice)
// })

// function isSameQuantity(buyerQuantity, sellerQuantity) { return buyerQuantity === sellerQuantity }
// function isSellerQuantityMoreThanBuyer(buyerQuantity, sellerQuantity) { return buyerQuantity < sellerQuantity }
// function isSellerQuantityLessThanBuyer(buyerQuantity, sellerQuantity) { return buyerQuantity > sellerQuantity }










// app.post('/buyer', async (req, res, next) => {
//   let { uid, symbol, price, quantity, time } = req.body;
//   let scoreLeft = parseInt('' + (price * 100) + '00000000', 10);
//   let scoreRight = parseInt('' + (price * 100) + '99999999', 10);

//   // let isSameQuantity = quantity === bestSeller[0].quantity
//   // let isSellerQuantityMoreThanBuyer = quantity < bestSeller[0].quantity
//   // let isSellerQuantityLessThanBuyer = quantity > bestSeller[0].quantity
//   let bestSeller = JSON.parse(await redisClient.zrange(`${symbol}-seller`, scoreLeft, scoreRight, 'BYSCORE', 'WITHSCORES', 'LIMIT', 0, 1))
//   // let bestSellerQuantity= bestSeller[0].quantity
//   // while (isSellerQuantityLessThanBuyer(quantity, bestSellerQuantity)) {


//   //   let canNotBuyTheMostCheap =  bestSeller[1].slice(6) > price * 100
//   //   if (canNotBuyTheMostCheap) {
//   //     //TODO: push the buyer to the list  
//   //     break;
//   //   }

//   //   //TODO: buyer get the price


//   //   if (isSameQuantity) {
//   //     await redisClient.zrem('salary', bestSeller[0])
//   //   } else if (isSellerQuantityMoreThanBuyer) {
//   //     //TODO: seller quantity -= buyer quantity
//   //   } else {
//   //     quantity -= bestSeller[0].quantity;
//   //     req.body.quantity = quantity;
//   //     await redisClient.zrem('salary', bestSeller[0])


//   //   }

//   // } 
// })

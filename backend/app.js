const express = require('express');
const app = express();
const cors = require('cors');
const redisClient = require('./util/cache');
const { rabbitmqPub } = require('./util/rabbitmq');
const BSLogicMap = require('./BSLogic')[0];
const { CurrentFiveTicks, NewOrderFiveTicks } = require('./FiveTicks');
const http = require('http');
const server = http.createServer(app);
let { mongodbNewOrder, mongodbUpdateOrder, mongodbGetExecutionHistory } = require('./util/mongodb');


require('./util/socket.js').config(server);
require('./redisSub.js');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/fiveTicks/:symbol', async (req, res, next) => {
  let { symbol } = req.params;
  let fiveTicks = await new CurrentFiveTicks(parseInt(symbol)).getFiveTicks();
  console.log(fiveTicks)
  return res.send(fiveTicks)
})

// newOrder.body {
//   account: '3', //改int
//   broker: 1030,
//   symbol: '2330',  //改int
//   BS: 'seller',
//   orderType: 'limit',
//   duration: 'ROD',
//   price: 105,
//   quantity: 20,
//   brokerName: '土銀' (1020:合庫),
//   symbolName: '台積電',
// x orderTime: 836452,
// x orderID: 10500836452,
// x orderStatus: '未成交'
// }


// updateOrder.body {
//   orderID: int
//   symbol:  int
//   quantity:  int
//   BS:  string
// }


// TODO: 錯誤處理：1.找不到orderID 
app.patch('/order', async (req, res, next) => { //patch用法對嗎？
  await mongodbUpdateOrder(req.body);
  let { orderID, symbol, quantity, BS } = req.body;
  orderID = parseInt(orderID);
  symbol = parseInt(symbol);
  quantity = parseInt(quantity);
  let orderInfo = await redisClient.get(`${orderID}`);
  orderInfo = JSON.parse(orderInfo);
  await redisClient.del(`${orderID}`);
  orderInfo.quantity = parseInt(orderInfo.quantity)
  orderInfo.quantity += quantity; //quantity為負也可以
  if (orderInfo.quantity <= 0) {
    // 刪除redis裏zset的order
    await redisClient.zrem(`${symbol}-${BS}`, orderID.toString());
    return res.send('Your order has been deleted.');
  }
  await redisClient.set(`${orderID}`, JSON.stringify(orderInfo));
  let response = {
    orderStatus: orderInfo.orderStatus,
    quantity: orderInfo.quantity,
    price: orderInfo.price,
    executionCount: 3,
    orderTime: orderInfo.orderTime,
    orderID: orderInfo.orderID
  }
  return res.send(response);

})

// postOrder.body {
//   account: int,
//   time: int
// }

app.post('/order', async (req, res, next) => {
  // let { account, time } = req.body;
  // account = parseInt(account);2p5d ;
  // time = parseInt(time);
  let response = [
    //   {
    //   orderStatus: 2,
    //   quantity: 4,
    //   price: 543,
    //   executionCount: 3,
    //   orderTime: new Date(),
    //   orderID: 1234321
    // },
    // {
    //   orderStatus: 1,
    //   quantity: 2,
    //   price: 523.5,
    //   executionCount: 0,
    //   orderTime: new Date(),
    //   orderID: 4567654
    // },
    // {
    //   orderStatus: 3,
    //   quantity: 4,
    //   price: 530,
    //   executionCount: 4,
    //   orderTime: new Date(),
    //   orderID: 78987654
    // }
  ]

  return res.send(response)

})



//TODO:委託失敗失敗：每個都要有值/沒有單可以賣/沒有註冊過
//不做：沒有這個broker/沒有這檔股票
// app.post('/newOrder', async (req, res, next) => {
//   let time = new Date(); //TODO: middleware: logs-time

app.post('/newOrder', async (req, res, next) => {
  let dealer = new BSLogicMap[req.body.BS](req.body);
  dealer.formatOrder();
  dealer.orderTimeInDayPeriod();
  dealer.createOrderID();
  await dealer.shardingToRabbitmq();
  let orderResponse = dealer.createOrderResponse();
  return res.send(orderResponse)
})




// let kLineInfo = {
//   symbol: order.symbol,
//   price: bestSeller.price,
//   executionTime: executionTime,
// }
app.get('/kLine/:symbol', async (req, res, next) => {
  let { symbol } = req.params;
  let { time } = req.query;
  symbol = parseInt(symbol)
  time = parseInt(time);
  const executionResult = await mongodbGetExecutionHistory(symbol, time)
  console.debug('kLine History Result: ', executionResult)
  return res.send(executionResult)
})






server.listen(7000, () => {
  console.log('Server runs on port 7000.')
})
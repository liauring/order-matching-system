const express = require('express');
const app = express();
const cors = require('cors');
const redisClient = require('./util/cache');
const { rabbitmqPub } = require('./util/rabbitmq');
const http = require('http');
const server = http.createServer(app);
let { mongodbNewOrder, mongodbUpdateOrder } = require('./util/mongodb');

require('./util/socket.js').config(server);
require('./redisSub.js');
const socket = require('./util/socket');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const TIME_FILLTER = '00000';
const exchange = 'matchNewOrder';

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
  let insertResult = await mongodbUpdateOrder(req.body);
  console.log('Log-updateOrder: ', insertResult);
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
  return res.send(`Your order has been updated. Your remaining quantity is ${orderInfo.quantity}`,);

})


//TODO:委託失敗失敗：每個都要有值/沒有單可以賣/沒有註冊過
//不做：沒有這個broker/沒有這檔股票
app.post('/newOrder', async (req, res, next) => {
  let insertResult = await mongodbNewOrder(req.body);
  console.log('Log-newOrder: ', insertResult);
  req.body.account = parseInt(req.body.account);
  req.body.broker = parseInt(req.body.broker);
  req.body.symbol = parseInt(req.body.symbol);
  req.body.price = parseFloat(req.body.price);
  req.body.quantity = parseInt(req.body.quantity);
  req.body.orderStatus = '未成交';
  let orderID, time
  if (req.body.BS === 'buyer') {
    time = new Date();
    let midnight = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
    let todayRestTime = midnight - time;
    if (todayRestTime.toString().length < 8) {
      todayRestTime = ((TIME_FILLTER + todayRestTime).slice(-8)).toString();
    }
    req.body.orderTime = todayRestTime.toString();

    orderID = parseInt('' + parseInt(parseFloat(req.body.price) * 100) + `${todayRestTime}`, 10);
    req.body.orderID = orderID;

  } else if (req.body.BS === 'seller') {

    time = new Date();
    let midnight = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let todayRestTime = time - midnight;
    if (todayRestTime.toString().length < 8) {
      todayRestTime = ((TIME_FILLTER + todayRestTime).slice(-8)).toString();
    }
    req.body.orderTime = todayRestTime.toString();

    orderID = parseInt('' + parseInt(parseFloat(req.body.price) * 100) + `${todayRestTime}`, 10);
    req.body.orderID = orderID;

  } else {
    //TODO: console.log
  }
  //TODO:要先進redis嗎？還是直接進queue?感覺應該不能先進redis，這樣在撮合前redis就會有他的資料，但又還沒輪到他
  // 但五檔應該要先進，object也要先進
  //TODO:刪單的話，已進zset的也要刪
  let { symbol } = req.body;
  let symbolSharding = symbol % 5;
  await rabbitmqPub(exchange, symbolSharding.toString(), JSON.stringify(req.body));
  console.log(req.body)
  let response = {
    status: "委託成功",
    quantity: req.body.quantity,
    price: req.body.price,
    executionCount: 0,
    orderTime: time.toLocaleString(),
    orderID: req.body.orderID
  }

  console.log(response)

  return res.send(response)
})


app.get('/fiveTicks/:symbol', async (req, res, next) => {
  let { symbol } = req.params;
  let fiveTicks = await getFiveTicks(parseInt(symbol));
  console.log(fiveTicks)
  return res.send(fiveTicks)
})

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

  console.log(FiveTicks)
  return FiveTicks;
}

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




server.listen(7000, () => {
  console.log('Server runs on port 7000.')
})
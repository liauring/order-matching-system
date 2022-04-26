const express = require('express');
const app = express();
const cors = require('cors');
const redisClient = require('./util/cache');
const { rabbitmqPub } = require('./util/rabbitmq');
const http = require('http');
const server = http.createServer(app);

require('./util/socket.js').config(server);
require('./redisSub.js');
const socket = require('./util/socket');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const TIME_FILLTER = '00000';
const exchange = 'matchNewOrder';

// {
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

// app.post('/new', async (req, res, next) => {
//   await rabbitmqPub(exchange, '0', JSON.stringify(req.body));
//   return res.send('success')
// })


app.post('/newOrder', async (req, res, next) => {

  req.body.account = parseInt(req.body.account);
  req.body.broker = parseInt(req.body.broker);
  req.body.symbol = parseInt(req.body.symbol);
  req.body.price = parseFloat(req.body.price);
  req.body.quantity = parseInt(req.body.quantity);
  req.body.orderStatus = '未成交';

  if (req.body.BS === 'buyer') {
    let time = (+new Date());
    let midnight = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
    let todayRestTime = midnight - time;
    if (todayRestTime.toString().length < 8) {
      todayRestTime = (TIME_FILLTER + todayRestTime).slice(-8);
    }
    req.body.orderTime = todayRestTime;

    let orderID = parseInt('' + (parseFloat(req.body.price) * 100) + `${todayRestTime}`, 10);
    req.body.orderID = orderID;

  } else if (req.body.BS === 'seller') {

    let time = (+new Date());
    let midnight = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let todayRestTime = time - midnight;
    if (todayRestTime.toString().length < 8) {
      todayRestTime = (TIME_FILLTER + todayRestTime).slice(-8);
    }
    req.body.orderTime = todayRestTime;

    let orderID = parseInt('' + (parseFloat(req.body.price) * 100) + `${todayRestTime}`, 10);
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


  return res.send(`${req.body.BS} order created successfully`)
})




server.listen(7000, () => {
  console.log('Server runs on port 7000.')
})
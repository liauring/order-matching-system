const express = require('express');
const app = express();
const cors = require('cors');
const redisClient = require('./util/cache');
const { rabbitmqPub } = require('./util/rabbitmq');
const BSLogicMap = require('./BSLogic')[0];
const { CurrentFiveTicks, NewOrderFiveTicks } = require('./FiveTicks');
const http = require('http');
const server = http.createServer(app);

require('./util/socket.js').config(server);
require('./redisSub.js');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/' + API_VERSION, rateLimiterRoute, [
  require('./server/routes/admin_route'),

]);


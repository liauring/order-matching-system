require('dotenv').config();
const socket = require('./util/socket');
const redis = require('ioredis');
const redisClient = new redis({
  port: process.env.redisPort,
  host: process.env.redisHost,
  username: process.env.redisUser,
  password: process.env.redisPW,
  db: 0,
});


(() => {
  redisClient.subscribe('sendExec', 'fiveTicks', 'kLine', (err, count) => {
    if (err) {
      console.error("Failed to subscribe: %s", err.message);
    } else {
      console.log(
        'Subscribed  sendExec successfully!'
      );
    }
  });

  redisClient.on("message", (channel, message) => {
    // console.log(`Received message from ${channel}`);
    message = JSON.parse(message);
    if (channel === 'sendExec') {
      socket.sendExec(message.brokerID, message.execution);
    } else if (channel === 'fiveTicks') {
      socket.sendFiveTicks(message);
    } else if (channel === 'kLine') {
      // console.log('kLine in redisSub', message)
      socket.sendKLine(message);
    } else {
      console.error('[redisSub] Cannot find redis channel')
    }

  });
})();
let { rabbitmqSendToQueue } = require('../util/rabbitmq')

require('dotenv').config({ path: __dirname + '/./../.env' })
const socket = require('../util/socket')
const redis = require('ioredis')
const redisClient = new redis({
  port: process.env.redisPort,
  host: process.env.redisHost,
  username: process.env.redisUser,
  password: process.env.redisPW,
  db: 0,
})
;(() => {
  redisClient.subscribe('sendExec', 'fiveTicks', 'kLine', (err, count) => {
    if (err) {
      console.error('Failed to subscribe: %s', err.message)
    } else {
      console.log('Subscribed  sendExec successfully!')
    }
  })

  redisClient.on('message', async (channel, message) => {
    // console.log(`Received message from ${channel}`);
    message = JSON.parse(message)
    if (channel === 'sendExec') {
      try {
        socket.sendExec(message.brokerID, message.execution)

        //----- for stress test -----
        if (message.execution.matchTime.length === 5) {
          let currentTime = new Date().getTime()
          message.execution.matchTime.push({ socketEmit: currentTime })
          await rabbitmqSendToQueue('matchTime', message.execution.matchTime)
          // console.log(message.execution.matchTime)
        }

        //----------
      } catch (error) {
        console.error(error)
      }
    } else if (channel === 'fiveTicks') {
      try {
        // console.log(message)
        socket.sendFiveTicks(message)
      } catch (error) {
        console.error(error)
      }
    } else if (channel === 'kLine') {
      try {
        socket.sendKLine(message)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.error('[redisSub] Cannot find redis channel')
    }
  })
})()

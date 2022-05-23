require('dotenv').config({ path: __dirname + '/./../.env' })
require('../util/rabbitmq').rabbitmqCreateConnect()
const redisClient = require('../util/redis')
;(async () => {
  redisClient.flushdb(function (err, succeeded) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear Redis] redis flushall succeeded')
    }
  })
  redisClient.disconnect()
  process.exit(0)
})()

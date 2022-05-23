require('dotenv').config({ path: __dirname + '/./../.env' })
require('../util/rabbitmq').rabbitmqCreateConnect()
const redisClient = require('../util/redis')
const { db, mongodbClose } = require('../util/mongodb')
const { mysqldb } = require('../util/mysql')
const { QueueProvider } = require('../core/BSLogic/serviceProviders/queue_provider')

;(async () => {
  await QueueProvider.connect()
  await redisClient.flushdb(function (err, succeeded) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear Redis] redis flushall succeeded')
    }
  })

  await QueueProvider.deleteQueue('matchNewOrder-stock-0')
  await QueueProvider.deleteQueue('matchNewOrder-stock-1')
  await QueueProvider.deleteQueue('matchNewOrder-stock-2')
  await QueueProvider.deleteQueue('matchNewOrder-stock-3')
  await QueueProvider.deleteQueue('matchNewOrder-stock-4')
  await QueueProvider.deleteQueue('matchTime')
  await QueueProvider.deleteQueue('saveNewExec')
  await QueueProvider.deleteQueue('saveOrderLog')
  console.log('[Clear Rabbitmq all queues]')

  redisClient.disconnect()

  QueueProvider.closeConnection()
  process.exit(0)
})()

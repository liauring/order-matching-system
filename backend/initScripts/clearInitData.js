require('dotenv').config({ path: __dirname + '/./../.env' })
const redisClient = require('../util/cache')
const { db, mongodbClose } = require('../util/mongodb')
const { mysqldb } = require('../util/mysql')
const { rabbitmqDeleteQueue, rabbitmqClose } = require('../util/rabbitmq')

;(async () => {
  redisClient.flushdb(function (err, succeeded) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear Redis] redis flushall succeeded')
    }
  })

  db.collection('executions').deleteMany({}, function (err, obj) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear MongoDB executions] ', obj.result + ' document(s) deleted')
    }
  })

  db.collection('logsOfNewOrderExchange').deleteMany({}, function (err, obj) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear MongoDB logsOfNewOrderExchange] ', obj.result + ' document(s) deleted')
    }
  })

  db.collection('logsOfUpdateOrderExchange').deleteMany({}, function (err, obj) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear MongoDB logsOfUpdateOrderExchange] ', obj.result + ' document(s) deleted')
    }
  })

  db.collection('logsOfNewOrderBroker').deleteMany({}, function (err, obj) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear MongoDB logsOfNewOrderBroker] ', obj.result + ' document(s) deleted')
    }
  })

  db.collection('logsOfUpdateOrderBroker').deleteMany({}, function (err, obj) {
    if (err) {
      console.error(err)
    } else {
      console.log('[Clear MongoDB logsOfUpdateOrderBroker] ', obj.result + ' document(s) deleted')
    }
  })

  await mysqldb.query('TRUNCATE TABLE orderInfo')
  await mysqldb.query('TRUNCATE TABLE order_history')
  console.log('[Clear Mysql orderInfo, order_history] ')

  await rabbitmqDeleteQueue('matchNewOrder-stock-0')
  await rabbitmqDeleteQueue('matchNewOrder-stock-1')
  await rabbitmqDeleteQueue('matchNewOrder-stock-2')
  await rabbitmqDeleteQueue('matchNewOrder-stock-3')
  await rabbitmqDeleteQueue('matchNewOrder-stock-4')
  await rabbitmqDeleteQueue('matchTime')
  await rabbitmqDeleteQueue('saveNewExec')
  await rabbitmqDeleteQueue('saveOrderLog')
  console.log('[Clear Rabbitmq all queues]')

  redisClient.disconnect()
  mongodbClose()
  mysqldb.end()
  rabbitmqClose()
  process.exit(0)
})()

require('dotenv').config({ path: __dirname + '/./../.env' })

let rabbitmq = require('amqplib').connect(
  `amqp://${process.env.rabbitmqUser}:${process.env.rabbitmqPW}@${process.env.rabbitmqHost}:${process.env.rabbitmqPort}/`
)

const rabbitmqConn = rabbitmq
  .then(function (conn) {
    return conn.createChannel()
    // return conn.createChannel
  })
  .catch(console.warn)

async function rabbitmqPub(exchange, severity, message) {
  let rabbitmqConnCh = await rabbitmqConn
  await rabbitmqConnCh.publish(exchange, severity, Buffer.from(message))
}
//外面再close connection

async function rabbitmqSendToQueue(queue, message) {
  let rabbitmqConnQueue = await rabbitmqConn
  await rabbitmqConnQueue.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { deliveryMode: true })
}

async function rabbitmqDeleteQueue(queue) {
  let rabbitmqConnQueue = await rabbitmqConn
  await rabbitmqConnQueue.deleteQueue(queue)
}

async function rabbitmqClose(queue) {
  let rabbitmqConnQueue = await rabbitmqConn
  await rabbitmqConnQueue.close()
}

async function rabbitmqGetLength(queue) {
  let rabbitmqConnCh = await rabbitmqConn
  let queueInfo = await rabbitmqConnCh.assertQueue(queue)
  let queueLength = queueInfo.messageCount
  return queueLength
}

module.exports = {
  rabbitmqConn,
  rabbitmqPub,
  rabbitmqSendToQueue,
  rabbitmqDeleteQueue,
  rabbitmqClose,
  rabbitmqGetLength,
}

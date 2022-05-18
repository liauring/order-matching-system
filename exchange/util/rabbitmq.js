require('dotenv').config({ path: __dirname + '/./../.env' })

let rabbitmq = require('amqplib').connect(
  `amqp://${process.env.rabbitmqUser}:${process.env.rabbitmqPW}@${process.env.rabbitmqHost}:${process.env.rabbitmqPort}/`
)

let rabbitmqConn

const rabbitmqCreateConnect = rabbitmq
  .then(function (conn) {
    console.log('rabbitmq channel is created')
    return conn.createChannel()
  })
  .then((channel) => {
    rabbitmqConn = channel
    console.log('rabbitmq connected')
    return rabbitmqConn
  })
  .catch(console.warn)

async function rabbitmqPub(exchange, severity, message) {
  await rabbitmqConn.publish(exchange, severity, Buffer.from(message))
}
//外面再close connection

async function rabbitmqSendToQueue(queue, message) {
  await rabbitmqConn.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { deliveryMode: true })
}

async function rabbitmqDeleteQueue(queue) {
  await rabbitmqConn.deleteQueue(queue)
}

async function rabbitmqClose() {
  await rabbitmqConn.close()
}

async function rabbitmqGetLength(queue) {
  let queueInfo = await rabbitmqConn.assertQueue(queue)
  let queueLength = queueInfo.messageCount
  return queueLength
}

module.exports = {
  rabbitmqCreateConnect,
  rabbitmqPub,
  rabbitmqSendToQueue,
  rabbitmqDeleteQueue,
  rabbitmqClose,
  rabbitmqGetLength,
}

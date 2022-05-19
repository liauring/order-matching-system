require('dotenv').config({ path: __dirname + '/./../.env' })

async function rabbitmqCreateConnect() {
  let rabbitmq = await require('amqplib').connect(
    `amqp://${process.env.rabbitmqUser}:${process.env.rabbitmqPW}@${process.env.rabbitmqHost}:${process.env.rabbitmqPort}/`
  )
  return await rabbitmq.createChannel()
}

// class QueueProvider {
//   async publishToExchange(exchange, severity, message) {
//     return await rabbitmqConn.publish(exchange, severity, Buffer.from(message))
//   }

//   async sendToQueue(queue, message) {
//     return await rabbitmqConn.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { deliveryMode: true })
//   }

//   async deleteQueue(queue) {
//     return await rabbitmqConn.deleteQueue(queue)
//   }

//   async connectionClose() {
//     await rabbitmqConn.close()
//   }

//   async getQueueLength(queue) {
//     let queueInfo = await rabbitmqConn.assertQueue(queue)
//     let queueLength = queueInfo.messageCount
//     return queueLength
//   }
// }

// module.exports = { rabbitmqCreateConnect, QueueProvider }

module.exports = { rabbitmqCreateConnect }

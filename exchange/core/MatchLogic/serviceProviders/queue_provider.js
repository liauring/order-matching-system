const { rabbitmqCreateConnect } = require('../../../util/rabbitmq')

class RabbitMQ {
  constructor() {
    this.status = false
    this.queueConnect = null
  }

  async connect() {
    if (this.status === false) {
      this.queueConnect = await rabbitmqCreateConnect()
      this.status = true
    } else {
      return Promise.resolve()
    }
  }

  prefetch(prefetchCount) {
    this.queueConnect.prefetch(prefetchCount)
  }

  consumeQueue(consumeQueue, consumeFunction) {
    this.queueConnect.consume(consumeQueue, consumeFunction, { noAck: false })
  }

  async shardingToQueue(exchange, severity, message) {
    return await this.queueConnect.publish(exchange, severity, Buffer.from(message))
  }

  async sendToSingleQueue(queue, message) {
    return await this.queueConnect.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { deliveryMode: true })
  }

  async deleteQueue(queue) {
    return await this.queueConnect.deleteQueue(queue)
  }

  async getQueueLength(queue) {
    let queueInfo = await this.queueConnect.assertQueue(queue)
    let queueLength = queueInfo.messageCount
    return queueLength
  }

  async closeConnection() {
    await rabbitmqConn.close()
    this.status = false
  }
}

const QueueProvider = new RabbitMQ()

module.exports = { QueueProvider }

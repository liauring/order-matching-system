const { rabbitmqCreateConnect } = require('../util/rabbitmq')

class RabbitMQAdapter {
  constructor() {
    console.log('QueueProvider')
    this.queueConnect = null
  }

  async connect() {
    this.queueConnect = await rabbitmqCreateConnect()
  }

  async publishToExchange(exchange, severity, message) {
    console.log('publishToExchange')
    return await this.queueConnect.publish(exchange, severity, Buffer.from(message))
  }

  async sendToQueue(queue, message) {
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
}
const a = new RabbitMQAdapter()

module.exports = { a, RabbitMQAdapter }

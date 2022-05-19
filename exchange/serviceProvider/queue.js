const redisClient = require('../util/cache')
const RabbitMQAdapter = require('./adapter')

class QueueProvider {
  constructor() {
    throw new Error('this is singleton')
  }

  // singleton
  static instance = null

  static async getInstance() {
    console.log('QueueProvider.getInstance')
    if (QueueProvider.instance === null) {
      console.log('QueueProvider.getInstance', 'create new instance')
      QueueProvider.instance = new RabbitMQAdapter()
      await QueueProvider.instance.connect()
    }
    return QueueProvider.instance
  }
}

module.exports = { QueueProvider }

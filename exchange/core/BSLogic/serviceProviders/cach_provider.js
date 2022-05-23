const redisClient = require('../../../util/redis')

class Redis {
  constructor() {
    this.cacheConnect = redisClient
  }

  async getSortedSetItem(key, head, tail) {
    return await this.cacheConnect.zrange(key, head, tail, 'WITHSCORES')
  }

  async addSortedSetMember(key, score, member) {
    await this.cacheConnect.zadd(key, score, member)
  }

  async deleteSortedSetMember(key, member) {
    await this.cacheConnect.zrem(key, member)
  }

  async getKeyValue(key) {
    return await this.cacheConnect.get(key)
  }

  async addKeyValue(key, value) {
    await this.cacheConnect.set(key, value)
  }

  async deleteKeyValue(key) {
    await this.cacheConnect.del(key)
  }

  async publishChannel(channel, content) {
    await this.cacheConnect.publish(channel, content)
  }
}

const CacheProvider = new Redis()

module.exports = { CacheProvider }

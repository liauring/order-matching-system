class MockRedis {
  async getSortedSetItem(key, head, tail) {
    let sortedSetItem = [6688801000000, 6688801000000]
    return sortedSetItem
  }

  async deleteSortedSetMember(key, member) {
    return
  }

  async getKeyValue(key) {
    let keyValue = {
      account: 66,
      broker: 1030,
      symbol: 2330,
      BS: 'buyer',
      orderType: 'limit',
      duration: 'ROD',
      price: 668.88,
      quantity: 10,
      logCreateTime: 1653154020087,
      _id: '628920e4b5ff104924088f45',
      orderStatus: 1,
      createTime: 1653154020083,
      orderTime: '05220083',
      orderID: 6688801000000,
      executionQuantity: 0,
    }

    return JSON.stringify(keyValue)
  }

  async deleteKeyValue(key) {
    return
  }
}

const MockCacheForDealerProvider = new MockRedis()

module.exports = { MockCacheForDealerProvider }

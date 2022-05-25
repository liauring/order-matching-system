class DealerProvider {
  constructor(info, symbol, cacheProvider) {
    this.info = info
    this.symbol = symbol
    this.cacheProvider = cacheProvider
  }

  async shiftDealer() {
    await this.#fetchInfo()
    if (this.info.orderID !== null && this.info.haveBestDealer()) {
      let data = await this.cacheProvider.getKeyValue(this.info.orderID)
      let dealer = JSON.parse(data)
      await this.#deleteDealer(this.symbol, this.info.type, orderID)
      return dealer
    }
    return null
  }

  async #fetchInfo() {
    let score
    ;[this.info.orderID, score] = await this.cacheProvider.getSortedSetItem(
      `${this.symbol}-${this.info.type}`,
      this.info.head,
      this.info.tail
    )
    this.info.updateScore(score)
  }

  async #deleteDealer(symbol, type, orderID) {
    await this.cacheProvider.deleteSortedSetMember(`${symbol}-${type}`, orderID)
    await this.cacheProvider.deleteKeyValue(`${orderID}`)
  }
}

class DealerInfo {
  constructor(type, orderPrice, sortedSetHead, sortedSetTail) {
    this.type = type
    this.orderPrice = orderPrice
    this.sortedSetHead = sortedSetHead
    this.sortedSetTail = sortedSetTail
    this.score = null
    this.alignPrice = null
    this.orderID = null
  }

  updateScore(score) {
    this.score = score
    this.alignPrice = parseInt(score.toString().slice(0, -8))
  }
}

class SellerInfo extends DealerInfo {
  constructor(orderPrice) {
    super('seller', orderPrice, 0, 0)
  }

  haveBestDealer() {
    return this.orderPrice * 100 >= this.alignPrice
  }
}

class BuyerInfo extends DealerInfo {
  constructor(orderPrice) {
    super('buyer', orderPrice, -1, -1)
  }
  haveBestDealer() {
    return this.alignPrice >= this.orderPrice * 100
  }
}

module.exports = { DealerProvider, SellerInfo, BuyerInfo }

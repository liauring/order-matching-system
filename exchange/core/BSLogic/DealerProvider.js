class DealerProvider {
  constructor(info, sourcePrice, symbol, cacheProvider) {
    this.info = info
    this.symbol = symbol
    this.cacheProvider = cacheProvider
    this.sourcePrice = sourcePrice
    this.orderID = null
    this.order = null
    this.score = null
  }

  async updateDealer() {
    await this.#fetchDealerProfile()
    if (this.haveBestDealer()) {
      let data = await this.cacheProvider.getKeyValue(this.orderID)
      this.order = JSON.parse(data)
      await this.#deleteDealer(this.symbol, this.info.type, this.orderID)
    }
  }

  async #fetchDealerProfile() {
    ;[this.orderID, this.score] = await this.cacheProvider.getSortedSetItem(
      `${this.symbol}-${this.info.type}`,
      this.info.head,
      this.info.tail
    )
  }

  haveBestDealer() {
    if (this.orderID === undefined) {
      return false
    }

    let dealerPrice = parseInt(this.score.toString().slice(0, -8)) //撮合價
    let alignedSourcePrice = this.sourcePrice * 100 //委託單價

    // buyer >= seller
    if (this.info.type === 'buyer') {
      return dealerPrice >= alignedSourcePrice //撮合 >= 委託 -> false
    } else if (this.info.type === 'seller') {
      return dealerPrice <= alignedSourcePrice //撮合 <= 委託 -> false
    }
  }

  async #deleteDealer(symbol, type, orderID) {
    await this.cacheProvider.deleteSortedSetMember(`${symbol}-${type}`, orderID)
    await this.cacheProvider.deleteKeyValue(`${orderID}`)
  }
}

class SellerInfo {
  constructor() {
    this.type = 'seller'
    this.head = 0
    this.tail = 0
  }
}

class BuyerInfo {
  constructor() {
    this.type = 'buyer'
    this.head = -1
    this.tail = -1
  }
}

module.exports = { DealerProvider, SellerInfo, BuyerInfo }

let { UpdateOrderFiveTicks } = require('../FiveTicks')

class MatchLogic {
  #hasRemainingQuantity

  constructor(order, dealerProvider, queueProvider, cacheProvider, executionUpdater) {
    this.orderMap = {}
    this.order = order
    this.dealerProvider = dealerProvider
    this.queueProvider = queueProvider
    this.cacheProvider = cacheProvider
    this.executionUpdater = executionUpdater

    this.finalQTY = null
    this.#hasRemainingQuantity = false

    this.dealer = null
    this.orderMap[this.order.BS] = order
  }

  async matchWorkFlow() {
    do {
      this.dealer = await this.dealerProvider.shiftDealer()
      if (this.dealer === null) {
        await this.#writeNewDealerToRedis()
        await this.#writeFiveTicksOrderToRedis(
          this.order.symbol,
          this.order.BS,
          this.order.price,
          this.order.quantity,
          '+'
        )
        return
      }
      this.orderMap[this.dealer.BS] = this.dealer
      await this.#matchExecutionQuantity()

      let sellerOrder = this.orderMap['seller']
      let buyerOrder = this.orderMap['buyer']
      await this.executionUpdater.udpate(this.order.symbol, sellerOrder, buyerOrder, this.dealer.price, this.finalQTY)
    } while (this.#hasRemainingQuantity)
  }

  async #writeNewDealerToRedis() {
    let setScore = this.order.orderID
    await this.cacheProvider.addSortedSetMember(
      `${this.order.symbol}-${this.order.BS}`,
      setScore,
      JSON.stringify(this.order.orderID)
    )
    await this.cacheProvider.addKeyValue(`${this.order.orderID}`, JSON.stringify(this.order))
  }

  async #writeFiveTicksOrderToRedis(symbol, type, price, quantity, operator) {
    await new UpdateOrderFiveTicks().updateOrderFiveTicks(`${symbol}-${type}`, price, quantity, operator)
  }

  async #matchExecutionQuantity() {
    if (this.order.quantity === this.dealer.quantity) {
      this.finalQTY = this.order.quantity
      this.#hasRemainingQuantity = false
      this.order.orderStatus = 3
      this.dealer.orderStatus = 3
      await this.#writeFiveTicksOrderToRedis(this.order.symbol, this.dealer.BS, this.dealer.price, this.finalQTY, '-')
    } else if (this.order.quantity < this.dealer.quantity) {
      this.finalQTY = this.order.quantity
      this.dealer.quantity -= this.order.quantity
      await this.cacheProvider.addSortedSetMember(
        `${this.order.symbol}-${this.dealer.BS}`,
        this.dealerProvider.info.score,
        JSON.stringify(this.dealer.orderID)
      )
      await this.cacheProvider.addKeyValue(`${this.dealer.orderID}`, JSON.stringify(this.dealer))
      this.#hasRemainingQuantity = false
      this.order.orderStatus = 3
      this.dealer.orderStatus = 2
      await this.#writeFiveTicksOrderToRedis(this.order.symbol, this.dealer.BS, this.dealer.price, this.finalQTY, '-')
    } else if (this.order.quantity > this.dealer.quantity) {
      this.finalQTY = this.dealer.quantity
      this.order.quantity -= this.dealer.quantity
      this.#hasRemainingQuantity = true
      this.order.orderStatus = 2
      this.dealer.orderStatus = 3
      await this.#writeFiveTicksOrderToRedis(this.order.symbol, this.dealer.BS, this.dealer.price, this.finalQTY, '-')
    } else {
      console.error('matchExecutionQuantity() Error')
    }
    return
  }
}

module.exports = { MatchLogic }

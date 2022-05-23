class OrderResultUpdater {
  constructor(queueProvider, cacheProvider) {
    this.queueProvider = queueProvider
    this.cacheProvider = cacheProvider
    this.#executionID = uuidv4()
    this.#executionTime = new Date().getTime()
  }

  async emitExecutionResult() {
    await this.#sendExecutionToRabbitmqForStorage()
    await this.#emitExeuction()
    await this.#emitKLine()
  }

  async #sendExecutionToRabbitmqForStorage() {
    console.log(this.#executionDetail)
    return await this.queueProvider.sendToSingleQueue('saveNewExec', this.#getExecutionDetail())
  }

  async #emitExeuction() {
    await this.cacheProvider.publishChannel('sendExec', JSON.stringify(this.#getExecSellerMessage()))
    await this.cacheProvider.publishChannel('sendExec', JSON.stringify(this.#getExecBuyerMessage()))
  }

  async #emitKLine() {
    return await this.cacheProvider.publishChannel('kLine', JSON.stringify(this.#getKLineInfo()))
  }

  #getExecutionDetail() {
    return {
      executionID: this.#executionID,
      executionTime: this.#executionTime,
      seller: this.getSeller().account,
      sellerOrderID: this.getSeller().orderID,
      sellerOrderTime: this.getSeller().createTime,
      buyer: this.getBuyer().account,
      buyerOrderID: this.getBuyer().orderID,
      buyerOrderTime: this.getBuyer().createTime,
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionQuantity: this.finalQTY,
    }
  }

  #getExecBuyerMessage() {
    return { brokerID: this.getBuyer().broker, execution: this.#getExecutionBuyer() }
  }

  #getExecutionBuyer() {
    return {
      executionID: this.#executionID,
      executionTime: this.#executionTime,
      dealer: this.getBuyer().account,
      orderID: this.getBuyer().orderID,
      orderTime: this.getBuyer().createTime,
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionQuantity: this.finalQTY,
      orderStatus: this.getBuyer().orderStatus,
    }
  }

  #getExecSellerMessage() {
    return { brokerID: this.getSeller().broker, execution: this.#getExecutionSeller() }
  }

  #getExecutionSeller() {
    return {
      executionID: this.#executionID,
      executionTime: this.#executionTime,
      dealer: this.getSeller().account,
      orderID: this.getSeller().orderID,
      orderTime: this.getSeller().createTime,
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionQuantity: this.finalQTY,
      orderStatus: this.getSeller().orderStatus,
    }
  }

  #getKLineInfo() {
    return {
      symbol: this.order.symbol,
      price: this.bestDealer.price,
      executionTime: this.#executionTime,
    }
  }
}

module.exports = { OrderResultUpdater }

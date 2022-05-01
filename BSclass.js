//市價api切在哪
require('dotenv').config();
const redisClient = require('./util/cache');
const { v4: uuidv4 } = require('uuid');
let { rabbitmqSendToQueue } = require('./util/rabbitmq');
let { addNewOrderFiveTicks, getFiveTicks } = require('./FiveTicks')



class MatchLogic {
  constructor(order, dealerType, orderType) {
    this.order = order;
    this.dealerType = dealerType;
    this.orderType = orderType;
    this.bestDealerOrderID = null;
    this.bestDealer = null;
    this.bestDealerScore = null;
    this.finalQTY = null;
    this.hasRemainingQuantity = false;
    this.executionID = null;
    this.executionTime = null;
    this.executionDetail = {};
    this.executionBuyer = {};
    this.executionSeller = {};
    this.execBuyerMessage = {};
    this.execSellerMessage = {};
    this.kLineInfo = {};
  }

  async getBestDealerOrderIDUtil(head, tail) {
    [this.bestDealerOrderID, this.bestDealerScore] = await redisClient.zrange(`${this.order.symbol}-${this.dealerType}`, head, tail, 'WITHSCORES');
    return;
  }

  compareBestDealerPriceWithOrderPrice() {
    //由子層實作
    throw new Error('compareBestDealerPriceWithOrderPrice() function should be implemented by child.')
  }

  async haveBestDealer() {
    // let comparePriceResult = this.compareBestDealerPriceWithOrderPrice();
    if (this.bestDealerOrderID === undefined || this.compareBestDealerPriceWithOrderPrice()) {
      await this.addNewDealer();
      await addNewOrderFiveTicks(`${this.order.symbol}-${this.orderType}`, this.order.price, this.order.quantity, '+');
      return false;
    }
    return true;
  }

  async getBestDealerOrderInfo() {
    this.bestDealer = await redisClient.get(this.bestDealerOrderID);
    this.bestDealer = JSON.parse(this.bestDealer);
    return;
  }

  async deleteBestDealer() {
    await redisClient.zrem(`${this.order.symbol}-${this.dealerType}`, this.bestDealerOrderID);
    await redisClient.del(`${this.bestDealerOrderID}`);
    return;
  }

  async matchExecutionQuantity() {
    if (this.order.quantity === this.bestDealer.quantity) {
      this.finalQTY = this.order.quantity;
      this.hasRemainingQuantity = false;
      this.order.orderStatus = '完全成交';
      this.bestDealer.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-${this.dealerType}`, this.bestDealer.price, this.finalQTY, '-');
    } else if (this.order.quantity < this.bestDealer.quantity) {
      this.finalQTY = this.order.quantity;
      this.bestDealer.quantity -= this.order.quantity;
      await redisClient.zadd(`${this.order.symbol}-${this.dealerType}`, this.bestDealerScore, JSON.stringify(this.bestDealer.orderID));
      await redisClient.set(`${this.bestDealer.orderID}`, JSON.stringify(this.bestDealer));
      this.hasRemainingQuantity = false;
      this.order.orderStatus = '完全成交';
      this.bestDealer.orderStatus = '部分成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-${this.dealerType}`, this.bestDealer.price, this.finalQTY, '-');
    } else if (this.order.quantity > this.bestDealer.quantity) {
      this.finalQTY = this.bestDealer.quantity;
      this.order.quantity -= this.bestDealer.quantity;
      this.hasRemainingQuantity = true;
      this.order.orderStatus = '部分成交';
      this.bestDealer.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-${this.dealerType}`, this.bestDealer.price, this.finalQTY, '-');
    } else {
      console.error('matchExecutionQuantity() Error');
    }
    return;
  }

  createExecutionIDAndTime() {
    this.executionID = uuidv4();
    this.executionTime = new Date();
    return;
  }

  getSeller() {
    //由子層實作
    throw new Error('getSeller() function should be implemented by child.')
  }

  getBuyer() {
    //由子層實作
    throw new Error('getBuyer() function should be implemented by child.')
  }

  createExecutionDetail() {
    // console.log('This is getSeller: ', this.getSeller())
    // console.log('This is getBuyer: ', this.getBuyer())
    this.executionDetail = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      seller: this.getSeller().account,
      sellerOrderID: this.getSeller().orderID,
      sellerOrderTime: this.getSeller().orderTime,
      buyer: this.getBuyer().account,
      buyerOrderID: this.getBuyer().orderID,
      buyerOrderTime: this.getBuyer().orderTime,
      stock: this.order.symbol,
      price: this.bestDealer.price,
      quantity: this.finalQTY,
    };
    return;
  }

  createExecutionBuyer() {
    this.executionBuyer = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      orderID: this.getBuyer().orderID,
      orderTime: this.getBuyer().orderTime,
      stock: this.order.symbol,
      price: this.bestDealer.price,
      quantity: this.finalQTY,
      orderStatus: this.getBuyer().orderStatus,
    }
    return;
  }

  createExecutionSeller() {
    this.executionSeller = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      orderID: this.getSeller().orderID,
      orderTime: this.getSeller().orderTime,
      stock: this.order.symbol,
      price: this.bestDealer.price,
      quantity: this.finalQTY,
      orderStatus: this.getSeller().orderStatus,
    };
    return;
  }

  createExecutionMsg() {
    this.execSellerMessage = { brokerID: this.getSeller().broker, execution: this.executionSeller }
    this.execBuyerMessage = { brokerID: this.getBuyer().broker, execution: this.executionBuyer }
    return;
  }

  createkLineInfo() {
    this.kLineInfo = {
      stock: this.order.symbol,
      price: this.bestDealer.price,
      executionTime: this.executionTime,
    };
    return;
  }

  async sendExecutionToRabbitmqForStorage() { //TODO:sharding多個consumer，各自定義const再帶入？
    console.debug('[executionDetail]', this.executionDetail)
    return await rabbitmqSendToQueue('saveNewExec', this.executionDetail);
  }

  async emitExeuction() {
    await redisClient.publish('sendExec', JSON.stringify(this.execSellerMessage));
    await redisClient.publish('sendExec', JSON.stringify(this.execBuyerMessage));
    return;
  }

  async emitKLine() {
    return await redisClient.publish('kLine', JSON.stringify(this.kLineInfo));
  }

  async addNewDealer() {
    let setScore = this.order.orderID;
    await redisClient.zadd(`${this.order.symbol}-${this.orderType}`, setScore, JSON.stringify(this.order.orderID));
    await redisClient.set(`${this.order.orderID}`, JSON.stringify(this.order));
    return
  }




}


class BuyerMatchLogic extends MatchLogic {

  constructor(order) {
    super(order, 'seller', 'buyer');
  }

  async getBestDealerOrderID() {
    await this.getBestDealerOrderIDUtil(0, 0);
    return;
  }


  compareBestDealerPriceWithOrderPrice() {
    return (parseInt(this.bestDealerScore.toString().slice(0, -8)) > this.order.price * 100)
  }

  getSeller() {
    return this.bestDealer;
  }

  getBuyer() {
    return this.order;
  }

}


class SellerMatchLogic extends MatchLogic {

  constructor(order) {
    super(order, 'buyer', 'seller');
  }

  async getBestDealerOrderID() {
    await this.getBestDealerOrderIDUtil(-1, -1);
    return;
  }

  compareBestDealerPriceWithOrderPrice() {
    let compareResult = (parseInt(this.bestDealerScore.toString().slice(0, -8)) < this.order.price * 100);
    return compareResult;
  }

  getSeller() {
    return this.order;
  }

  getBuyer() {
    return this.bestDealer;
  }

}

module.exports = { BuyerMatchLogic, SellerMatchLogic }









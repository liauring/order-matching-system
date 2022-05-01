require('dotenv').config();
const redisClient = require('./util/cache');
const { v4: uuidv4 } = require('uuid');
let { rabbitmqConn } = require('./util/rabbitmq');


class BuyerMatchLogicOrigin {
  constructor(order) {
    this.order = order;
    this.bestSellerOrderID = null; //TODO:要不要拉出來用繼承的？
    this.bestSeller = null;
    this.bestSellerScore = null;
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

  async getBestDealerOrderID() {
    [this.bestSellerOrderID, this.bestSellerScore] = await redisClient.zrange(`${this.order.symbol}-seller`, 0, 0, 'WITHSCORES');
    return;
  }

  async haveBestDealer() {
    if (this.bestSellerOrderID === undefined || parseInt(this.bestSellerScore.toString().slice(0, -8)) > this.order.price * 100) {
      await addNewBuyer(this.order); //TODO: addNewBuyer跟外面的function怎麼放進來
      await addNewOrderFiveTicks(`${this.order.symbol}-buyer`, this.order.price, this.order.quantity, '+');
      return;
    }
    return;
  }

  async getBestDealerOrderInfo() {
    this.bestSeller = await redisClient.get(this.bestSellerOrderID);
    this.bestSeller = JSON.parse(this.bestSeller);
  }

  async deleteBestDealer() {
    await redisClient.zrem(`${this.order.symbol}-seller`, this.bestSellerOrderID);
    await redisClient.del(`${this.bestSellerOrderID}`);
    return;
  }

  async matchExecutionQuantity() {
    if (this.order.quantity === this.bestSeller.quantity) {
      this.finalQTY = this.order.quantity;
      // this.hasRemainingQuantity = false;
      this.order.orderStatus = '完全成交';
      this.bestSeller.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-seller`, this.bestSeller.price, this.finalQTY, '-');
    } else if (this.order.quantity < this.bestSeller.quantity) {
      this.finalQTY = this.order.quantity;
      this.bestSeller.quantity -= this.order.quantity;
      await redisClient.zadd(`${this.order.symbol}-seller`, this.bestSellerScore, JSON.stringify(this.bestSeller.orderID));
      await redisClient.set(`${this.bestSeller.orderID}`, JSON.stringify(this.bestSeller));
      // hasRemainingQuantity = false;
      this.order.orderStatus = '完全成交';
      this.bestSeller.orderStatus = '部分成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-seller`, this.bestSeller.price, this.finalQTY, '-');
    } else if (this.order.quantity > this.bestSeller.quantity) {
      this.finalQTY = this.bestSeller.quantity;
      this.order.quantity -= this.bestSeller.quantity;
      this.order.quantity = this.order.quantity;
      this.hasRemainingQuantity = true;
      this.order.orderStatus = '部分成交';
      this.bestSeller.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-seller`, this.bestSeller.price, this.finalQTY, '-');
    } else {
      console.error('matchNewOrderConsumer0-buyer condition Error');
    }
    return;
  }

  createExecutionDetail() {
    let executionID = uuidv4();
    let executionTime = new Date()
    this.executionDetail = {
      executionID: executionID,
      executionTime: executionTime,
      seller: this.bestSeller.account,
      sellerOrderID: this.bestSeller.orderID,
      sellerOrderTime: this.bestSeller.orderTime,
      buyer: this.order.account,
      buyerOrderID: this.order.orderID,
      buyerOrderTime: this.order.orderTime,
      stock: this.order.symbol,
      price: this.bestSeller.price,
      quantity: this.finalQTY,
    };
    return;
  }

  createExecutionIDAndTime() {
    this.executionID = uuidv4();
    this.executionTime = new Date();
    return;
  }

  createExecutionDetail() {
    this.executionDetail = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      seller: this.bestSeller.account,
      sellerOrderID: this.bestSeller.orderID,
      sellerOrderTime: this.bestSeller.orderTime,
      buyer: this.order.account,
      buyerOrderID: this.order.orderID,
      buyerOrderTime: this.order.orderTime,
      stock: this.order.symbol,
      price: this.bestSeller.price,
      quantity: this.finalQTY,
    };
    return;
  }

  createExecutionBuyer() {
    this.executionBuyer = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      orderID: this.order.orderID,
      orderTime: order.orderTime,
      stock: this.order.symbol,
      price: this.bestSeller.price,
      quantity: this.finalQTY,
      orderStatus: this.order.orderStatus,
    }
    return;
  }

  createExecutionSeller() {
    this.executionSeller = {
      executionID: this.executionID,
      executionTime: this.executionTime,
      orderID: this.bestSeller.orderID,
      orderTime: this.bestSeller.orderTime,
      stock: this.order.symbol,
      price: this.bestSeller.price,
      quantity: this.finalQTY,
      orderStatus: this.bestSeller.orderStatus,
    };
    return;
  }

  createkLineInfo() {
    this.kLineInfo = {
      stock: this.order.symbol,
      price: this.bestSeller.price,
      executionTime: this.executionTime,
    };
    return;
  }


  async sendExecutionToRabbitmqForStorage(pubQueue) { //TODO:sharding多個consumer，各自定義const再帶入？
    return await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(this.executionDetail)), { deliveryMode: true });
  }

  createExecutionMsg() {
    this.execBuyerMessage = { brokerID: this.order.broker, execution: this.executionBuyer };
    this.execSellerMessage = { brokerID: bestSeller.broker, execution: this.executionSeller };
    return;
  }


  async emitExeuction() {
    await redisClient.publish('sendExec', JSON.stringify(this.execSellerMessage));
    await redisClient.publish('sendExec', JSON.stringify(this.execBuyerMessage));
    return;
  }

  async emitKLine() {
    return await redisClient.publish('kLine', JSON.stringify(this.kLineInfo));
  }
}
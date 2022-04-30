//市價api切在哪
require('dotenv').config();
const redisClient = require('./util/cache');
const { v4: uuidv4 } = require('uuid');
let { rabbitmqConn } = require('./util/rabbitmq');
const consumeQueue = 'matchNewOrder-stock-0';
const pubQueue = 'saveNewExec';


class buyerMatchLogic {
  constructor(order) {
    this.order = order;
    this.bestSellerOrderID = null;
    this.bestSeller = null;
    this.bestSellerScore = null;
    this.finalQTY = null;
    this.hasRemainingQuantity = false;
    this.executionDetail = {
      executionID: null,
      executionTime: null,
      seller: null,
      sellerOrderID: null,
      sellerOrderTime: null,
      buyer: null,
      buyerOrderID: null,
      buyerOrderTime: null,
      stock: null,
      price: null,
      quantity: null,
    };
    this.executionBuyer = {
      executionID: null,
      executionTime: null,
      orderID: null,
      orderTime: null,
      stock: null,
      price: null,
      quantity: null,
      orderStatus: null,
    };
    this.executionSeller = {
      executionID: null,
      executionTime: null,
      orderID: null,
      orderTime: null,
      stock: null,
      price: null,
      quantity: null,
      orderStatus: null,
    };
    this.kLineInfo = {
      stock: null,
      price: null,
      executionTime: null,
    }
  }

  getBestDealerOrderID() {
    [this.bestSellerOrderID, this.bestSellerScore] = await redisClient.zrange(`${this.order.symbol}-seller`, 0, 0, 'WITHSCORES');
    return;
  }

  haveBestDealer() {
    if (this.bestSellerOrderID === undefined || parseInt(this.bestSellerScore.toString().slice(0, -8)) > this.order.price * 100) {
      await addNewBuyer(this.order); //TODO: addNewBuyer跟外面的function怎麼放進來
      await addNewOrderFiveTicks(`${this.order.symbol}-buyer`, this.order.price, this.order.quantity, '+')
      return;
    }
    return
  }

  getBestDealerOrderInfo() {
    this.bestSeller = await redisClient.get(this.bestSellerOrderID)
    this.bestSeller = JSON.parse(this.bestSeller)
  }

  deleteBestDealer() {
    await redisClient.zrem(`${this.order.symbol}-seller`, this.bestSellerOrderID);
    await redisClient.del(`${this.bestSellerOrderID}`)
    return
  }

  matchExecutionQuantity() {
    if (this.order.quantity === this.bestSeller.quantity) {
      this.finalQTY = this.order.quantity;
      // this.hasRemainingQuantity = false;
      this.order.orderStatus = '完全成交';
      this.bestSeller.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-seller`, this.bestSeller.price, this.finalQTY, '-')
    } else if (this.order.quantity < this.bestSeller.quantity) {
      this.finalQTY = this.order.quantity
      this.bestSeller.quantity -= this.order.quantity;
      await redisClient.zadd(`${this.order.symbol}-seller`, this.bestSellerScore, JSON.stringify(this.bestSeller.orderID));
      await redisClient.set(`${this.bestSeller.orderID}`, JSON.stringify(this.bestSeller));
      // hasRemainingQuantity = false;
      this.order.orderStatus = '完全成交';
      this.bestSeller.orderStatus = '部分成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-seller`, this.bestSeller.price, this.finalQTY, '-')
    } else if (this.order.quantity > this.bestSeller.quantity) {
      this.finalQTY = this.bestSeller.quantity;
      this.order.quantity -= this.bestSeller.quantity;
      this.order.quantity = this.order.quantity;
      this.hasRemainingQuantity = true;
      this.order.orderStatus = '部分成交';
      this.bestSeller.orderStatus = '完全成交';
      await addNewOrderFiveTicks(`${this.order.symbol}-seller`, this.bestSeller.price, this.finalQTY, '-')
    } else {
      console.error('matchNewOrderConsumer0-buyer condition Error')
    }
    return
  }
  //------------------------------
  //------------------------------

  sendExecutionToRabbitmqForStorage(pubQueue, executionDetail) {
    return await rabbitmqConn.sendToQueue(pubQueue, Buffer.from(JSON.stringify(executionDetail)), { deliveryMode: true });
  }

  emitExeuction(execSellerMessage, execBuyerMessage) {
    await redisClient.publish('sendExec', JSON.stringify(execSellerMessage));
    await redisClient.publish('sendExec', JSON.stringify(execBuyerMessage));
    return
  }

  emitKLine(kLineInfo) {
    return await redisClient.publish('kLine', JSON.stringify(kLineInfo))
  }



}
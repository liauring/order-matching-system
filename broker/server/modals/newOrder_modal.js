let { mysqldb } = require('../../util/mysql')

const createNewOrder = async (exchangeResult) => {
  let sqlSyntax = `INSERT INTO orderInfo SET ?`
  let columns = {
    orderID: exchangeResult.orderID,
    account: exchangeResult.account,
    symbol: exchangeResult.symbol,
    status: exchangeResult.orderStatus, //1: 委託成功, 2: 部分成交, 3: 完全成交
    BS: exchangeResult.BS,
    order_quantity: exchangeResult.quantity,
    remaining_quantity: exchangeResult.quantity,
    execution_quantity: exchangeResult.executionQuantity, //0
    order_price: exchangeResult.price,
  }
  await mysqldb.query(sqlSyntax, columns)
  return
}

const createNewOrderHistory = async (exchangeResult) => {
  let sqlSyntax = `INSERT INTO order_history SET ?`
  let columns = {
    orderID: exchangeResult.orderID,
    status: exchangeResult.orderStatus, //1: 委託成功, 2: 部分成交, 3: 完全成交 4: 減量成功
    quantity: exchangeResult.quantity,
    price: exchangeResult.price,
  }
  await mysqldb.query(sqlSyntax, columns)
  return
}

const formatOrder = (newOrder) => {
  newOrder.account = parseInt(newOrder.account)
  newOrder.broker = parseInt(newOrder.broker)
  newOrder.symbol = parseInt(newOrder.symbol)
  newOrder.price = parseFloat(newOrder.price)
  newOrder.quantity = parseInt(newOrder.quantity)
  newOrder.orderStatus = 1 //1: 委託成功, 2: 部分成交, 3: 完全成交
  return newOrder
}

const createOrderID = (price) => {
  let currentTime = new Date().getTime()
  let orderID = parseInt('' + parseInt(parseFloat(price) * 100) + `${currentTime}`, 10)
  return orderID
}

module.exports = { createNewOrder, createNewOrderHistory, formatOrder, createOrderID }

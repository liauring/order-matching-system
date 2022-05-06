let { mysqldb } = require('../../util/mysql')

const getOrderInfo = async (account, symbol) => {
  let sqlSyntax = 'SELECT * FROM orderInfo WHERE account = ? AND symbol = ?'
  let [result] = await mysqldb.query(sqlSyntax, [account, symbol])
  return result
}

const getOrderInfoSingle = async (orderID) => {
  let sqlSyntax = 'SELECT * FROM orderInfo WHERE orderID = ?'
  let [result] = await mysqldb.query(sqlSyntax, orderID)
  return result
}

const updateOrderInfo = async (updateResult) => {
  let sqlSyntax = `UPDATE orderInfo SET ? WHERE orderID = ?`
  if (updateResult.orderStatus === 0) {
    updateResult.orderStatus = 3
  }
  let columns = {
    status: updateResult.orderStatus, //1: 委託成功, 2: 部分成交, 3: 完全成交
    remaining_quantity: updateResult.quantity,
    // execution_quantity: updateResult.executionQuantity, //TODO: Socket拿到成交單要來更新
  }
  await mysqldb.query(sqlSyntax, [columns, updateResult.orderID])
  return
}

// patch.res  = {
//   orderStatus: orderInfo.orderStatus,
//   quantity: orderInfo.quantity,
//   price: orderInfo.price,
//   executionCount: -1,
//   orderTime: orderInfo.orderTime,
//   orderID: orderInfo.orderID
// }

const createOrderHistory = async (originalReq, updateResult) => {
  let sqlSyntax = `INSERT INTO order_history SET ?`
  let columns = {
    orderID: updateResult.orderID,
    status: 4, //1: 委託成功, 3: 已成交 4: 減量成功
    quantity: originalReq.quantity,
    order_price: updateResult.price,
  }
  await mysqldb.query(sqlSyntax, [columns, condition])
  return
}

module.exports = { getOrderInfo, getOrderInfoSingle, updateOrderInfo, createOrderHistory }
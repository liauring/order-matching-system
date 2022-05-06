let { mysqldb } = require('../../util/mysql')

const updateOrderInfo = async (updateResult) => {
  let [result] = mysqldb.query(
    `SELECT remaining_quantity, execution_quantity FROM orderInfo WHERE orderID = ${updateResult.orderID}`
  )
  let remaining_quantity = result[0].remaining_quantity - updateResult.quantity
  let execution_quantity = result[0].execution_quantity + updateResult.execution_quantity
  let columns = {
    status: updateResult.orderStatus, //1: 委託成功, 2: 部分成交, 3: 完全成交
    remaining_quantity: remaining_quantity,
    execution_quantity: execution_quantity,
  }
  let sqlSyntax = `UPDATE orderInfo SET ? WHERE orderID = ?`
  await mysqldb.query(sqlSyntax, [columns, updateResult.orderID])
  return
}

const createOrderHistory = async (updateResult) => {
  let columns = {
    orderID: updateResult.orderID,
    status: 3, //1: 委託成功, 3: 已成交 4: 減量成功
    quantity: updateResult.execution_quantity,
    order_price: updateResult.price,
  }
  let sqlSyntax = `INSERT INTO order_history SET ? `
  await mysqldb.query(sqlSyntax, columns)
  return
}

module.exports = { updateOrderInfo, createOrderHistory }

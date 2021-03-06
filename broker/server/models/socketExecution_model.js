let { mysqldb } = require('../../util/mysql')

const updateOrderInfo = async (updateResult) => {
  let conn
  try {
    conn = await mysqldb.getConnection()
    await conn.query('START TRANSACTION')
    let sqlSyntaxSelectOrder = `SELECT orderID, remaining_quantity, execution_quantity FROM orderInfo WHERE orderID = ? for update`
    let [result] = await conn.query(sqlSyntaxSelectOrder, updateResult.orderID)

    let remaining_quantity = result[0].remaining_quantity - updateResult.executionQuantity
    if (remaining_quantity < 0) {
      remaining_quantity = 0
    }
    let execution_quantity = result[0].execution_quantity + updateResult.executionQuantity
    let columns = {
      status: updateResult.orderStatus, //1: 委託成功, 2: 部分成交, 3: 完全成交
      remaining_quantity: remaining_quantity,
      execution_quantity: execution_quantity,
    }
    let sqlSyntax = `UPDATE orderInfo SET ? WHERE orderID = ?`
    await conn.query(sqlSyntax, [columns, updateResult.orderID])
    await conn.query('COMMIT')
    await conn.release()
  } catch (error) {
    await conn.query('ROLLBACK')
    await conn.query('COMMIT')
    await conn.release()
    throw error
  }
}

const createOrderHistory = async (updateResult) => {
  let columns = {
    orderID: updateResult.orderID,
    status: 3, //1: 委託成功, 3: 已成交 4: 減量成功
    quantity: updateResult.executionQuantity,
    price: updateResult.price,
  }
  let sqlSyntax = `INSERT INTO order_history SET ? `
  await mysqldb.query(sqlSyntax, columns)
}

module.exports = { updateOrderInfo, createOrderHistory }

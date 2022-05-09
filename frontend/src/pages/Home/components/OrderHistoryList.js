import { useState } from 'react'

const OrderHistoryList = ({ order, setSelectedOrder }) => {
  const getStatus = (order) => {
    console.log('orderHistoryList:', order)
    if (!order) {
      return
    }
    switch (order.orderStatus) {
      case 1:
        return '委託成功'
      case 2:
        return '部分成交'
      case 3:
        return '完全成交'
      default:
        return '委託失敗'
    }
  }

  const getBS = (order) => {
    if (!order) {
      return
    }
    switch (order.BS) {
      case 'buyer':
        return '買'
      case 'seller':
        return '賣'
      default:
        return '委託失敗'
    }
  }
  function getLocalTime(order) {
    if (!order) {
      return
    }
    let localTime = new Date(order.orderTime)
    return localTime.toLocaleTimeString()
  }
  return (
    <tr
      className="orderHistoryTabletr"
      onClick={() => {
        if (order.orderStatus === 3) {
          return
        }
        setSelectedOrder(order)
      }}
    >
      <td className="tableOrderStatus"> {getStatus(order)}</td>
      <td className="tableOrderBS tableOrder">{getBS(order)}</td>
      <td className="tableOrderQuant tableOrder">{order.quantity}</td>
      <td className="tableOrderPrice tableOrder">{order.price}</td>
      <td className="tableOrderExecQuant tableOrder">{order.executionQuantity}</td>
      <td className="tableOrderTime tableOrderTimeText">{getLocalTime(order)}</td>
    </tr>
  )
}

export default OrderHistoryList

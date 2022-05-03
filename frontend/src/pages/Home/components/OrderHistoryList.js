import { useState } from "react"




const OrderHistoryList = ({ order, setSelectedOrder }) => {

  const getStatus = () => {
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

  const getBS = () => {
    switch (order.BS) {
      case "buyer":
        return "買"
      case "seller":
        return "賣"
      default:
        return '委託失敗'
    }
  }


  return <tr className='orderHistoryTabletr' onClick={() => {
    if (order.orderStatus === 3) {
      return;
    }
    setSelectedOrder(order)
  }}>


    <td className='tableOrderStatus'> {getStatus()}</td >
    <td className='tableOrderBS'>{getBS()}</td>
    <td className='tableOrder'>{order.quantity}</td>
    <td className='tableOrder'>{order.price}</td>
    <td className='tableOrder'>{order.executionQuantity}</td>
    <td className='tableOrderTime tableOrderTimeText'>{order.orderTime}</td>


  </tr>




}


export default OrderHistoryList
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
        return 'unknown'
    }
  }


  return <tr className='orderHistoryTabletr' onClick={() => {
    setSelectedOrder(order)
  }}>


    <td className='tableOrderStatus'> {getStatus()}</td >
    <td className='tableOrder'>{order.BS}</td>
    <td className='tableOrder'>{order.quantity}</td>
    <td className='tableOrder'>{order.price}</td>
    <td className='tableOrder'>{order.executionQuantity}</td>
    <td className='tableOrderTime'>{order.orderTime}</td>


  </tr>




}


export default OrderHistoryList
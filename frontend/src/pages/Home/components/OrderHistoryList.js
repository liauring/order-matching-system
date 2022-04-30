import { useState } from "react"



const OrderHistoryList = ({ status, quantity, price, executionCount, orderTime, orderId, setEditingShow }) => {

  //TODO: 刪改單畫面
  return <tr className='orderHistoryTabletr' onClick={() => {
    setEditingShow(true)
  }}>


    <td className='tableOrderStatus'> {status}</td >
    <td className='tableOrder'>{quantity}</td>
    <td className='tableOrder'>{price}</td>
    <td className='tableOrder'>{executionCount}</td>
    <td className='tableOrderTime'>{orderTime}</td>


  </tr>




}


export default OrderHistoryList
import { useState } from "react"
import EditingWindow from './orderEditingWindow'

const OrderHistoryList = ({ status, quantity, price, executionCount, orderTime, orderId }) => {
  const [editingShow, setEditingShow] = useState(false);

  return <tr onClick={() => {
    setEditingShow(true)
  }}>


    <td td className='tableOrderStatus'> {status}</td >
    <td className='tableOrder'>{quantity}</td>
    <td className='tableOrder'>{price}</td>
    <td className='tableOrder'>{executionCount}</td>
    <td className='tableOrderTime'>{orderTime}</td>
    {
      editingShow &&
      <EditingWindow
        show={editingShow}
        onHide={() => setEditingShow(false)}
        orderID={orderId}
        quantity={quantity}
      />}

  </tr>




}


export default OrderHistoryList
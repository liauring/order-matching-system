import { useState, useEffect } from "react"
import OrderHistoryList from "./OrderHistoryList"
import EditingWindow from './OrderEditingWindow'
import axios from "axios"
import { API_PATCH_ORDER } from "../../../global/Constants"


const OrderHistory = ({ orders }) => {
  //當視窗開著 不處裡資料即時更新
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateAndCloseOrder = (quantity) => {
    sendUpdatedOrder(selectedOrder, quantity)
    setSelectedOrder(null)

  }


  const sendUpdatedOrder = async (selectedOrder, quantity) => {
    let reqBody = {
      orderID: selectedOrder.orderID,
      symbol: selectedOrder.symbol,
      quantity: quantity,
      BS: selectedOrder.BS
    }
    console.log(reqBody);
    let response = await axios.patch(`${API_PATCH_ORDER}`, reqBody);
    // console.log('Update order', response)
  }



  useEffect(() => {
    console.log(orders);
  }, [orders])
  return <div id="orderHistory-section">
    <table className='orderHistory'>
      <thead>
        <tr>
          <th className='tableOrderStatus'>狀態</th>
          <th className='tableOrderBS'>買賣</th>
          <th className='tableOrder'>數量</th>
          <th className='tableOrder'>價格</th>
          <th className='tableOrder'>成交數</th>
          <th className='tableOrderTime'>委託時間</th>
        </tr>
      </thead>
      <tbody>
        {
          orders ?
            orders.map(order => <OrderHistoryList
              order={order}
              setSelectedOrder={setSelectedOrder} />)
            : null
        }


      </tbody>
    </table >
    <div className="editingWindow-section">
      {
        selectedOrder != null &&
        <EditingWindow
          symbol={selectedOrder.symbol}
          price={selectedOrder.price}
          count={selectedOrder.quantity}
          remainingQuantity={selectedOrder.quantity - selectedOrder.executionQuantity}
          updateOrder={(quantity) => updateAndCloseOrder(quantity)}
          setSelectedOrder={setSelectedOrder}
        />
      }
    </div>


  </div>
}

export default OrderHistory
import { useState, useEffect } from 'react'
import OrderHistoryList from './OrderHistoryList'
import EditingWindow from './OrderEditWindow'
import axios from 'axios'
import { API_ORDER } from '../../../global/Constants'

const OrderHistory = ({ orders, setUpdateOrder }) => {
  //當視窗開著 不處裡資料即時更新
  const [selectedOrder, setSelectedOrder] = useState(null)

  const updateAndCloseOrder = (quantity) => {
    sendUpdatedOrder(quantity)
    setSelectedOrder(null)
  }

  const sendUpdatedOrder = async (quantity) => {
    let remainingQuantity = selectedOrder.quantity - selectedOrder.executionQuantity
    if (quantity > remainingQuantity) {
      window.alert('數量不能大於剩餘數量')
    } else if (quantity < 0) {
      window.alert('數量不能小於剩餘數量')
    } else {
      let reqBody = {
        orderID: selectedOrder.orderID,
        symbol: selectedOrder.symbol,
        quantity: quantity,
        BS: selectedOrder.BS,
      }
      console.log(reqBody)
      let response = await axios.patch(`${API_ORDER}`, reqBody)
      setUpdateOrder(response.data)
    }
  }

  return (
    <div id="orderHistory-section">
      <table className="orderHistory">
        <thead>
          <tr>
            <th className="tableOrderStatus">狀態</th>
            <th className="tableOrderBS tableOrder">買賣</th>
            <th className="tableOrderQuant tableOrder">剩餘</th>
            <th className="tableOrderPrice tableOrder">價格</th>
            <th className="tableOrderExecQuant tableOrder">成交數</th>
            <th className="tableOrderTime">委託時間</th>
          </tr>
        </thead>
        <tbody>
          {orders
            ? orders.map((order) => <OrderHistoryList order={order} setSelectedOrder={setSelectedOrder} />)
            : null}
        </tbody>
      </table>
      <div className="editingWindow-section">
        {selectedOrder != null && (
          <EditingWindow
            symbol={selectedOrder.symbol}
            price={selectedOrder.price}
            remainingQuantity={selectedOrder.quantity}
            updateOrder={(quantity) => updateAndCloseOrder(quantity)}
            setSelectedOrder={setSelectedOrder}
          />
        )}
      </div>
    </div>
  )
}

export default OrderHistory

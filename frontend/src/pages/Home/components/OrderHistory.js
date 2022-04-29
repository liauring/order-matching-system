import { useEffect } from "react"
import OrderHistoryList from "./OrderHistoryList"

const OrderHistory = ({ newOrderToHistory }) => {
  useEffect(() => {
    console.log(newOrderToHistory);
  }, [newOrderToHistory])
  return <div id="orderHistory-section">
    <table className='orderHistory'>
      <thead>
        <tr>
          <th className='tableOrderStatus'>狀態</th>
          <th className='tableOrder'>數量</th>
          <th className='tableOrder'>價格</th>
          <th className='tableOrder'>成交數</th>
          <th className='tableOrderTime'>委託時間</th>
        </tr>
      </thead>
      <tbody>
        {
          newOrderToHistory ?
            newOrderToHistory.map(history => <OrderHistoryList status={history.status} quantity={history.quantity} price={history.price} executionCount={history.executionCount} orderTime={history.orderTime} />)
            : null
        }


      </tbody>
    </table >

  </div>
}

export default OrderHistory
import { useState, useEffect } from "react"
import OrderHistoryList from "./OrderHistoryList"
import { Socket } from '../../../global/Socket'
import EditingWindow from './OrderEditingWindow'


const OrderHistory = ({ newOrderToHistory }) => {
  const [editingShow, setEditingShow] = useState(false);



  // let executionBuyer = {
  //   executionID: executionID,
  //   executionTime: executionTime,
  //   orderID: order.orderID,
  //   orderTime: order.orderTime,
  //   stock: order.symbol,
  //   price: bestSeller.price,
  //   quantity: finalQTY,
  //   orderStatus: order.orderStatus,
  // }

  // TODO:收到成交改變歷史記錄
  // useEffect(() => {
  //   if (Socket) {
  //     Socket.on('execution', function (execution) {
  //       console.log(execution)
  //     });
  //   }
  // }, [Socket])


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
            newOrderToHistory.map(history => <OrderHistoryList status={history.status} quantity={history.quantity} price={history.price} executionCount={history.executionCount} orderTime={history.orderTime} setEditingShow={setEditingShow} />)
            : null
        }


      </tbody>
    </table >
    {/* <div className="editingWindow-section"> */}
    {
      editingShow &&
      <EditingWindow
        editingShow={editingShow}
        onHide={() => setEditingShow(false)}
      // orderID={orderId}
      // quantity={quantity}
      />
    }
    {/* </div> */}

  </div>
}

export default OrderHistory
import CandleStick from './components/CandleStick'
import FiveTicks from './components/FiveTicks'
import StockInfo from './components/StockInfo'
import NewOrder from './components/NewOrder'
import OrderHistory from './components/OrderHistory'
import { useStatus } from '../../global/useStatus'
import { useEffect, useState, useRef } from 'react'

import './base.css'
import './flex.css'

const Home = () => {
  const { socket } = useStatus()
  const [orders, setOrders] = useState([])
  const [sentOrder, setSentOrder] = useState({})
  const [updateOrder, setUpdateOrder] = useState({})
  const executionMap = useRef({}) //key:OrderID, value: executionInfo
  const didMountSocketEffect = useRef(false)
  const didMountSentEffect = useRef(false)

  useEffect(() => {
    if (socket) {
      function handle(executionInfo) {
        console.log('Socket got execution: ', executionInfo)
        setUpdateOrder(executionInfo)
      }

      socket.on('execution', handle)
    }
  }, [socket])

  useEffect(() => {
    if (!didMountSocketEffect.current) {
      didMountSocketEffect.current = true
      return
    }
    const isSameID = (order) => order.orderID === updateOrder.orderID
    var copyOrders = [...orders]
    var index = copyOrders.findIndex(isSameID)
    if (index === -1) {
      executionMap.current[updateOrder.orderID] = updateOrder
    } else {
      copyOrders[index].orderStatus = updateOrder.orderStatus
      copyOrders[index].executionQuantity += updateOrder.executionQuantity
      setOrders(copyOrders)
    }
  }, [updateOrder])

  useEffect(() => {
    if (!didMountSentEffect.current) {
      didMountSentEffect.current = true
      return
    }
    var copySentOrder = sentOrder
    if (executionMap[copySentOrder.orderID] == null) {
      setOrders((prev) => [...prev, copySentOrder])
    } else {
      copySentOrder.orderStatus = executionMap.current[copySentOrder.orderID].orderStatus
      copySentOrder.executionQuantity = executionMap.current[copySentOrder.orderID].executionQuantity
      executionMap.current[copySentOrder.orderID] = null
      setOrders((prev) => [...prev, copySentOrder])
    }
  }, [sentOrder])

  return (
    <div>
      {/* <CandleStick /> */}
      <div className="blocks fiveTicksAndInfo-section">
        <FiveTicks />
        <StockInfo />
      </div>
      <div className="blocks newOrderAndOrderHistory-section">
        <NewOrder setSentOrder={setSentOrder} />
        <OrderHistory orders={orders} />
      </div>
    </div>
  )
}

export default Home

import CandleStick from './components/CandleStick'
import FiveTicks from './components/FiveTicks'
import StockInfo from './components/StockInfo'
import NewOrder from './components/NewOrder'
import OrderHistory from './components/OrderHistory'
import ClientIDWindow from './components/ClientIDWindow'
import axios from 'axios'
import { API_ORDER } from '../../global/Constants'
import { useStatus } from '../../global/useStatus'
import { useEffect, useState, useRef } from 'react'

import './base.css'
import './flex.css'

const Home = () => {
  const { socket, clientID } = useStatus()
  const [orders, setOrders] = useState([])
  const [sentOrder, setSentOrder] = useState({})
  const [updateOrder, setUpdateOrder] = useState({})
  const executionMap = useRef({}) //key:OrderID, value: executionInfo
  const didMountSocketEffect = useRef(false)
  const didMountSentEffect = useRef(false)

  async function getOrderHistory() {
    let reqBody = {
      account: clientID,
      symbol: 2330,
    }
    console.log(reqBody)
    let response = await axios.post(`${API_ORDER}`, reqBody)
    setOrders(response.data)
  }

  useEffect(() => {
    if (clientID) {
      getOrderHistory()
    }
  }, [clientID])

  useEffect(() => {
    if (socket) {
      function handle(executionOrder) {
        console.log('Socket got execution: ', executionOrder)
        setUpdateOrder(executionOrder)
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
    let copyOrders = [...orders]
    let index = copyOrders.findIndex(isSameID)
    if (index === -1) {
      executionMap.current[updateOrder.orderID] = updateOrder
    } else {
      copyOrders[index] = updateOrder
      setOrders(copyOrders)
    }
  }, [updateOrder])

  useEffect(() => {
    if (!didMountSentEffect.current) {
      didMountSentEffect.current = true
      return
    }

    let copySentOrder = sentOrder
    if (executionMap.current[copySentOrder.orderID] == null) {
      setOrders((prev) => [...prev, copySentOrder])
    } else {
      setOrders((prev) => [...prev, executionMap.current[copySentOrder.orderID]])
      executionMap.current[copySentOrder.orderID] = null
    }
  }, [sentOrder])

  return (
    <div>
      <ClientIDWindow />
      <div className="blocks fiveTicksAndInfo-section">
        <FiveTicks />
        <StockInfo />
      </div>
      <div className="blocks newOrderAndOrderHistory-section">
        <NewOrder setSentOrder={setSentOrder} />
        <OrderHistory orders={orders} setUpdateOrder={setUpdateOrder} />
      </div>
    </div>
  )
}

export default Home

import CandleStick from './components/CandleStick'
import FiveTicks from './components/FiveTicks'
import StockInfo from './components/StockInfo'
import NewOrder from './components/NewOrder'
import OrderHistory from './components/OrderHistory'
import Socket from '../../global/Socket'
import { useState, useEffect } from "react"

import './base.css'
import './flex.css'

const Home = () => {

  const [newOrderToHistory, setNewOrderToHistory] = useState([])
  const [editingShow, setEditingShow] = useState(false);

  return <div>
    <CandleStick />
    <div className='blocks fiveTicksAndInfo-section'>
      <FiveTicks />
      <StockInfo />
    </div>
    <div className='blocks newOrderAndOrderHistory-section'>
      <NewOrder setNewOrderToHistory={setNewOrderToHistory} />
      <OrderHistory newOrderToHistory={newOrderToHistory} />
    </div>
  </div >
}

export default Home
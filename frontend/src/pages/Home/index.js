import CandleStick from './components/CandleStick'
import FiveTicks from './components/FiveTicks'
import StockInfo from './components/StockInfo'
import NewOrder from './components/NewOrder'
import OrderHistory from './components/OrderHistory'
import Socket from '../../global/Socket'

import './base.css'
import './flex.css'

const Home = () => {
  return <div>
    <CandleStick />
    <div className='blocks fiveTicksAndInfo-section'>
      <FiveTicks />
      <StockInfo />
    </div>
    <div className='blocks newOrderAndOrderHistory-section'>
      <NewOrder />
      <OrderHistory />
    </div>
  </div >
}

export default Home
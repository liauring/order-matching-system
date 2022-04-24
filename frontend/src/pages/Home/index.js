import CandleStick from './components/CandleStick'
import FiveTicks from './components/FiveTicks'
import Sheets from './components/Sheets'
import Socket from '../../global/Socket'

import './base.css'
import './flex.css'

const Home = () => {
  return <div>
    <CandleStick />
    <div className='fiveTicksAndSheets-section'>
      <FiveTicks />
      <Sheets />
    </div>
  </div>
}

export default Home
import BuyerTick from './BuyerTick'
import SellerTick from './SellerTick'
import { useState } from "react"
import { Socket } from '../../../global/Socket'

const FiveTicks = () => {


  const [ticksInfo, setTicksInfo] = useState({
    buyer: [],
    seller: []
  })

  Socket.on('fiveTicks', function (fiveTicks) {
    console.log('fiveTicks', fiveTicks)
    setTicksInfo(fiveTicks)
  });

  return <div id='fiveTicks'>
    <div className='buyerFiveTicks'>
      <thead>
        <tr>
          <th>委買量</th>
          <th>買量bar</th>
          <th>買價</th>
        </tr>
      </thead>
      <tbody>
        {
          ticksInfo.buyer.map(tick => <BuyerTick size={tick.size} price={tick.price} />)
        }
      </tbody>
    </div >
    <div className='sellerFiveTicks'>
      <thead>
        <tr>
          <th>賣價</th>
          <th>賣量bar</th>
          <th>委賣量</th>

        </tr>
      </thead>
      <tbody>
        {
          ticksInfo.seller.map(tick => <SellerTick size={tick.size} price={tick.price} />)
        }
      </tbody>
    </div>


  </div >
}

export default FiveTicks
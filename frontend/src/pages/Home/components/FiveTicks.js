import BuyerTick from './BuyerTick'
import SellerTick from './SellerTick'
import { useState } from "react"
import { Socket } from '../../../global/Socket'
// const fiveTicksInfo = {
//   buyer: [{ size: 10, price: 90 }, { size: 20, price: 100 }, { size: 10, price: 110 }],
//   seller: [{ size: 10, price: 90 }, { size: 20, price: 100 }, { size: 10, price: 110 }]
// }
// const socket = Socket.Socket

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
    <thead>
      <tr>
        <th>委買量</th>
        <th>買量bar</th>
        <th>買價</th>

      </tr>
    </thead>
    {
      ticksInfo.buyer.map(tick => <BuyerTick size={tick.size} price={tick.price} />)
    }

    {/* <SellerTick /> */}

  </div>
}

export default FiveTicks
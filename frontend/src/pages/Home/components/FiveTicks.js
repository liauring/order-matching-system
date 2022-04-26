import BuyerTick from './BuyerTick'
import SellerTick from './SellerTick'
import { useEffect, useState } from "react"
import { Socket } from '../../../global/Socket'

const FiveTicks = () => {

  // const [time, setTime] = useState(new Date())
  const [ticksInfo, setTicksInfo] = useState({
    buyer: [],
    seller: []
  })



  useEffect(() => {
    if (Socket) {

      Socket.on('fiveTicks', function (fiveTicks) {
        // await fiveTicks.buyer.reverse();
        let maxSize = fiveTicks.buyer.reduce((acc, cur) => {
          if (cur.size > acc) {
            return cur.size;
          }
          return acc;
        }, 0);
        maxSize = fiveTicks.seller.reduce((acc, cur) => {
          if (cur.size > acc) {
            return cur.size;
          }
          return acc;
        }, maxSize);
        fiveTicks.buyer.forEach(item => {
          item.percent = item.size * 100 / maxSize;
        })
        fiveTicks.seller.forEach(item => {
          item.percent = item.size * 100 / maxSize;
        })
        console.log({ ...fiveTicks.buyer });
        console.log({ ...fiveTicks.seller });
        if (fiveTicks.buyer.length < 5) {
          let addLength = 5 - fiveTicks.buyer.length;
          for (let i = 1; i <= addLength; i++) {
            fiveTicks.buyer.push({});
          }
        }
        if (fiveTicks.seller.length < 5) {
          let addLength = 5 - fiveTicks.seller.length;
          for (let i = 1; i <= addLength; i++) {
            fiveTicks.seller.push({});
          }
        }

        console.log({ ...fiveTicks.seller });
        console.log('fiveTicks', fiveTicks)
        setTicksInfo(fiveTicks)
      });
    }
  }, [Socket])


  return <div id='fiveTicks'>
    <div className='fiveTicksSizeBar'>
      <div className='fiveTicksSizeBarPercent'></div>
    </div>
    <table className='buyerFiveTicks ticks'>
      <thead>
        <tr>
          <th>委買量</th>
          <th></th>
          <th>買價</th>
        </tr>
      </thead>
      <tbody>
        {
          ticksInfo.buyer.map(tick => <BuyerTick size={tick.size} price={tick.price} percent={tick.percent} />)
        }
      </tbody>
    </table >
    <table className='sellerFiveTicks ticks'>
      <thead>
        <tr>
          <th>賣價</th>
          <th></th>
          <th>委賣量</th>

        </tr>
      </thead>
      <tbody>
        {
          ticksInfo.seller.map(tick => <SellerTick size={tick.size} price={tick.price} percent={tick.percent} />)
        }
      </tbody>
    </table>


  </div >
}

export default FiveTicks
/* eslint-disable no-unused-expressions */
import BuyerTick from './BuyerTick'
import SellerTick from './SellerTick'
import { useEffect, useState } from "react"
import { useStatus } from '../../../global/useStatus'
import axios from "axios"
import { API_POST_FIVETICKS } from "../../../global/Constants"

const FiveTicks = () => {
  const { socket } = useStatus()

  // const [time, setTime] = useState(new Date())
  const [ticksInfo, setTicksInfo] = useState({
    buyer: [],
    seller: []
  })

  function formatFiveTicksArray(dealer) {

    if (dealer.length < 5) {
      let addLength = 5 - dealer.length;
      for (let i = 1; i <= addLength; i++) {
        dealer.push({});
      }
    }
    return dealer
  }

  useEffect(() => {
    if (socket) {

      socket.on('fiveTicks', function (fiveTicks) {
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
        // console.log('fiveTicksBuyer', { ...fiveTicks.buyer });
        // console.log('fiveTicksSeller', { ...fiveTicks.seller });

        fiveTicks.buyer = (formatFiveTicksArray(fiveTicks.buyer))
        fiveTicks.seller = (formatFiveTicksArray(fiveTicks.seller))

        // if (fiveTicks.buyer.length < 5) {
        //   let addLength = 5 - fiveTicks.buyer.length;
        //   for (let i = 1; i <= addLength; i++) {
        //     fiveTicks.buyer.push({});
        //   }
        // }
        // if (fiveTicks.seller.length < 5) {
        //   let addLength = 5 - fiveTicks.seller.length;
        //   for (let i = 1; i <= addLength; i++) {
        //     fiveTicks.seller.push({});
        //   }
        // }

        // console.log({ ...fiveTicks.seller });
        // console.log('fiveTicks', fiveTicks)
        setTicksInfo(fiveTicks)
      });
    }
  }, [socket])

  useEffect(() => {
    console.log('testing');
    const getInitialFiveTicks = async function () {
      let initialFiveTicks = await axios.get(`${API_POST_FIVETICKS}/2330`)


      let responseFiveTicks = {}

      responseFiveTicks.buyer = formatFiveTicksArray(initialFiveTicks.data.buyer)
      responseFiveTicks.seller = formatFiveTicksArray(initialFiveTicks.data.seller)
      console.log('getInitialFiveTicks: ', responseFiveTicks)
      setTicksInfo(responseFiveTicks)
    }
    getInitialFiveTicks()
  }, [])


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
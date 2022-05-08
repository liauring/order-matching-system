import { useState, useEffect, useRef } from 'react'
import { API_NEWORDER, BROKERID } from '../../../global/Constants'
import axios from 'axios'
import { useStatus } from '../../../global/useStatus'

const NewOrder = ({ setSentOrder }) => {
  const { clientID } = useStatus()

  const [price, setPrice] = useState(null)
  const incrementPrice = () => {
    setPrice(function (prev) {
      return (prev ?? 0) + 1
    })
  }
  const decrementPrice = () => {
    setPrice(function (prev) {
      return prev > 0 ? prev - 1 : 0
    })
  }

  const [quantity, setQuantity] = useState(null)
  const incrementQuantity = () => {
    setQuantity(function (prev) {
      return (prev ?? 0) + 1
    })
  }

  const decrementQuantity = () => {
    setQuantity(function (prev) {
      return prev > 0 ? prev - 1 : 0
    })
  }

  const sendOrder = async (dealer) => {
    let type
    if (dealer === '買進') {
      type = 'buyer'
    } else if (dealer === '賣出') {
      type = 'seller'
    } else {
      window.alert('請點選 [買進] 或 [賣出]')
      return
    }

    if (!price || !quantity) {
      console.log('if price and quantity')
      window.alert('請填寫價格與數量')
      return
    }
    let newPrice = Number(price)
    let newQuantity = Number(quantity)

    if (newPrice <= 0 || newQuantity <= 0) {
      console.log('if price and quantity')
      window.alert('價格與數量不可為負數')
      return
    }

    let reqBody = {
      account: clientID,
      broker: BROKERID,
      symbol: '2330', //後端會改int
      BS: type,
      orderType: 'limit',
      duration: 'ROD',
      price: price,
      quantity: quantity,
      brokerName: '土銀',
      symbolName: '台積電',
    }
    console.log(reqBody)
    let response = await axios.post(`${API_NEWORDER}`, reqBody)
    setSentOrder(response.data)
  }

  return (
    <div id="newOrder-section">
      <div className="stockDetail">
        <div className="stockInfo">
          <div className="stockName">台積電</div>
          <div className="stockID">2330</div>
          <div className="clientID">{clientID}</div>
        </div>
        <div className="stockPriceInfo">
          <div className="stockCurrentPrice"></div>
        </div>
      </div>
      <div className="newOrder">
        <div className="orderTypeAndDuration-section">
          <div className="orderType">
            <button className="orderType-limit button-selected">限價</button>
            <button className="orderType-market button-unselected" disabled={true}>
              市價
            </button>
          </div>
          <div className="duration">
            <button className="duration-ROC button-selected">ROC</button>
            <button className="duration-IOC button-unselected" disabled={true}>
              IOC
            </button>
            <button className="duration-FOK button-unselected" disabled={true}>
              FOK
            </button>
          </div>
        </div>
        <div className="priceAndQuantity-section">
          <div className="price-section">
            <button className="inAndDe decrement" type="button" onClick={decrementPrice}>
              -
            </button>

            <input
              className="price"
              placeholder="價格"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value)
              }}
            />
            <button className="inAndDe increment" type="button" onClick={incrementPrice}>
              +
            </button>
          </div>
          <div className="quantity-section">
            <button className="inAndDe decrement" type="button" onClick={decrementQuantity}>
              -
            </button>
            <input
              className="quantity"
              placeholder="數量"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value)
              }}
            />
            <button className="inAndDe increment" type="button" onClick={incrementQuantity}>
              +
            </button>
          </div>
        </div>
        <div className="newOrderbuttons">
          <button
            className="orderButtons buyOrder"
            type="submit"
            onClick={(buy) => {
              sendOrder(buy.target.innerText)
            }}
          >
            買進
          </button>
          <button
            className="orderButtons sellOrder"
            type="submit"
            onClick={(sell) => {
              sendOrder(sell.target.innerText)
            }}
          >
            賣出
          </button>
        </div>
      </div>
    </div>
  )
}
export default NewOrder

import { useState, useEffect } from "react"
// import { API_POST_ORDER } from "../../../global/Constants"
// import axios from "axios"

const NewOrder = () => {
  const [price, setPrice] = useState(null)
  const incrementPrice = () => {
    setPrice(function (prev) {
      console.log(prev)
      if (prev === null) {
        return prev = 1
      }
      return prev + 1
    })
  }
  const decrementPrice = () => {
    setPrice(function (prev) {
      if (prev === null || prev === 0) {
        return prev = 0
      }
      return prev - 1
    })
  }



  const [quantity, setQuantity] = useState(null)
  const incrementQuantity = () => {
    setQuantity(function (prev) {
      if (prev === null) {
        return prev = 1
      }
      return prev + 1
    })
  }

  const decrementQuantity = () => {
    setQuantity(function (prev) {
      if (prev === null || prev === 0) {
        return prev = 0
      }
      return prev - 1
    })
  }

  // const sendOrder = () => {
  //   let newOrderResponse = axios.post(`${API_POST_ORDER}`)
  // }


  return <div id="newOrder-section">
    <div className="stockDetail">
      <div className="stockInfo">
        <div className="stockName">台積電</div>
        <div className="stockID">2330</div>
      </div>
      <div className="stockPriceInfo">
        <div className="stockCurrentPrice"></div>
      </div>
    </div>
    <div className="newOrder">
      <div className="orderTypeAndDuration-section">
        <div className="orderType">
          <button className="orderType-limit button-selected">限價</button>
          <button className="orderType-market button-unselected" disabled={true}>市價</button>
        </div>
        <div className="duration">
          <button className="duration-ROC button-selected">ROC</button>
          <button className="duration-IOC button-unselected" disabled={true}>IOC</button>
          <button className="duration-FOK button-unselected" disabled={true}>FOK</button>
        </div>

      </div>
      <div className="priceAndQuantity-section">

        <div className="price-section">
          <button className="inAndDe decrement" type="button" onClick={decrementPrice}>-</button>

          <input className="price" placeholder="價格" type="number" value={price} onChange={(e) => { setPrice(e.target.value) }} />
          <button className="inAndDe increment" type="button" onClick={incrementPrice}>+</button>
        </div>
        <div className="quantity-section">
          <button className="inAndDe decrement" type="button" onClick={decrementQuantity}>-</button>
          <input className="quantity" placeholder="數量" type="number" value={quantity} onChange={(e) => { setQuantity(e.target.value) }} />
          <button className="inAndDe increment" type="button" onClick={incrementQuantity}>+</button>
        </div>
      </div>
      <div className="newOrderbuttons">
        <button className="orderButtons buyOrder" type="submit">買進</button>
        <button className="orderButtons sellOrder" type="submit">賣出</button>
      </div>

    </div>
  </div>

}
export default NewOrder
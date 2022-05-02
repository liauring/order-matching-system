import { useState, useEffect } from "react"
import { Socket } from '../../../global/Socket'

const EditingWindow = ({ symbol, price, count, updateOrder }) => {
  const [quantity, setQuantity] = useState(null)

  const clickUpdate = () => {
    updateOrder(quantity)
  }

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


  return <div className="editingWindow">
    <div className="editingWindowTitle">
      委託單修改
    </div>
    <div className="editingWindowOrderInfo">
      <a className="editingWindowSymbol">代碼: {symbol}</a>
      <a className="editingWindowPrice">價格: {price}</a>
      <a className="editingWindowQuantity">剩餘數量: {count}</a>
    </div>
    <div className="quantity-section">
      <button className="inAndDe decrement" type="button" onClick={decrementQuantity}>-</button>
      <input className="quantity" placeholder="數量" type="number" value={quantity} onChange={(e) => { setQuantity(e.target.value) }} />
      <button className="inAndDe increment" type="button" onClick={incrementQuantity}>+</button>
    </div>
    <button className="editingWindowButton" onClick={clickUpdate}>送出修改</button>
  </div>
};

export default EditingWindow;
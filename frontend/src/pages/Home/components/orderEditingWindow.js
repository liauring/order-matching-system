import { useState, useEffect } from "react"
import { useStatus } from '../../../global/useStatus'

const EditingWindow = ({ symbol, price, count, remainingQuantity, updateOrder, setSelectedOrder }) => {
  const { socket } = useStatus()

  const [quantity, setQuantity] = useState(null)

  const clickUpdate = () => {
    updateOrder(quantity)
  }



  const clickCancel = () => {
    setSelectedOrder(null)
  }

  const incrementQuantity = () => {
    setQuantity(function (prev) {
      if (prev === null) {
        return prev = 0
      }
      return prev + 1
    })
  }

  const decrementQuantity = () => {
    setQuantity(function (prev) {
      if (prev === null) {
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
      <a className="editingInfoText editingWindowSymbol">代碼：{symbol}</a>
      <a className="editingInfoText editingWindowPrice">價格：{price}</a>
      <a className="editingInfoText editingWindowQuantity">剩餘數量：{remainingQuantity}</a>
    </div>
    <div className="quantity-section editing-quantity-section">
      <button className="inAndDe decrement" type="button" onClick={decrementQuantity}>-</button>
      <input className="quantity editingQuantity" placeholder="數量" type="number" value={quantity} onChange={(e) => { setQuantity(e.target.value) }} />
      <button className="inAndDe increment" type="button" onClick={incrementQuantity}>+</button>
    </div>
    <div className="editingWindowButton-section">
      <button className="editingWindowButton button-unselected editingWindowButtonCancel" onClick={clickCancel}>取消</button>
      <button className="editingWindowButton button-selected editingWindowButtonUpdate" onClick={clickUpdate}>送出修改</button>
    </div>

  </div>
};

export default EditingWindow;
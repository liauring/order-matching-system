import { useState } from 'react'

const EditingWindow = ({ symbol, price, remainingQuantity, updateOrder, setSelectedOrder }) => {
  const [quantity, setQuantity] = useState(null)

  const clickUpdate = () => {
    updateOrder(quantity)
  }

  const clickCancel = () => {
    setSelectedOrder(null)
  }

  const incrementQuantity = () => {
    setQuantity(function (prev) {
      return prev != remainingQuantity ? (prev ?? 0) + 1 : remainingQuantity
    })
  }

  const decrementQuantity = () => {
    setQuantity(function (prev) {
      return prev > 0 ? prev - 1 : 0
    })
  }

  const getEditingButtonClassName = () => {
    let selectStyleKey = quantity == 0 ? 'button-unselected' : 'button-selected'
    return `editingWindowButton ${selectStyleKey} button-selected editingWindowButtonUpdate`
  }

  return (
    <div className="editingWindow">
      <div className="editingWindowTitle">委託單減單</div>
      <div className="editingWindowOrderInfo">
        <a className="editingInfoText editingWindowSymbol">代碼：{symbol}</a>
        <a className="editingInfoText editingWindowPrice">價格：{price}</a>
        <a className="editingInfoText editingWindowQuantity">剩餘數量：{remainingQuantity}</a>
      </div>
      <div className="quantity-section editing-quantity-section">
        <button className="inAndDe decrement" type="button" onClick={decrementQuantity}>
          -
        </button>
        <input
          className="quantity editingQuantity"
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
      <div className="editingWindowButton-section">
        <button className="editingWindowButton button-selected editingWindowButtonCancel" onClick={clickCancel}>
          取消
        </button>
        <button
          disabled={quantity === undefined || quantity === 0}
          className={getEditingButtonClassName()}
          onClick={clickUpdate}
        >
          減單
        </button>
      </div>
    </div>
  )
}

export default EditingWindow

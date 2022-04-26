const NewOrder = () => {
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
          <button className="orderType-market" disabled>市價</button>
        </div>
        <div className="duration">
          <button className="duration-ROC button-selected">ROC</button>
          <button className="duration-IOC" disabled>IOC</button>
          <button className="duration-FOK" disabled>FOK</button>
        </div>

      </div>
      <div className="priceAndQuantity-section">

        <div className="price-section">
          <button className="decrement" type="button">-</button>
          <input className="price" placeholder="價格" type="number" />
          <button className="increment" type="button">+</button>
        </div>
        <div className="quantity-section">
          <button className="decrement" type="button">-</button>
          <input className="quantity" placeholder="數量" type="number" />
          <button className="increment" type="button">+</button>
        </div>
      </div>
      <div className="newOrderbuttons">
        <button className="buyOrder">買進</button>
        <button className="sellOrder">賣出</button>
      </div>

    </div>
  </div>
}

export default NewOrder
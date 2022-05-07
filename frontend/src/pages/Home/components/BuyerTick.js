/* eslint-disable react/style-prop-object */
const BuyerTick = ({ size, price, percent }) => {
  return (
    <tr>
      <td className="buyerTickSize">{size}</td>
      <td className="buyerTickBar">
        <div className="buyerBar tickBar">
          <div className="buyerPercentBar" style={{ width: percent || 0 + '%' }}></div>
        </div>
      </td>
      <td className="buyerTickPrice">{price}</td>
    </tr>
  )
}

export default BuyerTick

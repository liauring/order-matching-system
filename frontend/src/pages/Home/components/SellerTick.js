/* eslint-disable react/style-prop-object */
const SellerTick = ({ size, price, percent }) => {
  return (
    <tr>
      <td className="sellerTickPrice">{price}</td>
      <td className="sellerTickBar">
        <div className="sellerBar tickBar">
          <div className="sellerPercentBar" style={{ width: percent || 0 + '%' }}></div>
        </div>
      </td>
      <td className="sellerTickSize">{size}</td>
    </tr>
  )
}

export default SellerTick

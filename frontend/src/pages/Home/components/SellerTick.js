const SellerTick = ({ size, price }) => {
  return <tr>
    <td class="sellerTickPrice">{price}</td>
    <td class="sellerTickBar"></td>
    <td class="sellerTickSize">{size}</td>

  </tr>

}

export default SellerTick
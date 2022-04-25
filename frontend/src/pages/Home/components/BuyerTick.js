const BuyerTick = ({ size, price }) => {
  return <tr>
    <td class="buyerTickSize">{size}</td>
    <td class="buyerTickBar"></td>
    <td class="buyerTickPrice">{price}</td>

  </tr>

}

export default BuyerTick
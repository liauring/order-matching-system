const OrderHistory = () => {
  return <div id="orderHistory-section">
    <table className='orderHistory'>
      <thead>
        <tr>
          <th>狀態</th>
          <th>數量</th>
          <th>價格</th>
          <th>成交數</th>
          <th>委託時間</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>委託成功</td>
          <td>10</td>
          <td>540</td>
          <td>0</td>
          <td>2021/4/27 10:18</td>
        </tr>
      </tbody>
    </table >

  </div>
}

export default OrderHistory
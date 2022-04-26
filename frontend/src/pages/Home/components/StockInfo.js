const StockInfo = () => {
  return <div id='stockInfo-section'>
    <table className='stockInfo-leftBlock'>

      <tbody>
        <tr>
          <td>成交</td>
          <td className="downs">546</td>
        </tr>
        <tr>
          <td>開盤</td>
          <td className="ups">550</td>
        </tr>
        <tr>
          <td>最高</td>
          <td className="ups">551</td>
        </tr>
        <tr>
          <td>最低</td>
          <td className="downs">544</td>
        </tr>
        <tr>
          <td>均價</td>
          <td className="highlight">547</td>
        </tr>
        <tr>
          <td>成交值(億)</td>
          <td className="highlight">195.36</td>
        </tr>
      </tbody>
    </table >
    <table className='stockInfo-rightBlock'>

      <tbody>
        <tr>
          <td>昨收</td>
          <td className="highlight">547</td>
        </tr>
        <tr>
          <td>漲跌幅</td>
          <td className="downs">▼ 0.18%</td>
        </tr>
        <tr>
          <td>漲跌</td>
          <td className="downs">▼ 1</td>
        </tr>
        <tr>
          <td>總量</td>
          <td className="highlight">35,723</td>
        </tr>
        <tr>
          <td>昨量</td>
          <td className="highlight">43,215</td>
        </tr>
        <tr>
          <td>振幅</td>
          <td className="highlight">1.28%</td>
        </tr>
      </tbody>
    </table >
  </div >
}

export default StockInfo
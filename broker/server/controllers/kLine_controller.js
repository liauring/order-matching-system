const axios = require('axios').default

const getkLineHistory = async (req, res) => {
  let { symbol } = req.params
  let { time } = req.query
  symbol = parseInt(symbol)
  time = parseInt(time)
  let url = `${process.env.apiHost}/api/kLine/${symbol}?time=${time}`
  let response = await axios.get(url)
  res.status(200).json(response.data)
}

// let kLineInfo = {
//   symbol: order.symbol,
//   price: bestSeller.price,
//   executionTime: executionTime,
// }

module.exports = { getkLineHistory }

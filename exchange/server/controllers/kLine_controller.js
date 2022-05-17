let { mongodbGetExecutionHistory } = require('../models/kLine_model')

const getkLineHistory = async (req, res) => {
  let { symbol } = req.params
  let { time } = req.query
  symbol = parseInt(symbol)
  time = parseInt(time)
  const executionResult = await mongodbGetExecutionHistory(symbol, time)
  res.status(200).json(executionResult)
}

// let kLineInfo = {
//   symbol: order.symbol,
//   price: bestSeller.price,
//   executionTime: executionTime,
// }

module.exports = { getkLineHistory }

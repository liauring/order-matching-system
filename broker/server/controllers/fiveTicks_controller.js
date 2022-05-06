const axios = require('axios')

const getFiveTicks = async (req, res) => {
  let { symbol } = req.params
  let initialFiveTicks = await axios.get(`${process.env.apiHost}/api/fiveTicks/${symbol}`)
  res.status(200).json(initialFiveTicks.data)
}

module.exports = { getFiveTicks }

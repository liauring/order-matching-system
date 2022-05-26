const { CurrentFiveTicks } = require('../../core/FiveTicks')

const getFiveTicks = async (req, res) => {
  let { symbol } = req.params
  let fiveTicks = await new CurrentFiveTicks(parseInt(symbol)).getFiveTicks()
  return res.status(200).json(fiveTicks)
}

module.exports = { getFiveTicks }

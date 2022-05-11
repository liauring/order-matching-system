const router = require('express').Router()
const { wrapAsync } = require('../../util/util')
const { getkLineHistory } = require('../controllers/kLine_controller')

router.route('/kLine/:symbol').get(wrapAsync(getkLineHistory))

module.exports = router

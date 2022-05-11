const router = require('express').Router()
const { wrapAsync, saveLogs } = require('../../util/util')
const { updateOrder } = require('../controllers/order_controller')

router.route('/order').patch(saveLogs('logsOfUpdateOrderExchange'), wrapAsync(updateOrder))

module.exports = router

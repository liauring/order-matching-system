const router = require('express').Router()
const { wrapAsync, saveLogs } = require('../../util/util')

const { getNewOrderID, postNewOrder } = require('../controllers/newOrder_controller')

router.route('/newOrder/orderID').post(wrapAsync(getNewOrderID))
router.route('/newOrder').post(saveLogs('logsOfNewOrder'), wrapAsync(postNewOrder))

module.exports = router

const router = require('express').Router()
const { wrapAsync, saveLogs } = require('../../util/util')

const { getNewOrderID, postNewOrder, postNewOrderStressTest } = require('../controllers/newOrder_controller')

router.route('/newOrder/orderID').post(wrapAsync(getNewOrderID))
router.route('/newOrder').post(saveLogs('logsOfNewOrder'), wrapAsync(postNewOrder))
router.route('/newOrder/stressTest').post(wrapAsync(postNewOrderStressTest))

module.exports = router

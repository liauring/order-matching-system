const router = require('express').Router()
const { wrapAsync, saveLogs } = require('../../util/util')

const { postNewOrder } = require('../controllers/newOrder_controller')

router.route('/newOrder').post(saveLogs('logsOfNewOrder-broker'), wrapAsync(postNewOrder))

module.exports = router

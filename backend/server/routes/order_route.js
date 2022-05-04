const router = require('express').Router();
const { wrapAsync, saveLogs } = require('../../util/util');
const { getOrder, updateOrder } = require('../controllers/order_controller');


router.route('/order').post(wrapAsync(getOrder));
router.route('/order').patch(saveLogs('logsOfUpdateOrder'), wrapAsync(updateOrder));

module.exports = router;
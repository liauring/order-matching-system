const router = require('express').Router();
const { wrapAsync } = require('../../util/util');
const { getFiveTicks } = require('../controllers/fiveTicks_controller');


router.route('/fiveTicks/:symbol').get(wrapAsync(getFiveTicks));

module.exports = router;
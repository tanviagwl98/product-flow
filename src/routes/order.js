const router = require('express').Router();
const controller = require('../controllers/order.js');

router.get('/:id', controller.get);

module.exports = router;

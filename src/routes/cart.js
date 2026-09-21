const router = require('express').Router()

const controller = require('../controllers/cart')

router.post('/', controller.create)
router.get('/:id', controller.get)

module.exports = router
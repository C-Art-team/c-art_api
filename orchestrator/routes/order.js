const router = require('express').Router()
const ControllerOrder = require('../controllers/order')

// hanya bisa dijalankan abis login, jadi udh punya access token
router.get('/', ControllerOrder.getAllOrders)
router.get('/:id', ControllerOrder.getOneOrder)
router.get('/pay/:id', ControllerOrder.generateMidtransToken)
router.post('/', ControllerOrder.createOrder)
router.patch('/:id', ControllerOrder.patchOrderStatus)
router.delete('/:id', ControllerOrder.deleteOrder)


module.exports = router
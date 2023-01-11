const router = require('express').Router()
const ControllerOrder = require('../controllers/order')
const authentication = require('../middlewares/authentication')

router.use(authentication)
router.get('/', ControllerOrder.getAllOrders)
router.get('/pay/:id', ControllerOrder.generateMidtransToken)
router.get('/:id', ControllerOrder.getOneOrder)
router.post('/', ControllerOrder.createOrder)
router.patch('/:id', ControllerOrder.patchOrderStatus)
router.delete('/:id', ControllerOrder.deleteOrder)


module.exports = router
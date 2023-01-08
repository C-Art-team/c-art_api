const router = require('express').Router()
const ControllerOrder = require('../controllers/order')
const authentication = require('../middlewares/authentication')
const { authorizationOrder } = require('../middlewares/authorization')

router.use(authentication)
router.get("/", ControllerOrder.getAllOrders)
router.get("/pay/:id", ControllerOrder.generateMidtransToken)
router.get("/:id", ControllerOrder.getOneOrder)
router.post("/", ControllerOrder.createOrder)

router.patch("/:id", authorizationOrder, ControllerOrder.patchOrderStatus)
router.delete("/:id", authorizationOrder, ControllerOrder.cancelOrder)

module.exports = router
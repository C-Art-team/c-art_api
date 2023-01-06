const router = require('express').Router()
const ControllerOrder = require('../controllers/order')

router.get("/orders", ControllerOrder.getAllOrders)
router.get("/orders/:id", ControllerOrder.getOneOrder)
router.post("/orders", ControllerOrder.createOrder)
router.patch("/orders", ControllerOrder.patchOrderStatus)
router.delete("/orders/:id", ControllerOrder.cancelOrder)

module.exports = router
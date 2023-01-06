const router = require('express').Router()
const ControllerOrder = require('../controllers/order')

router.get("/", ControllerOrder.getAllOrders)
router.get("/:id", ControllerOrder.getOneOrder)
router.post("/", ControllerOrder.createOrder)
router.patch("/:id", ControllerOrder.patchOrderStatus)
router.delete("/:id", ControllerOrder.cancelOrder)

module.exports = router
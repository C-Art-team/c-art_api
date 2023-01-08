const router = require('express').Router()
const categoryRoutes = require('./category')
const userRoutes = require('./user')
const artRoutes = require("./art")
const orderRoutes = require("./order")
const communityRoutes = require("./community")

router.use('/users',userRoutes)
router.use('/categories',categoryRoutes)
router.use("/arts", artRoutes)
router.use('/orders', orderRoutes)
router.use('/communities', communityRoutes)

module.exports = router
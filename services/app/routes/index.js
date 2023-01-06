const router = require('express').Router()
const chatRoutes = require('./chat')
const routerArt = require("./routeArt")
const categoryRoutes = require('./category')
const orderRoutes = require("./order")
const communityRoutes = require('./community')

router.use("/arts", routerArt)
router.use('/chats', chatRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/communities', communityRoutes)

module.exports = router
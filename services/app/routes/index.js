const router = require('express').Router()
const chatRoutes = require('./chat')
const routerArt = require("./routeArt")
const categoryRoutes = require('./category')

router.use("/arts", routerArt)
router.use('/chats',chatRoutes)
router.use('/categories',categoryRoutes)

module.exports = router
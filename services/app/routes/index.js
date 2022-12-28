const router = require('express').Router()
const chatRoutes = require('./chat')

router.use('/chats',chatRoutes)

module.exports = router
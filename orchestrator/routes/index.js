const router = require('express').Router()
const categoryRoutes = require('./category')
const userRoutes = require('./user')
const artRoutes = require("./art")

router.use('/users',userRoutes)
router.use('/categories',categoryRoutes)
router.use("/arts", artRoutes)

module.exports = router
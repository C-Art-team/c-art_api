const router = require('express').Router()
const categoryRoutes = require('./category')
const userRoutes = require('./user')

router.use('/users',userRoutes)
router.use('/categories',categoryRoutes)

module.exports = router
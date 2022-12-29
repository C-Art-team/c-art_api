const router = require('express').Router()
const categoryRoutes = require('./category')

router.use('/categories',categoryRoutes)

module.exports = router
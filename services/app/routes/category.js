const router = require('express').Router()
const ControllerCategory = require('../controllers/category')

router.get('/',ControllerCategory.getAll)

module.exports = router
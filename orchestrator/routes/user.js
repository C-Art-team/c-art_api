const router = require('express').Router()
const ControllerUser = require('../controllers/user')
const authentication = require('../middlewares/authentication')

router.post("/register", ControllerUser.register)
router.post("/login", ControllerUser.login)
router.use(authentication)

router.patch("/edit/:id", ControllerUser.editProfile)

module.exports = router
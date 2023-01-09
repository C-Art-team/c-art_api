const router = require('express').Router()
const ControllerUser = require('../controllers/user')
const authentication = require('../middlewares/authentication')

router.post("/register", ControllerUser.register)
router.post("/login", ControllerUser.login)
router.post("/facebookLogin", ControllerUser.facebookLogin);
router.post("/googleLogin", ControllerUser.googleLogin);

router.patch("/edit/:id", ControllerUser.editProfile)

router.use(authentication)

router.get("/profile", ControllerUser.userProfile)

router.delete("/delete/:id", ControllerUser.deleteAccount)

module.exports = router
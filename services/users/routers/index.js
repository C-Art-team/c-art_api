const router = require("express").Router();
const Controller = require("../controllers/");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.post("/facebookLogin", Controller.facebookLogin);
router.post("/googleLogin", Controller.googleLogin);

router.patch("/edit/:id", Controller.editProfile);

router.get("/authenticating", Controller.authenticating);

router.use(authentication);

router.get("/profile", Controller.userProfile)

router.delete("/delete/:id", authorization, Controller.deleteAccount);

module.exports = router;

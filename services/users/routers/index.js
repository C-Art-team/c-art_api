const router = require("express").Router();
const Controller = require("../controllers/");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.get("/authenticating", Controller.authenticating);

router.use(authentication);

router.patch("/edit/:id", authorization, Controller.editProfile);

module.exports = router;

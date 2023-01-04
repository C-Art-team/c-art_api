const router = require("express").Router();
const Controller = require("../controllers/");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.get("/authentication", Controller.authentication);

module.exports = router;

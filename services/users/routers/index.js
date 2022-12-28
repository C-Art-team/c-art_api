const router = require("express").Router();
const Controller = require("../controllers/");

router.post("/register", Controller.register);

module.exports = router;

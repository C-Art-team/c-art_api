const express = require("express")
const router = express.Router()

const routerArt = require("./routeArt")

router.use("/arts", routerArt)

module.exports = router
const express = require("express")
const ControllerArt = require("../controllers/art")
const router = express.Router()


router.get("/", ControllerArt.getArts)
router.get("/:id", ControllerArt.getArtDetail)
router.post("/", ControllerArt.addItem)

module.exports = router
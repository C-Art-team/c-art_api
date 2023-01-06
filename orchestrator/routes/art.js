const express = require("express")
const ControllerArt = require("../controllers/art")
const router = express.Router()
const multer = require("multer")

const upload = multer({
    storage:multer.memoryStorage()
})

router.get("/", ControllerArt.getArts)
router.get("/:id", ControllerArt.getArtDetail)
router.post("/",upload.array("uploadedFile", 4), ControllerArt.addItem)

module.exports = router
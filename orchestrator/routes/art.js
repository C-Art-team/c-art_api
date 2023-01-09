const express = require("express")
const ControllerArt = require("../controllers/art")
const router = express.Router()
const multer = require("multer")
const authentication = require('../middlewares/authentication')

const upload = multer({
    storage: multer.memoryStorage()
})

router.get("/myarts/",authentication, ControllerArt.getMyArt)

router.get("/", ControllerArt.getArts)
router.get("/:id", ControllerArt.getArtDetail)

router.use(authentication)

router.post("/", upload.array("uploadedFile", 4), ControllerArt.addItem)
router.patch('/:id', ControllerArt.patchArtPrice)
router.delete('/:id', ControllerArt.deleteArt)
router.post('/:id', ControllerArt.restoreArt)

module.exports = router
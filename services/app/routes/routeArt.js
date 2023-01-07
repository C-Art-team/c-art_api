const express = require("express")
const ControllerArt = require("../controllers/controllerArt")
const router = express.Router()
const fileUpload = require("../middlewares/multer");
const { authorization, checkArtStatusInactive, checkArtStatusActive } = require('../middlewares/authorization');


router.post("/", fileUpload.array("uploadedFile", 4), ControllerArt.createArt)
router.get("/", ControllerArt.getArts)
router.get("/:id", ControllerArt.getOneArt)
// router.get("/download/:id",ControllerArt.download)
router.delete("/:id", authorization, checkArtStatusInactive, ControllerArt.deleteArt)
router.post("/:id", authorization, checkArtStatusActive, ControllerArt.restoreArtStatus)
router.patch("/:id", authorization, ControllerArt.updateArt)

module.exports = router
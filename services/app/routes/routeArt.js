const express = require("express")
const ControllerArt = require("../controllers/controllerArt")
const router = express.Router()
const fileUpload = require("../middlewares/multer");
const { authorization, authorizationPrice } = require('../middlewares/authorization');
const authentication = require('../middlewares/authentication')
const multer = require("multer")



router.get("/myarts", authentication,ControllerArt.getMyArt )
router.get("/", ControllerArt.getArts)
router.get("/:id", ControllerArt.getOneArt)
router.use(authentication)
router.post("/",fileUpload.array("uploadedFile", 4), ControllerArt.createArt)
// router.get("/download/:id",ControllerArt.download)
router.delete("/:id", authorization, ControllerArt.deleteArt)
router.post("/:id", authorization, ControllerArt.restoreArtStatus)
router.patch("/:id", authorization, authorizationPrice, ControllerArt.updateArt)

module.exports = router
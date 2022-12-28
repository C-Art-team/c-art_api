const express = require("express")
const ControllerArt = require("../controllers/controllerArt")
const router = express.Router()
const errorHandler = require("../middlewares/errorhandler");
const fileUpload = require("../middlewares/multer");




router.post("/", fileUpload.array("uploadedFile",4), ControllerArt.createArt)
router.get("/", ControllerArt.getArts)
router.get("/:id", ControllerArt.getOneArt)

router.use(errorHandler)
module.exports = router
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer")
const cloudinary = require("../config/cloudinary")
const path = require("path");

//BELOW COMMENTED CODE IS FOR SAVING THE UPLOADED FILE INTO LOCAL FILES (BEFORE USING CLOUDINARY)
// const storage = multer.diskStorage({
//     destination:"storageMulter", 
//     filename: (req, file, cb) =>{
//         cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//     }
// })

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "c-art",
        use_filename:true,
        resource_type:"auto",
    },
});

const fileUpload = multer({
    storage: storage,
})

module.exports = fileUpload
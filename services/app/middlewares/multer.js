const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer")
const cloudinary = require("../config/cloudinary")
const path = require("path");
const FirebaseStorage = require("multer-firebase-storage")
const credential = require("../storage-c-art-firebase-adminsdk-x24tg-0f87dc2fe4.json")

//BELOW COMMENTED CODE IS FOR SAVING THE UPLOADED FILE INTO LOCAL FILES (BEFORE USING CLOUDINARY)
// const storage = multer.diskStorage({
//     destination:"storageMulter", 
//     filename: (req, file, cb) =>{
//         cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//     }
// })

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "c-art",
//         use_filename:true,
//         resource_type:"auto",
//     },
// });

const fileUpload = multer({
    storage: FirebaseStorage({
        bucketName:"gs://storage-c-art.appspot.com/",
        credentials: {
            clientEmail: credential.client_email,
            privateKey: credential.private_key,
            projectId:credential.project_id
        },
        unique:true,
        directoryPath:"c-art",
        public:true
    }),
})




module.exports = fileUpload
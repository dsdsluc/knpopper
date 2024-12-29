const express = require('express');
const multer  = require('multer');
const router = express.Router();

const uploadMiddleware = require("../../middlewares/admin/upLoadCloud.middleware");
// For handling file uploads
const upload = multer(); 


const controller = require("../../controllers/admin/setting.controller");


router.get('/general', controller.getSettingsGeneral); 

router.post(
    '/general',
    upload.single('site_logo'), 
    uploadMiddleware, 
    controller.update 
);

module.exports = router;

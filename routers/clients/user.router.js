const express = require('express');
const router = express.Router();
const multer  = require('multer')
const controller = require("../../controllers/client/user.controller");
const uploadMiddleware = require("../../middlewares/admin/upLoadCloud.middleware");

// For handling file uploads
const upload = multer(); 

router.get('/', controller.index);

router.post('/update-profile',upload.single('avatar'),uploadMiddleware, controller.updateProfile);

router.post('/support-tickets', controller.supportTicketPost);



module.exports = router
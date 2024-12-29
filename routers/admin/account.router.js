const express = require('express');
const router = express.Router();
const multer  = require('multer');
const controller = require("../../controllers/admin/account.controller");

const uploadCloudary = require("../../middlewares/admin/upLoadCloud.middleware");
// For handling file uploads
const upload = multer(); 

router.get('/list',  controller.index);

router.get('/create',  controller.create);

router.post('/create',upload.single("avatar"),uploadCloudary, controller.createPost);

router.get('/edit/:id',  controller.edit)

router.patch('/edit/:id',upload.single("avatar") ,uploadCloudary, controller.editPatch)


module.exports = router
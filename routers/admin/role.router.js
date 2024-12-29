const express = require('express');
const router = express.Router();
const multer  = require('multer');

const uploadCloudanary = require("../../middlewares/admin/upLoadCloud.middleware");
// For handling file uploads
const upload = multer(); 

const controller = require("../../controllers/admin/role.controller");

router.get('/list', controller.index);

router.get('/create', controller.create);

router.post('/create',upload.single("thumbnail"), uploadCloudanary,controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',upload.single("thumbnail"),uploadCloudanary, controller.editPatch);

router.patch('/permissions', controller.permissionPatch);




module.exports = router
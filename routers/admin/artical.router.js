const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/artical.controller"); 

const uploadMiddleware = require("../../middlewares/admin/upLoadCloud.middleware");
// For handling file uploads 
const multer  = require('multer');
const upload = multer(); 

router.get('/list', controller.index);

router.get('/create', controller.create);

router.post('/create',upload.single('thumbnail'), uploadMiddleware,controller.createPost);

router.get('/detail/:id', controller.detail);

router.delete('/delete/:id', controller.delete);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('thumbnail'),uploadMiddleware,controller.editPatch);

// router.post('/change-status/:id', controller.changeStatus);


module.exports = router
const express = require('express');
const multer  = require('multer');
const router = express.Router();

const uploadMiddleware = require("../../middlewares/admin/upLoadCloud.middleware");
// For handling file uploads
const upload = multer(); 

const controller = require("../../controllers/admin/product.controller");


router.get('/list', controller.index);


router.get('/create', controller.create);

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',upload.array('thumbnail', 12),uploadMiddleware, controller.editPatch);

router.post('/create', upload.array('thumbnail', 12),uploadMiddleware, controller.createPost);

router.post('/change-status/:id', controller.changeStatus);

router.post('/change-isFeature/:id', controller.changeIsFeature);

router.delete('/delete/:id', controller.delete);

router.patch('/change-multi-status', controller.changeMultiStatus);


module.exports = router
const express = require('express');
const router = express.Router();
const multer  = require('multer')
const controller = require("../../controllers/admin/category.controller"); 

const multerStorageHelper = require("../../helpers/multerStorage");
const storage = multerStorageHelper();  
// For handling file uploads
const upload = multer({ storage: storage });

router.get('/list', controller.index);

router.get('/create', controller.create);

router.post('/create',upload.single('thumbnail'), controller.createPost);

router.get('/detail/:id', controller.detail);

router.post('/change-status/:id', controller.changeStatus);







module.exports = router
const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/admin/configMulter.middleware'); // Multer middleware
const uploadMiddleware = require('../../middlewares/admin/uploadHomePageMiddleware'); // Cloudinary upload middleware
const controller = require('../../controllers/admin/page.controller');


router.get('/home', controller.homePage);

router.post(
    '/home-update',
    upload,
    uploadMiddleware,
    controller.updateHomePage
  );

module.exports = router
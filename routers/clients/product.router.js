const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/product.controller");
const requireAuthMiddelware = require("../../middlewares/client/auth.middleware");

router.get('/', controller.index);

router.post('/', controller.index); 

router.get('/detail/:slug', controller.detail);

router.get('/category/:slug', controller.category);

router.patch('/wishlist',requireAuthMiddelware.requireAuth, controller.wishlistPatch);




module.exports = router
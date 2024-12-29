const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");

router.get('/', controller.index);

router.post('/add/:id', controller.addPost);

router.patch('/update', controller.updatePatch);

router.get('/checkout', controller.checkout);

router.post('/checkout',userMiddleware.requireLogin, controller.checkoutPost);

router.get('/ordered',userMiddleware.requireLogin, controller.ordered);

router.delete('/delete', controller.deleteCartItem);


module.exports = router
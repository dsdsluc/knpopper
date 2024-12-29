const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");

const userValidate = require("../../validates/clients/user.validate")

router.get('/login', controller.login);

router.get('/logout', controller.logout);

router.post('/login',userValidate.loginPost, controller.loginPost);


router.get('/register', controller.register);

router.post('/register',userValidate.register, controller.registerPost);

router.get('/forgot-password', controller.forgotPassword);

router.post('/forgot-password',userValidate.forgotPassword, controller.forgotPasswordPost);

router.get('/password/otp', controller.otp);

router.post('/password/verify-otp', controller.otpPost);

router.get('/password/reset',controller.reset);

router.patch('/password/reset',userValidate.resetPassword, controller.resetPatch);



module.exports = router
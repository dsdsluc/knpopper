const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/contact.controller");
const userMiddleware = require("../../middlewares/client/user.middleware")

router.get('/', controller.index);

router.post('/send-problem', userMiddleware.requireLogin, controller.createProblem);


module.exports = router
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/home.controller");
const homeMiddleware = require("../../middlewares/client/home.middleware");

router.use(homeMiddleware.dataHome);

router.get('/', controller.index);


module.exports = router
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/order.controller");

router.delete('/cancel/:id', controller.cancel);

router.get('/detail/:id', controller.detail);


module.exports = router
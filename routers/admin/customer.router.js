const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/customer.controller");

router.get('/review', controller.review);

router.patch('/resolve/:id', controller.resolve);



module.exports = router
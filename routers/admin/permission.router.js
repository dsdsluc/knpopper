const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/permission.controller");

router.get('/list', controller.index);




module.exports = router
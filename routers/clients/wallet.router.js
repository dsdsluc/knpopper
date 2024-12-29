const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/wallet.controller");

router.get('/show', controller.index);



module.exports = router
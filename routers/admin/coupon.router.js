const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/coupon.controller");


router.get('/list', controller.list);

router.get('/create', controller.create);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', controller.editPatch);

router.post('/create', controller.createPost);

router.patch('/change-status/:id', controller.changeStatus );

router.delete('/delete/:id', controller.delete );


module.exports = router
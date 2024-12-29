const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/user.controller");

router.get('/list', controller.index);

// Hiển thị chi tiết người dùng
router.get('/detail/:id', controller.detail);

// Xóa người dùng
router.delete('/delete/:id', controller.delete);

router.patch('/change-status/:id', controller.userPatch);



module.exports = router
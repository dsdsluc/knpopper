const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");
 

router.get('/list',  controller.index);

router.get('/trash', controller.trash);

router.get('/detail/:id',  controller.orderDetail);

router.patch('/restore/:id', controller.restore);

router.patch('/update-status/:id', controller.updateStatusPatch);

router.patch('/update-status-order/:id', controller.updateStatusOrderPatch);

router.patch('/update-delivery-status/:id', controller.updateDeliveryStatus );

router.patch('/update-payment-order/:id', controller.updatePaymentStatus);

router.patch('/delete/:id', controller.delete);

module.exports = router
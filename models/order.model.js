const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    coupon: {
      coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
      discountValue: { type: Number, default: 0 }, 
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientName: { type: String, default: '' }, 
    phoneNumber: { type: String, required: true }, 
    address: { type: String },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true }, // Giá tại thời điểm mua
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 }, // Phí giao hàng
    discount: { type: Number, default: 0 }, // Tổng chiết khấu
    handlingFee: { type: Number, default: 0 }, // Phí xử lý
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled', 'delivering'],
      default: 'pending',
    },
    deleted: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: { type: String, enum: ['bank', 'cash', 'card'], default: 'cash',},
    paymentUpdates: [
      {
        status: { type: String, required: true, enum: ['unpaid', 'paid', 'refunded'] },
        note: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    deliveryUpdates: [
      {
        status: { type: String, required: true, enum: ['in progress packaging', 'dispatched', 'in transit', 'out for delivery', 'delivered'], default: 'in progress packaging' },
        note: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    courier: { type: String, default: '' }, // Đơn vị vận chuyển
    expectedDeliveryDate: { type: Date, default: null }, // Thời gian giao hàng dự kiến
    customerNote: { type: String, default: '' }, // Ghi chú của khách hàng
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema, 'orders');
module.exports = Order;

const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true }, // Mã giảm giá
    description: { type: String }, // Mô tả mã giảm giá
    discount_value: { type: Number, required: true }, // Giá trị giảm giá
    discount_type: { 
        type: String, 
        enum: ['percentage', 'fixed_amount'], 
        required: true 
    }, // Loại giảm giá
    start_date: { type: Date, required: true }, // Ngày bắt đầu
    end_date: { type: Date, required: true }, // Ngày kết thúc
    usage_limit: { type: Number, default: 0 }, // Tổng số lần sử dụng
    usage_per_user: { type: Number, default: 1 }, // Số lần sử dụng mỗi người dùng
    quantity: { type: Number, required: true, default: 1 }, // Số lượng mã giảm giá
    min_order_value: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu
    is_combinable: { type: Boolean, default: false }, // Có thể kết hợp với mã khác không
    used_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Người đã sử dụng
    is_active: { type: Boolean, default: true }, // Trạng thái hoạt động
}, {
    timestamps: true 
});

CouponSchema.index({ end_date: 1 }, { expireAfterSeconds: 0 });

const Coupon = mongoose.model('Coupon', CouponSchema, "coupons");
module.exports = Coupon;

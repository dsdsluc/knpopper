const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Tham chiếu tới bảng User nếu người dùng đã đăng nhập
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Chuyển email thành chữ thường
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'], // Trạng thái vấn đề
      default: 'pending',
    },
    adminNote: {
      type: String, // Ghi chú của admin về vấn đề
      default: '',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Thời gian gửi vấn đề
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Thời gian cập nhật trạng thái
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

const Problem = mongoose.model('Problem', ProblemSchema, 'problems');
module.exports = Problem;

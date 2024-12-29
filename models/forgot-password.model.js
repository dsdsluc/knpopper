const mongoose = require('mongoose');

const ForgotPasswordSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, expires: 180 }, 
  },
  { timestamps: true }
);

const ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema, 'forgot-password');

module.exports = ForgotPassword;

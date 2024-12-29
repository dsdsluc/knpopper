const mongoose = require('mongoose');
const generateHelper = require("../helpers/generate")

const UserSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      },
      city:{
        type: String
      },
      address: {
        type: String,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      tokenUser: {
        type: String,
        default: generateHelper.generateRandomString(30),
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\d{10,15}$/, 'Please use a valid phone number'],
      },
      avatar: {
        type: String
      },
      statusOnline: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
      },
      deleted: {
        type: Boolean,
        default: false,
      },
      deletedAt: Date,
    },
    { timestamps: true }
  );
const User = mongoose.model('User', UserSchema,"users");
module.exports = User;
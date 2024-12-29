const mongoose = require('mongoose');
const generateHelper = require(".././helpers/generate");

const AccountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type:String,
        default:generateHelper.generateRandomString(30)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false
    },
    description: String
  },{ timestamps: true });
const Account = mongoose.model('Account', AccountSchema,"accounts");
module.exports = Account;
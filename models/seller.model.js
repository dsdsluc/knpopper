const generateHelper = require("../helpers/generate")
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const SellerSchema = new mongoose.Schema({
  email: String,
  phone: String,
  slug: { type: String, slug: "shopName", unique: true },
  shopName: String,
  address: String,
  avatar: String,
  thumbnail: String,
  password: String,
  tokenSeller: {
      type: String,
      default: generateHelper.generateRandomString(30),
  },
  status: {
      type: String,
      default: "active",
  },
  confirm: {
      type: Boolean,
      default: false,
  },
  deleted: {
      type: Boolean,
      default: false,
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
}, { timestamps: true });

const Seller = mongoose.model('Seller', SellerSchema, "sellers"); 
module.exports = Seller;
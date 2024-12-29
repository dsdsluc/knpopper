const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

// Plugin để tạo slug từ `title`
mongoose.plugin(slug);

const ProductSchema = new mongoose.Schema({
  // 🛍️ **Thông Tin Cơ Bản**
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    slug: "title",
    unique: true,
    slugPaddingSize: 4 // Thêm số vào slug nếu trùng lặp
  },
  description: {
    type: String,
    trim: true
  },
  product_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null
  },
  brand: {
    type: String,
    trim: true,
    default: "Unknown"
  },
  feature: {
    type: String,
    trim: true
  },

  // 💰 **Giá và Khuyến Mãi**
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  finalPrice: {
    type: Number,
    default: 0
  },

  // 📦 **Kho Hàng**
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: [String],
    default: []
  },
  weight: {
    type: String,
    default: "0kg"
  },
  gender: {
    type: String,
    enum: ["male", "female", "unisex"],
    default: "unisex"
  },

  // 🖼️ **Hình Ảnh**
  thumbnail: {
    type: [String],
    default: []
  },

  // 📊 **Thứ Tự và Hiển Thị**
  position: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "active"
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // 📅 **Dấu Thời Gian và Người Tác Động**
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// 🔍 **Indexing** (Tối ưu cho tìm kiếm)
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ status: 1 });


// 🚀 **Export Model**
const Product = mongoose.model('Product', ProductSchema, "products");
module.exports = Product;

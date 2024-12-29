const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

// ✅ **Kích hoạt plugin tạo slug tự động**
mongoose.plugin(slug);

// 🛍️ **Schema ProductCategory**
const ProductCategorySchema = new mongoose.Schema(
  {
    // 📌 **Tiêu đề và Slug**
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
      slugPaddingSize: 4 
    },

    // 📂 **Danh mục cha**
    parent_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ProductCategory", 
      default: null 
    },

    // 📝 **Mô tả**
    description: { 
      type: String, 
      default: "", 
      trim: true 
    },

    // 🖼️ **Ảnh đại diện**
    thumbnail: { 
      type: String, 
      default: "/images/default-category.jpg"
    },

    // 📊 **Trạng thái & Vị trí**
    status: { 
      type: String, 
      enum: ["active", "inactive", "archived"], 
      default: "active" 
    },
    position: { 
      type: Number, 
      default: 0 
    },

    // 🛡️ **Xóa mềm**
    deleted: { 
      type: Boolean, 
      default: false 
    },

    // 👤 **Người tạo**
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Account", 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

// 🛠️ **Indexing**
ProductCategorySchema.index({ status: 1, parent_id: 1 });
ProductCategorySchema.index({ slug: 1 });

// 📚 **Virtual Field - Danh mục con**
ProductCategorySchema.virtual("children", {
  ref: "ProductCategory",
  localField: "_id",
  foreignField: "parent_id"
});

// ✅ **Static Method - Lấy danh mục con**
ProductCategorySchema.statics.findWithChildren = function (parentId) {
  return this.find({ parent_id: parentId, status: "active" })
    .populate('children')
    .lean();
};

// ✅ **Static Method - Tìm theo Slug**
ProductCategorySchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, status: "active" }).lean();
};

ProductCategorySchema.statics.findCategoryTree = async function () {
  try {
    const categories = await this.aggregate([
      { $match: { deleted: false, status: 'active', parent_id: null } },
      {
        $graphLookup: {
          from: 'products-categories', // Kiểm tra tên collection trong DB
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent_id',
          as: 'children',
          maxDepth: 5,
        },
      },
      { $sort: { position: 1 } }, // Sắp xếp theo vị trí
    ]);

    return categories;
  } catch (error) {
    console.error('Error in findCategoryTree:', error);
    throw error;
  }
};

// 🚀 **Export Model**
const ProductCategory = mongoose.model("ProductCategory", ProductCategorySchema, "products-category");
module.exports = ProductCategory;

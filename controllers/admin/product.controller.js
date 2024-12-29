const Product = require("../../models/product.model");
const ProductCategory = require("../../models/products-category.model");
const paginationHelper = require("../../helpers/pagination");
const productHelper = require("../../helpers/product");

const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const productName = req.query.query;
  const status = req.query.status;

  // Pagination Variables
  const pageCurrent = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limitItem = 8;

  try {
    // Tìm kiếm theo tên sản phẩm
    if (productName) {
      find.title = { $regex: productName, $options: "i" };
      req.flash("info", "Đang tìm kiếm sản phẩm: " + productName);
    }

    // Lọc theo trạng thái nếu có
    if (status && status !== "show-all") {
      find.status = status;
      req.flash("info", `Đang tìm kiếm sản phẩm với trạng thái: ${status}`);
    }

    // Tổng số lượng sản phẩm phù hợp
    const totalItem = await Product.countDocuments(find);

    // Xử lý phân trang
    const objectPagination = paginationHelper(
      pageCurrent,
      totalItem,
      limitItem
    );

    // Lấy sản phẩm, sắp xếp theo `position` giảm dần
    const products = await Product.find(find)
      .populate({
        path: "product_category_id",
        select: "title",
      })
      .sort({ position: -1 }) // Sắp xếp `position` giảm dần
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);

    res.render("admin/pages/product/index", {
      title: "Shop của tôi",
      message: "Hello there!",
      products: productHelper.priceNews(products),
      titleTopbar: "Product List!",
      pagination: objectPagination,
      currentStatus: status || "show-all", // Trạng thái hiện tại
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra khi tìm kiếm.");
    res.redirect("back");
  }
};



module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({deleted: false});
  res.render("admin/pages/product/create", {
    title: "Shop của tôi",
    message: "Hello there!",
    titleTopbar: "CREATE PRODUCT",
    productsCategory: categories,
  });
};

module.exports.createPost = async (req, res) => {
  try {
    // 🛡️ **Validate Dữ Liệu Bắt Buộc**
    if (!req.body.title || !req.body.price || !req.body.stock) {
      req.flash("error", "Title, price, and stock are required fields.");
      return res.redirect("back");
    }

    // 🧠 **Xử Lý Dữ Liệu Nhận Được**
    const position = req.body.position || (await Product.countDocuments()) + 1;
    const productCategoryId = mongoose.isValidObjectId(
      req.body.product_category_id
    )
      ? req.body.product_category_id
      : null;

    let sizes = [];
    if (Array.isArray(req.body.size) && req.body.size.length > 0) {
      sizes = req.body.size;
    } 

    // 🛠️ **Tạo Sản Phẩm Mới**
    const newProduct = new Product({
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      product_category_id: productCategoryId,
      price: Number(req.body.price),
      discountPercentage: Number(req.body.discountPercentage) || 0,
      stock: Number(req.body.stock),
      status: req.body.status || "active",
      position: position,
      brand: req.body.brand?.trim() || "",
      weight: req.body.weight?.trim() || "",
      gender: req.body.gender || "unisex",
      thumbnail: req.body.thumbnail,
      size: sizes
    });

    // 💾 **Lưu Sản Phẩm**
    await newProduct.save();

    // 🎯 **Phản Hồi Thành Công**
    req.flash("success", "Tạo mới sản phẩm thành công!");
    res.redirect(`/admin/products/detail/${newProduct._id}`);
  } catch (err) {
    console.error("❌ Error creating product:", err.message || err);
    req.flash("error", "Có lỗi xảy ra khi tạo sản phẩm.");
    res.redirect("back");
  }
};

module.exports.detail = async (req, res) => {
  try {
    // 📌 **Lấy ID từ params**
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      req.flash("error", "ID sản phẩm không hợp lệ.");
      return res.redirect("/admin/products/list");
    }

    // 🔍 **Tìm sản phẩm dựa trên ID và đảm bảo không bị xóa**
    const product = await Product.findOne({
      _id: id,
      deleted: false,
    })
      .populate("product_category_id") // Nạp thông tin danh mục sản phẩm
      .lean();

    // ⚠️ **Kiểm tra nếu sản phẩm không tồn tại**
    if (!product) {
      req.flash("error", "Sản phẩm không tồn tại hoặc đã bị xóa.");
      return res.redirect("/admin/products");
    }

    // 💰 **Tính toán giá cuối cùng (finalPrice) nếu cần**
    if (product.price && product.discountPercentage) {
      product.finalPrice =
        product.price - product.price * (product.discountPercentage / 100);
    } else {
      product.finalPrice = product.price || 0;
    }

    // 🖼️ **Đảm bảo hình ảnh mặc định nếu không có thumbnail**
    if (!product.thumbnail || product.thumbnail.length === 0) {
      product.thumbnail = ["/images/default-product.jpg"];
    }

    // 📝 **Render trang chi tiết sản phẩm**
    res.render("admin/pages/product/detail", {
      title: "Shop của tôi",
      message: "Chi tiết sản phẩm",
      titleTopbar: "PRODUCT DETAIL",
      product,
    });
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy chi tiết sản phẩm:",
      error.stack || error.message || error
    );
    req.flash("error", "Có lỗi xảy ra khi lấy chi tiết sản phẩm.");
    res.redirect("/admin/products/list");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const categories = await ProductCategory.find({deleted: false});

    const product = await Product.findOne({ _id: id })
      .populate({
        path: "product_category_id",
        select: "title",
      })
      .lean();

    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect(`/${prefixAdmin}/products/list`);
    }

    // ✅ Render trang chỉnh sửa sản phẩm
    res.render("admin/pages/product/edit", {
      title: "Shop của tôi",
      titleTopbar: "EDIT PRODUCT",
      message: req.flash("success") || req.flash("error"),
      productsCategory: categories,
      product: product,
    });
  } catch (error) {
    console.error("❌ Error in edit product controller:", error);
    req.flash("error", "An error occurred while loading the product edit page");
    res.redirect(`/${prefixAdmin}/products`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("back");
    }

    // 📊 Xử lý dữ liệu đầu vào
    const { price, discountPercentage, stock, weight, position, ...rest } = req.body;

    // Ép kiểu dữ liệu
    const sanitizedData = {
      price: !isNaN(parseInt(price)) ? parseInt(price) : 0,
      discountPercentage: !isNaN(parseInt(discountPercentage)) ? parseInt(discountPercentage) : 0,
      stock: !isNaN(parseInt(stock)) ? parseInt(stock) : 0,
      weight: !isNaN(parseFloat(weight)) ? parseFloat(weight) : 0,
      position: position ? (!isNaN(parseInt(position)) ? parseInt(position) : 0) : product.position,
      ...rest, // Giữ lại các trường khác như `title`, `brand`, `description`
    };

    // 🖼️ Xử lý hình ảnh (nếu có upload mới)
    if (req.files?.thumbnail) {
      sanitizedData.thumbnail = req.files.thumbnail.map((file) => file.path);
    }

    // 📝 Thông tin người cập nhật
    const updatedBy = {
      account_id: res.locals.user?.id || "system",
      updatedAt: new Date(),
    };

    // Cập nhật dữ liệu
    const updateData = {
      ...sanitizedData,
      $push: { updatedBy }, // Lưu lịch sử cập nhật
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      req.flash("error", "Failed to update product.");
      return res.redirect("back");
    }

    req.flash("success", "Product updated successfully!");
    res.redirect(`/admin/products/detail/${id}`);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    req.flash("error", "An error occurred while updating the product.");
    res.redirect("back");
  }
};


module.exports.changeStatus = async (req, res) => {
  try {
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      {
        status: req.body.status,
      }
    );

    req.flash("success", `Cập nhật trạng thái thành công`);
    res.redirect(`back`);
  } catch (err) {
    // Handle any errors that occur during the save operation
    req.flash("error", "Có lỗi xảy ra khi tìm kiếm.");
    res.redirect(`back`);
  }
};

module.exports.changeIsFeature = async (req, res)=>{
  try {
    const { id } = req.params; // Lấy ID sản phẩm từ URL
    const { isFeature } = req.body; // Lấy trạng thái mới từ form

    // Đảm bảo giá trị `isFeature` là boolean
    const newFeatureStatus = isFeature == 'true' ? false : true;

    // Tìm và cập nhật sản phẩm trong cơ sở dữ liệu
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isFeatured: newFeatureStatus },
      { new: true } // Trả về sản phẩm sau khi cập nhật
    );

    if (!updatedProduct) {
      req.flash("error", "Có lỗi xảy ra khi tìm kiếm.");
      res.redirect(`back`); 
    }
    req.flash("success", `Cập nhật trạng thái thành công`);
    res.redirect(`back`); 
  } catch (error) {
    console.error('Error changing product feature status:', error);
    req.flash("error", "Có lỗi xảy ra khi tìm kiếm.");
    res.redirect(`back`); 
  }
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await Product.updateOne({ _id: id }, { $set: { deleted: true } });

    req.flash("success", `Deleted Success!`);
    res.redirect(`back`);
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra khi tìm kiếm.");
    res.redirect(`back`);
  }
};

module.exports.changeMultiStatus = async (req, res) => {
  try {
    const { ids, type } = req.body;

    if (!ids) {
      req.flash("error", "No IDs provided.");
      return res.redirect("back");
    }

    const idList = ids.split(",").filter(Boolean); // Loại bỏ giá trị rỗng

    if (idList.length === 0) {
      req.flash("error", "No valid IDs provided.");
      return res.redirect("back");
    }

    switch (type) {
      case "change-position":
        const updatePromises = idList.map((item) => {
          const [id, position] = item.split("-");
          if (!id || !position || isNaN(position)) {
            req.flash("error", "Invalid ID or position.");
            throw new Error("Invalid ID or position format.");
          }
          return Product.updateOne({ _id: id }, { position: Number(position) });
        });

        // Thực hiện tất cả các truy vấn song song để tăng tốc
        await Promise.all(updatePromises);
        req.flash("success", "Positions updated successfully.");
        break;

      case "active":
      case "inactive":
        // Cập nhật trạng thái hàng loạt
        await Product.updateMany({ _id: { $in: idList } }, { status: type });
        req.flash("success", `Status updated to ${type}.`);
        break;

      case "delete-all":
        // Đánh dấu xóa các sản phẩm
        await Product.updateMany(
          { _id: { $in: idList } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          }
        );
        req.flash("success", "Selected products deleted successfully.");
        break;

      default:
        req.flash("error", "Invalid action type.");
        return res.redirect("back");
    }

    res.redirect("back");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while processing the request.");
    res.redirect("back");
  }
};

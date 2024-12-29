const Category = require("../../models/products-category.model");
const paginationHelper = require("../../helpers/pagination");

const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
  try {
    const pageCurrent = req.query.page ? parseInt(req.query.page, 10) : 1;
    const status = req.query.status || null;
    const parent_id = req.query.parent_id || null;
    const limitItem = 5;

    let find = { deleted: false };
    if (status) find.status = status;
    if (parent_id) find.parent_id = parent_id;

    // 🔢 **Phân Trang**
    const totalItem = await Category.countDocuments(find);
    const objectPagination = paginationHelper(
      pageCurrent,
      totalItem,
      limitItem
    );

    const earliestCategories = await Category.find(find)
      .sort({ createdAt: 1 })
      .limit(4)
      .lean();

    // 🔍 **Truy Vấn Danh Mục**
    const categories = await Category.aggregate([
      { $match: find },
      { $sort: { position: 1 } },
      { $skip: objectPagination.skip },
      { $limit: objectPagination.limitItem },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "product_category_id",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $lookup: {
          from: "products-category",
          localField: "parent_id",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $addFields: {
          minPrice: { $min: "$products.price" },
          maxPrice: { $max: "$products.price" },
          productCount: { $size: "$products" },
        },
      },
      {
        $unwind: {
          path: "$parentCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true, // Giữ lại nếu không có kết quả
        },
      },
      {
        $project: {
          products: 0, // Ẩn mảng products
          "createdBy.password": 0,
          "parentCategory.products": 0,
        },
      },
    ]);
    // 📝 **Render Giao Diện**
    res.render("admin/pages/category/index", {
      title: "Shop của tôi",
      message: "Danh sách danh mục sản phẩm.",
      titleTopbar: "Category List",
      categories: categories,
      pagination: objectPagination,
      currentStatus: status,
      parentId: parent_id,
      earliestCategories: earliestCategories,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    req.flash("error", "Có lỗi xảy ra khi lấy danh mục.");
    res.redirect("/admin/categories");
  }
};

module.exports.create = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          deleted: false,
          parent_id: null,
        },
      },
      {
        $graphLookup: {
          from: "products-category",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent_id",
          as: "children",
          maxDepth: 1,
        },
      },
      {
        $addFields: {
          children: {
            $filter: {
              input: "$children",
              as: "child",
              cond: {
                $and: [
                  { $eq: ["$$child.deleted", false] },
                  { $not: [{ $ifNull: ["$$child.seller_id", false] }] },
                ],
              },
            },
          },
        },
      },
    ]);

    res.render("admin/pages/category/create", {
      title: "Shop của tôi",
      message: "Hello there!",
      titleTopbar: "Category Create",
      productsCategory: categories,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra khi tìm kiếm.");
    res.redirect("/admin/dashboard");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const data = req.body;
    const user = res.locals.user;

    // Kiểm tra bắt buộc
    if (!data.title || !data.status) {
      req.flash("error", "Title and status are required fields.");
      return res.redirect("back");
    }

    // Tính toán position nếu không có
    const position = data.position || (await Category.countDocuments()) + 1;

    // Xác thực parent_id
    const parentId = mongoose.isValidObjectId(data.parent_id)
      ? data.parent_id
      : null;

    // Tạo danh mục mới
    const newCategory = new Category({
      title: data.title.trim(),
      parent_id: parentId,
      description: data.description?.trim() || "",
      status: data.status,
      position,
      createdBy: user._id,
      stock: data.stock || 0,
      brand: data.brand?.trim() || "",
      thumbnail: req.body.thumbnail,
    });

    // Lưu danh mục mới
    await newCategory.save();

    req.flash("success", "Category created successfully!");
    res.redirect(`/admin/category/detail/${newCategory.slug}`);
  } catch (err) {
    console.error("Error creating category:", err.message || err);
    req.flash("error", "An error occurred while creating the category.");
    res.redirect("back");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const { slug } = req.params;
    // 🔍 Tìm danh mục bằng slug và populate thông tin liên quan
    const category = await Category.findOne({ slug })
      .populate("parent_id", "title")
      .populate("createdBy", "fullName")
      .populate("children", "title slug")
      .lean();

    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect(`/${prefixAdmin}/category`);
    }

    res.render("admin/pages/category/detail", {
      title: "Category Details",
      message: "Here are the category details.",
      titleTopbar: "CATEGORY DETAILS",
      category,
    });
  } catch (error) {
    console.error("Error fetching category details:", error);
    req.flash("error", "Failed to load category details.");
    res.redirect(`/${prefixAdmin}/category`);
  }
};


module.exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    let { status } = req.body;
    if (status == "active") {
      status = "inactive"
    } else {
      status = "active"
    }

    
    const result = await Category.updateOne(
      { _id: id }, 
      { $set: { status } } 
    );

    if (result.modifiedCount > 0) {
      req.flash("success", "Cập nhật trạng thái thành công.");
    } else {
      req.flash("warning", "Không tìm thấy danh mục hoặc không có thay đổi.");
    }

    res.redirect("back");
  } catch (error) {
    console.error("❌ Error updating category status:", error);

    // Handle specific errors like `CastError`
    if (error.name === "CastError") {
      req.flash("error", "ID danh mục không hợp lệ.");
    } else {
      req.flash("error", "Có lỗi xảy ra khi cập nhật trạng thái.");
    }

    res.redirect("back");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const { slug } = req.params; // 📥 Lấy slug từ URL

    // 🔍 Tìm danh mục dựa trên slug và populate thông tin liên quan
    const category = await Category.findOne({ slug })
      .populate("parent_id", "title")
      .populate("createdBy", "fullName") // Lấy tên đầy đủ của người tạo
      .lean();

    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect("back");
    }

    const categories = await Category.aggregate([
      {
        $match: {
          deleted: false,
          parent_id: null,
        },
      },
      {
        $graphLookup: {
          from: "products-category",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent_id",
          as: "children",
          maxDepth: 1,
        },
      },
      {
        $addFields: {
          children: {
            $filter: {
              input: "$children",
              as: "child",
              cond: {
                $and: [
                  { $eq: ["$$child.deleted", false] },
                  { $not: [{ $ifNull: ["$$child.seller_id", false] }] },
                ],
              },
            },
          },
        },
      },
    ]);

    res.render("admin/pages/category/edit", {
      title: "Edit Category",
      message: "Update category details below.",
      titleTopbar: "EDIT CATEGORY",
      category,
      productsCategory: categories,
      slug: slug
    });
  } catch (error) {
    console.error("Error loading category edit page:", error);
    req.flash("error", "An error occurred while loading the category.");
    res.redirect("back");
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const { slug } = req.params; 

    // 🛡️ Xử lý và chuẩn hóa dữ liệu từ form
    const updateData = {
      title: req.body.title?.trim() || null,
      description: req.body.description?.trim() || "",
      status: req.body.status || "inactive",
      position: isNaN(parseInt(req.body.position))
        ? 0
        : parseInt(req.body.position),
      parent_id: req.body.parent_id || null, // Cho phép null nếu không có danh mục cha
    };

    // 🖼️ Nếu có thumbnail, thêm vào dữ liệu cập nhật
    if (req.body.thumbnail) {
      updateData.thumbnail = req.body.thumbnail; // URL từ middleware upload
    }

    // 🕒 Thêm thông tin người cập nhật và thời gian cập nhật
    updateData.updatedBy = {
      updatedAt: new Date(),
      account_id: req.user?._id || null, // Lấy thông tin người dùng đăng nhập (nếu có)
    };

    // 🔄 Tìm và cập nhật danh mục dựa trên slug
    const updatedCategory = await Category.findOneAndUpdate(
      { slug }, 
      updateData, 
      { new: true, runValidators: true } 
    );
    if (!updatedCategory) {
      req.flash("error", "Category not found.");
      return res.redirect("back");
    }

    req.flash("success", "Category updated successfully!");
    res.redirect(`/admin/category/detail/${updatedCategory.slug}`); // Chuyển hướng đến trang chi tiết danh mục
  } catch (error) {
    console.error("❌ Error updating category:", error);
    req.flash("error", "An error occurred while updating the category.");
    res.redirect("back");
  }
};

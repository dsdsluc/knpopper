const Article = require("../../models/article.model"); // Import model Article

// Danh sách bài báo
module.exports.index = async (req, res) => {
  try {
    const articles = await Article.find({ deleted: false }).lean();

    res.render("admin/pages/articles/index", {
      title: "Danh Sách Bài Báo",
      titleTopbar: "ARTICLES!",
      articles,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài báo:", error.message);
    req.flash("error", "Có lỗi xảy ra khi lấy danh sách bài báo!");
    res.redirect("/admin/dashboard");
  }
};
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/articles/create", {
      title: "Danh Sách Bài Báo",
      titleTopbar: "ARTICLES!",
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài báo:", error.message);
    req.flash("error", "Có lỗi xảy ra khi lấy danh sách bài báo!");
    res.redirect("/admin/dashboard");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, status, thumbnail } = req.body;

    if (!title || !content) {
      req.flash("error", "Tiêu đề và nội dung là bắt buộc!");
      return res.redirect("/admin/articles/create");
    }
    let newArticle;

    if (thumbnail) {
      newArticle = new Article({
        title,
        summary,
        content,
        status: status || "active",
        thumbnail,
      });
    } else {
      newArticle = new Article({
        title,
        summary,
        content,
        status: status || "active",
      });
    }

    await newArticle.save();
    req.flash("success", "Tạo bài báo thành công!");
    res.redirect(`/admin/articles//detail/${newArticle._id}`);
  } catch (error) {
    console.error("Lỗi khi tạo bài báo:", error.message);
    req.flash("error", "Có lỗi xảy ra khi tạo bài báo!");
    res.redirect("/admin/articles/create");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL

    // ✅ 1. Tìm Bài Báo Theo ID
    const article = await Article.findById(id).lean();

    if (!article) {
      req.flash("error", "Không tìm thấy bài báo!");
      return res.redirect("/admin/articles/list");
    }

    // ✅ 2. Render View Chi Tiết
    res.render("admin/pages/articles/detail", {
      title: "Chi Tiết Bài Báo",
      titleTopbar: "ARTICLE DETAIL",
      article,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài báo:", error.message);
    req.flash("error", "Có lỗi xảy ra khi lấy chi tiết bài báo!");
    res.redirect("/admin/articles/list");
  }
};

module.exports.delete = async (req, res) => {   
    try {
      const { id } = req.params; // Lấy ID từ URL
    
      // ✅ 1. Kiểm Tra ID
      if (!id) {
        req.flash('error', 'ID bài báo không hợp lệ!');
        return res.redirect('back');
      }
    
      const deletedArticle = await Article.findByIdAndDelete(id);
    
      if (!deletedArticle) {
        req.flash('error', 'Không tìm thấy bài báo để xóa!');
        return res.redirect('back');
      }
    
      // ✅ 3. Phản Hồi Thành Công
      req.flash('success', 'Xóa bài báo thành công!');
      return res.redirect('back');
    } catch (error) {
      console.error('Lỗi khi xóa bài báo:', error.message);
      req.flash('error', 'Có lỗi xảy ra khi xóa bài báo!');
      return res.redirect('back');
    }
}

module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL

    // ✅ 1. Kiểm Tra ID
    if (!id) {
      req.flash('error', 'ID bài báo không hợp lệ!');
      return res.redirect('/admin/articles/list');
    }

    // ✅ 2. Tìm Bài Báo Dựa Trên ID
    const article = await Article.findById(id).lean(); // Lấy dữ liệu bài báo và chuyển thành JSON

    if (!article) {
      req.flash('error', 'Không tìm thấy bài báo!');
      return res.redirect('/admin/articles/list');
    }

    // ✅ 3. Render Form Chỉnh Sửa với Dữ Liệu Bài Báo
    res.render('admin/pages/articles/edit', {
      title: 'Chỉnh Sửa Bài Báo',
      message: 'Cập nhật thông tin bài báo.',
      article, // Truyền dữ liệu bài báo vào view
    });
  } catch (error) {
    console.error('❌ Lỗi khi lấy dữ liệu bài báo:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi tải dữ liệu bài báo!');
    res.redirect('/admin/articles/list');
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, status } = req.body;
    let thumbnail = req.body.thumbnail;

    const updatedData = { title, summary, content, status };
    if (thumbnail) updatedData.thumbnail = thumbnail;

    await Article.findByIdAndUpdate(id, updatedData);

    req.flash('success', 'Cập nhật bài báo thành công!');
    res.redirect('back');
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật bài báo:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi cập nhật bài báo!');
    res.redirect(`back`);
  }
};
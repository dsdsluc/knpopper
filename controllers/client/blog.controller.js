const Article = require('../../models/article.model'); // Import model Article

// 📌 Hiển Thị Danh Sách Bài Viết Bên Client
module.exports.index = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'active', deleted: false })
      .sort({ publishedAt: -1 }) 
      .limit(10) 
      .lean(); 

    res.render('clients/pages/blogs/index', {
      title: 'Bài Viết Mới Nhất',
      message: 'Danh sách bài viết mới nhất từ cửa hàng của chúng tôi.',
      articles, 
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi tải danh sách bài viết!');
    res.redirect('/');
  }
};

module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL

    // ✅ 1. Tìm Bài Viết Dựa trên ID và Kiểm Tra Trạng Thái
    const article = await Article.findOneAndUpdate(
      { _id: id, status: 'active', deleted: false }, // Điều kiện tìm kiếm
      { $inc: { views: 1 } }, // Tăng lượt xem thêm 1
      { new: true, lean: true } // Trả về bản ghi mới sau khi cập nhật
    );

    // ✅ 2. Kiểm Tra Nếu Không Tìm Thấy Bài Viết
    if (!article) {
      req.flash('error', 'Bài viết không tồn tại hoặc đã bị xóa!');
      return res.redirect('/blogs');
    }

    // ✅ 3. Lấy Danh Sách Bài Viết Liên Quan
    const relatedArticles = await Article.find({
      _id: { $ne: id }, // Loại trừ bài viết hiện tại
      status: 'active',
      deleted: false,
    })
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    // ✅ 4. Render Trang Chi Tiết
    res.render('clients/pages/blogs/detail', {
      title: article.title,
      article,
      relatedArticles,
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài viết:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi tải chi tiết bài viết!');
    res.redirect('/blogs');
  }
};
const Transaction = require("../../models/transaction.model");

module.exports.index = async (req, res) => {
  try {
    // Lấy tất cả giao dịch từ cơ sở dữ liệu
    const transactions = await Transaction.find()
      .populate("order_id") // Populate thông tin của đơn hàng liên quan
      .populate("from_wallet_id") // Populate thông tin ví gửi
      .populate("to_wallet_id") // Populate thông tin ví nhận
      .sort({ createdAt: -1 }); // Sắp xếp giao dịch theo thời gian (mới nhất trước)

    // Render ra view hoặc trả về JSON
    res.render("admin/pages/transactions/index", {
      title: "Danh sách giao dịch",
      transactions, // Truyền danh sách giao dịch vào view
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giao dịch:", error);
    req.flash("error", "Không thể lấy danh sách giao dịch.");
    res.redirect("back");
  }
};

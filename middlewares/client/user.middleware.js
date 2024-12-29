const User = require("../../models/user.model");
const Order = require("../../models/order.model");

module.exports.inforUser = async (req, res, next) => {
  try {
    const tokenUser = req.cookies.tokenUser;

    // Nếu không có token, bỏ qua middleware
    if (!tokenUser || tokenUser.trim() === "") {
      return next();
    }

    // Truy vấn người dùng từ database
    const user = await User.findOne({ tokenUser, deleted: false }).select("-password -tokenUser");

    if (!user) {
      return next(); // Người dùng không tồn tại
    }

    // Lưu thông tin người dùng vào res.locals để sử dụng trong view hoặc middleware khác
    res.locals.user = user;

    // Chỉ truy vấn đơn hàng nếu người dùng tồn tại
    const pendingOrdersCount = await Order.countDocuments({
      user_id: user.id,
      deleted: false,
      status: { $nin: ["completed", "canceled"] }
    });

    // Lưu thông tin đơn hàng chờ xử lý vào res.locals
    res.locals.miniOrder = pendingOrdersCount;

  } catch (err) {
    console.error("Error in inforUser middleware:", err);
    return res.status(500).send("Internal Server Error");
  }

  // Chuyển sang middleware tiếp theo
  next();
};


module.exports.requireLogin = async (req, res, next) => {
  try {
    const tokenUser = req.cookies.tokenUser;


    if (!tokenUser || tokenUser.trim() === "") {
      req.session.returnTo = req.originalUrl;
      return res.redirect("/auth/login");
    }

    const user = await User.findOne({ tokenUser, deleted: false }).select("-password");
    if (!user || user.status === "inactive") {
      req.flash("error", "Tài khoản không hợp lệ hoặc đã bị khóa.");
      req.session.returnTo = req.originalUrl;
      return res.redirect("/login");
    }

    // Lưu thông tin người dùng vào req và res.locals để sử dụng trong các middleware khác
    req.user = user;
    res.locals.user = user;

    // Nếu người dùng hợp lệ, chuyển tiếp đến middleware hoặc route tiếp theo
    next();
  } catch (error) {
    console.error("Error in requireLogin middleware:", error);
    req.flash("error", "Đã xảy ra lỗi. Vui lòng thử lại.");
    res.redirect("/login");
  }
};
const Order = require("../../models/order.model"); 

module.exports.cancel = async (req, res) => {
  try {
    const orderId = req.body.orderId;

    // Kiểm tra xem đơn hàng có tồn tại hay không
    const order = await Order.findById(orderId);
    if (!order) {
      req.flash("error", "Đơn hàng không tồn tại.");
      return res.redirect("back"); // Điều hướng lại trang trước đó
    }

    // Kiểm tra trạng thái đơn hàng có thể hủy được hay không
    if (order.status === "completed" || order.status === "canceled") {
      req.flash("error", "Đơn hàng đã hoàn thành hoặc đã bị hủy không thể hủy thêm lần nữa.");
      return res.redirect("back"); // Điều hướng lại trang trước đó
    }

    // Cập nhật trạng thái đơn hàng thành "canceled"
    order.status = "canceled";
    await order.save();

    
    req.flash("success", "Đơn hàng đã được hủy thành công.");
    res.redirect("back"); // Điều hướng lại trang trước đó
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    req.flash("error", "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.");
    res.redirect("back"); // Điều hướng lại trang trước đó
  }
};

module.exports.detail = async (req, res) => {
  try {
    
    const order = await Order.findById(req.params.id)
      .populate('user_id', 'fullName email') // Lấy tên và email của người dùng
      .populate('items.product_id', 'title thumbnail price') // Lấy thông tin sản phẩm
      .exec();

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!order) {
      req.flash('error', 'Không tìm thấy đơn hàng.');
      return res.redirect('/orders'); // Chuyển hướng về danh sách đơn hàng
    }

    // Tính toán lại tổng giá trị đơn hàng nếu cần
    const orderDetails = {
      ...order._doc, // Sao chép dữ liệu từ mongoose object
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0), // Tổng số sản phẩm
      totalCost: order.items.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0) + order.shippingFee - order.discount, // Tổng giá trị
    };

    // Render ra giao diện chi tiết đơn hàng
    res.render('clients/pages/order/detail', {
      title: `Chi tiết đơn hàng - #${order._id}`,
      order: orderDetails,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    req.flash('error', 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.');
    res.redirect('/orders'); // Chuyển hướng về danh sách đơn hàng
  }
};




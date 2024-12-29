const Order = require("../../models/order.model");


module.exports.index = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {deleted: false};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate({
        path: "items.product_id",
        select: "title price thumbnail", 
      })
      .populate("user_id", "fullName email") 
      .sort({ createdAt: -1 });

   
    res.render("admin/pages/order/index", {
      title: "Shop của tôi",
      message: "Danh sách đơn hàng.",
      titleTopbar: "Tất cả đơn hàng",
      orders, 
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    req.flash("error", "Có lỗi xảy ra khi tìm kiếm đơn hàng.");
    res.redirect("back");
  }
};

module.exports.trash = async (req, res) => {
  try {
    const orders = await Order.find({ deleted: true })
      .populate('user_id', 'fullName email')
      .populate({
        path: 'items.product_id',
        select: 'title price thumbnail'
      })
      .sort({ updatedAt: -1 })
      .lean();

    res.render('admin/pages/order/trash', {
      title: 'Thùng Rác - Đơn Hàng',
      titleTopbar: "Thùng Rác - Đơn Hàng",
      orders,
      prefixAdmin: 'admin',
    });
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách đơn hàng đã xóa:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi lấy danh sách đơn hàng đã xóa.');
    res.redirect('/admin/dashboard');
  }
};

module.exports.orderDetail = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    // 📌 **1. Tìm đơn hàng với thông tin mã giảm giá**
    const order = await Order.findById(orderId)
      .populate({
        path: 'user_id',
        select: 'fullName email phone address',
      })
      .populate({
        path: 'items.product_id',
        select: 'title price description thumbnail',
      })
      .populate({
        path: 'coupon.coupon_id',
        select: 'code description discount_value discount_type start_date end_date',
      })
      .lean();

    // 📌 **2. Kiểm tra đơn hàng**
    if (!order) {
      req.flash('error', 'Đơn hàng không tồn tại.');
      return res.redirect('/admin/order/list');
    }

    // 📌 **3. Chuẩn bị dữ liệu chi tiết đơn hàng**
    const orderDetails = {
      orderInfo: {
        orderId: order._id,
        address: order.address || 'Không có địa chỉ',
        totalPrice: order.totalPrice.toLocaleString('vi-VN'),
        shippingFee: order.shippingFee.toLocaleString('vi-VN'),
        discount: order.discount.toLocaleString('vi-VN'),
        finalPrice: (
          order.totalPrice - order.discount + order.shippingFee
        ).toLocaleString('vi-VN'),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod || 'Không xác định',
        createdAt: order.createdAt.toLocaleString('vi-VN'),
        updatedAt: order.updatedAt.toLocaleString('vi-VN'),
        deliveryUpdates: order.deliveryUpdates || [],
        paymentUpdates:
          order.paymentUpdates?.map((update) => ({
            status: update.status || 'unpaid',
            note: update.note || 'Không có ghi chú',
            updatedAt: update.updatedAt?.toLocaleString('vi-VN'),
          })) || [],
      },
      userInfo: {
        userId: order.user_id?._id || 'Không xác định',
        name: order.user_id?.fullName || 'Không xác định',
        email: order.user_id?.email || 'Không xác định',
        phone: order.user_id?.phone || 'Không xác định',
        address: order.user_id?.address || 'Không xác định',
      },
      products: order.items.map((item) => ({
        productId: item.product_id?._id || 'Không xác định',
        name: item.product_id?.title || 'Không xác định',
        price: item.product_id?.price?.toLocaleString('vi-VN') || '0',
        description: item.product_id?.description || 'Không có mô tả',
        quantity: item.quantity,
        total: (
          (item.product_id?.price || 0) * item.quantity
        ).toLocaleString('vi-VN'),
        thumbnail: item.product_id?.thumbnail?.[0] || '/images/no-image.png',
      })),
      coupon: order.coupon?.coupon_id
        ? {
            code: order.coupon.coupon_id.code || 'Không có mã',
            description: order.coupon.coupon_id.description || 'Không có mô tả',
            discountValue: order.coupon.discountValue?.toLocaleString('vi-VN') || '0',
            discountType: order.coupon.coupon_id.discount_type || 'Không xác định',
            startDate: order.coupon.coupon_id.start_date?.toLocaleDateString('vi-VN') || 'Không xác định',
            endDate: order.coupon.coupon_id.end_date?.toLocaleDateString('vi-VN') || 'Không xác định',
          }
        : null,
    };

    // 📌 **4. Render giao diện chi tiết đơn hàng**
    res.render('admin/pages/order/orderDetail', {
      title: 'Chi Tiết Đơn Hàng',
      titleTopbar: 'Chi Tiết Đơn Hàng',
      message: 'Thông tin chi tiết của đơn hàng.',
      order: orderDetails,
    });
  } catch (error) {
    console.error('❌ Lỗi trong orderDetail:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi lấy thông tin đơn hàng.');
    res.redirect('/admin/order/list');
  }
};



module.exports.restore = async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndUpdate(id, { deleted: false });
    req.flash('success', 'Đơn hàng đã được khôi phục.');
    res.redirect('/admin/order/trash');
  } catch (error) {
    console.error('❌ Lỗi khi khôi phục đơn hàng:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi khôi phục đơn hàng.');
    res.redirect('/admin/order/trash');
  }
};


module.exports.updateStatusPatch = async (req, res) => {
  try {
    const orderId = req.params.id; // Lấy ID từ params
    const { status } = req.body; // Lấy trạng thái mới từ body

    const order = await Order.findById(orderId);
    if (!order) {
      req.flash("error", "Đơn hàng không được tìm thấy.");
      return res.redirect("back");
    }

    // Sử dụng switch case để xử lý trạng thái
    switch (status) {
      case "pending":
        order.status = "delivering";
        break;
      case "canceled":
        order.status = "pending";
        break;
      case "delivering":
        order.status = "completed";
        break;
    }

    order.updatedAt = Date.now();

    await order.save();

    req.flash("success", "Cập nhật trạng thái đơn hàng thành công.");
    res.redirect("back");
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
    res.redirect("back");
  }
};

module.exports.updateStatusOrderPatch = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from the route parameter
    const { status } = req.body; // Get the selected status from the form data

    // Check if the status is valid
    const validStatuses = ['pending', 'completed', 'canceled', 'delivering'];
    if (!validStatuses.includes(status)) {
      req.flash("error", "Invalid status selected.");
      return res.redirect("back");
    }

    // Update the order status
    await Order.findByIdAndUpdate(id, { status });

    req.flash("success", "Order status has been updated successfully.");
    res.redirect(`back`); // Redirect to the order detail page or another page as needed
  } catch (error) {
    console.error("Error updating order status:", error);
    req.flash("error", "An error occurred while updating the order status.");
    res.redirect("back");
  }
};

module.exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, note } = req.body;  

    
    if (!status) {
      req.flash("error", "Vui lòng chọn trạng thái giao hàng.");
      return res.redirect("back");
    }

   
    await Order.findByIdAndUpdate(id, {
      $push: {
        deliveryUpdates: {
          status,
          note: note || "", 
          updatedAt: Date.now()
        }
      }
    });

    req.flash("success", "Trạng thái giao hàng đã được cập nhật thành công.");
    res.redirect(`back`); 
  } catch (error) {
    console.error("Error updating delivery status:", error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật trạng thái giao hàng.");
    res.redirect("back");
  }
};

module.exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    await Order.findByIdAndUpdate(id, {
      paymentStatus: status,
      $push: {
        paymentUpdates: {
          status: status,
          note,
          updatedAt: new Date(),
        },
      },
    });

    req.flash('success', 'Trạng thái thanh toán đã được cập nhật.');
    res.redirect(`back`);
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật trạng thái thanh toán:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán.');
    res.redirect('back');
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Order.updateOne(
      { _id: id },
      { $set: { deleted: true } }
    );

    if (result.nModified === 0) {
      req.flash("error", "Không tìm thấy đơn hàng hoặc đơn hàng đã bị xóa.");
    } else {
      req.flash("success", "Cập nhật trạng thái đơn hàng thành công.");
    }

    return res.redirect("back");
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa đơn hàng.");
    return res.redirect("back"); // Redirect back even in case of error
  }
};
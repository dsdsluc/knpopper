const Order = require('../../models/order.model'); 
const Wishlist = require('../../models/wishlist.model'); 
const SupportTicket = require('../../models/support_ticket.model'); 
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  try {
    const user = res.locals.user; // Lấy thông tin người dùng đã đăng nhập

    // Lấy thống kê đơn hàng theo trạng thái
    const orderCounts = await Order.aggregate([
      { $match: { user_id: user._id, deleted: false } },
      {
        $group: {
          _id: {
            $cond: [
              { $in: ['$status', ['delivering', 'pending']] }, 
              'inProgress',
              { $cond: [{ $eq: ['$status', 'canceled'] }, 'canceled', 'completed'] }
            ]
          },
          count: { $sum: 1 },
        }
      }
    ]);

    // Chuẩn bị dữ liệu thống kê
    const formattedCounts = {
      inProgress: orderCounts.find(group => group._id === 'inProgress')?.count || 0,
      canceled: orderCounts.find(group => group._id === 'canceled')?.count || 0,
      completed: orderCounts.find(group => group._id === 'completed')?.count || 0,
    };

    // Lấy danh sách đơn hàng của người dùng
    const orders = await Order.find({
      user_id: user._id,
      deleted: false,
    })
      .populate('items.product_id', 'title thumbnail price') // Lấy thông tin sản phẩm
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất
      .lean();

    // Lấy danh sách sản phẩm yêu thích
    const wishlist = await Wishlist.findOne({ user_id: user._id })
      .populate('products.product_id', 'title thumbnail price')
      .lean();

    // Lấy danh sách yêu cầu hỗ trợ
    const supportTickets = await SupportTicket.find({ user_id: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Render giao diện
    res.render('clients/pages/user/index', {
      title: 'Thông Tin Tài Khoản',
      message: 'Chào mừng bạn đến với tài khoản của mình!',
      orderCounts: formattedCounts,
      orders,
      wishlist,
      supportTickets,
    });
  } catch (error) {
    console.error('❌ Lỗi khi xử lý index:', error.message);
    res.status(500).send('Đã xảy ra lỗi, vui lòng thử lại sau.');
  }
};


module.exports.updateProfile = async (req, res) => {
  try {
    const user = res.locals.user
    const { firstName, lastName, email, phone, address, city } = req.body;
    const fullName = `${firstName} ${lastName}`;

    const updateData = {
      fullName,
      email,
      phone,
      address,
      city
    };

    if (req.file) {
      updateData.avatar = req.body.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });
    

    if (!updatedUser) {

      req.flash('error', 'User not found or profile update failed');
      return res.redirect("back");
    }

    req.flash('success', 'Profile updated successfully');
    res.redirect("back");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'An error occurred while updating the profile.', error: error.message });
  }
};



module.exports.supportTicketPost = async (req, res) => {
  try {
    const user = res.locals.user
    
    const { description } = req.body;

    // Validate input
    if (!description) {
      req.flash("error", "User ID and description are required.");
      return res.redirect('back');
    }

    // Create a new support ticket
    const newTicket = new SupportTicket({
      user_id: user.id,
      description,
    });

    // Save to database
    await newTicket.save();

    req.flash("success", "Support ticket created successfully.");
    return res.redirect('back');
  } catch (error) {
    console.error("Error creating support ticket:", error);
    req.flash("error", "An error occurred while creating the support ticket.");
    return res.redirect('back');
  }
};

const User = require("../../models/user.model");
const Order = require('../../models/order.model');

module.exports.index = async (req, res) => {
    try {
        
        const users = await User.find({ deleted: false }).lean();

        res.render('admin/pages/user/index', {
            title: 'Shop của tôi',
            message: 'Hello there!',
            titleTopbar: "Profile User123",
            users, 
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi tìm kiếm.');
        res.redirect('/admin/users'); 
    }
};

module.exports.detail = async (req, res) => {
    try {
        const userId = req.params.id;

        // Lấy thông tin người dùng
        const user = await User.findById(userId).lean();
        if (!user) {
            req.flash('error', 'Người dùng không tồn tại!');
            return res.redirect('/admin/users');
        }

        // Lấy danh sách đơn hàng của người dùng
        const orders = await Order.find({ 
            user_id: userId, 
            deleted: false 
        })
        .populate('items.product_id', 'name')
        .sort({ createdAt: -1 })
        .lean();

        // Thống kê đơn hàng
        const orderStats = await Order.aggregate([
            { $match: { user_id: user._id, deleted: false } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalPrice" }
                }
            }
        ]);

        // Định dạng thống kê đơn hàng
        const stats = {
            pending: 0,
            completed: 0,
            canceled: 0,
            delivering: 0,
            totalSpent: 0
        };

        orderStats.forEach(stat => {
            stats[stat._id] = stat.count || 0;
            stats.totalSpent += stat.totalAmount || 0;
        });

        res.render('admin/pages/user/detail', {
            title: 'Chi Tiết Người Dùng',
            user,
            orders,
            stats
        });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết người dùng:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi tìm kiếm người dùng!');
        res.redirect('/admin/users');
    }
};
// Xóa người dùng (Xóa mềm)
module.exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { deleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!user) {
            req.flash('error', 'Người dùng không tồn tại!');
            return res.redirect('back');
        }

        req.flash('success', 'Xóa người dùng thành công!');
        res.redirect('back');
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi xóa người dùng!');
        res.redirect('back');
    }
};



module.exports.userPatch = async (req, res) => {
    try {
        const userID = req.params.id;
        let status = req.body.status;

        // Xác thực trạng thái chỉ là 'active' hoặc 'inactive'
        if (!['active', 'inactive'].includes(status)) {
            req.flash('error', 'Trạng thái không hợp lệ!');
            return res.redirect('back');
        }

        // Đảo trạng thái
        status = status === 'active' ? 'inactive' : 'active';

        // Tìm và cập nhật người dùng
        const user = await User.findByIdAndUpdate(
            userID,
            { status },
            { new: true }
        );

        if (!user) {
            req.flash('error', 'Người dùng không tồn tại!');
            return res.redirect('back');
        }

        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.redirect('back');
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái người dùng:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái!');
        res.redirect('back');
    }
};

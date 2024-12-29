const Coupon = require("../../models/coupon.model");
const paginationHelper = require("../../helpers/pagination");

module.exports.list = async (req, res) => {
    try {
        // 🛠️ Lấy tham số từ query
        const { 
            page = 1, 
            limit = 4, 
            is_active, 
            discount_type, 
            sort_by = 'createdAt', 
            sort_order = 'desc' 
        } = req.query;

        // 🛠️ Tạo bộ lọc
        const filter = {};
        if (is_active !== undefined) {
            filter.is_active = is_active === 'true';
        }
        if (discount_type) {
            filter.discount_type = discount_type;
        }

        const totalItems = await Coupon.countDocuments(filter);

        const pagination = paginationHelper(page, totalItems, limit);

        const coupons = await Coupon.find(filter)
            .sort({ [sort_by]: sort_order === 'desc' ? -1 : 1 })
            .skip(pagination.skip)
            .limit(pagination.limitItem);

        res.render("admin/pages/coupons/index", {
            title: "Quản Lý Mã Giảm Giá",
            titleTopbar: "Quản Lý Mã Giảm Giá",
            coupons,               
            pagination,            
            query: req.query      
        });
    } catch (error) {
        console.error("❌ Error fetching coupons:", error);
        res.redirect("back");
    }
};


module.exports.create = async (req, res) => {

    res.render("admin/pages/coupons/create", {
        title: "Tạo mã giảm giá",
        message: "Vui lòng điền thông tin mã giảm giá",
        titleTopbar: "CREATE COUPON",
    });
};

module.exports.createPost = async (req, res) => {
    try {
        // 🛠️ Lấy dữ liệu từ body
        const {
            code,
            description,
            discount_value,
            discount_type,
            min_order_value,
            start_date,
            end_date,
            usage_limit,
            usage_per_user,
            quantity,
            is_combinable,
            is_active
        } = req.body;

        // 🛡️ Validation cơ bản
        if (!code || !discount_value || !discount_type || !start_date || !end_date || !quantity) {
            req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
            return res.redirect("back");
        }

        if (new Date(start_date) > new Date(end_date)) {
            req.flash('error', 'Ngày bắt đầu không thể lớn hơn ngày hết hạn!');
            return res.redirect("back");
        }

        

        // 🔄 Chuyển đổi kiểu dữ liệu Boolean
        const isCombinable = is_combinable === 'true';
        const isActive = is_active === 'true';

        // ✅ Tạo mã giảm giá mới
        await Coupon.create({
            code,
            description,
            discount_value,
            discount_type,
            min_order_value: min_order_value || 0,
            start_date,
            end_date,
            usage_limit: usage_limit || 0,
            usage_per_user: usage_per_user || 1,
            quantity,
            is_combinable: isCombinable,
            is_active: isActive
        });

        // 🎯 Chuyển hướng về trang danh sách mã giảm giá
        req.flash('success', '🎉 Mã giảm giá đã được tạo thành công!');
        res.redirect(`/${req.prefixAdmin || 'admin'}/coupon/list`);
    } catch (error) {
        console.error("❌ Lỗi khi tạo mã giảm giá:", error);

        // 🛡️ Kiểm tra lỗi trùng mã giảm giá
        if (error.code === 11000) {
            req.flash('error', 'Mã giảm giá đã tồn tại, vui lòng chọn mã khác.');
        } else {
            req.flash('error', 'Có lỗi xảy ra khi tạo mã giảm giá, vui lòng thử lại sau.');
        }

        res.redirect("back");
    }
};


module.exports.edit = async (req, res) => {
    try {
        // 🛠️ Lấy ID mã giảm giá từ params
        const { id:couponId } = req.params;

        // 🛡️ Kiểm tra ID hợp lệ
        if (!couponId) {
            req.flash('error', 'ID mã giảm giá không hợp lệ!');
            return res.redirect("back");
        }

        // 🔄 Tìm mã giảm giá theo ID
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            req.flash('error', 'Mã giảm giá không tồn tại!');
            return res.redirect("back");
        }

        // ✅ Render trang chỉnh sửa với dữ liệu mã giảm giá
        res.render("admin/pages/coupons/edit", {
            title: "Chỉnh Sửa Mã Giảm Giá",
            coupon,
            prefixAdmin: req.prefixAdmin || 'admin',
            titleTopbar: "Chỉnh Sửa Mã Giảm Giá",
            
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin mã giảm giá:", error);
        req.flash('error', 'Có lỗi xảy ra khi lấy thông tin mã giảm giá.');
        res.redirect("back");
    }
};


module.exports.editPatch = async (req, res) => {
    try {
        // 🛠️ Lấy ID mã giảm giá từ params
        const { id: couponId } = req.params;

        // 🛡️ Kiểm tra ID hợp lệ
        if (!couponId) {
            req.flash('error', 'ID mã giảm giá không hợp lệ!');
            return res.redirect("back");
        }

        // 🛠️ Lấy dữ liệu từ body
        const {
            code,
            description,
            discount_value,
            discount_type,
            min_order_value,
            start_date,
            end_date,
            usage_limit,
            usage_per_user,
            quantity,
            is_combinable,
            is_active
        } = req.body;

        // 🛡️ Validation dữ liệu cơ bản
        if (!code || !discount_value || !discount_type || !start_date || !end_date || !quantity) {
            req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
            return res.redirect("back");
        }

        if (new Date(start_date) > new Date(end_date)) {
            req.flash('error', 'Ngày bắt đầu không thể lớn hơn ngày hết hạn!');
            return res.redirect("back");
        }

        if (discount_value <= 0 || quantity <= 0 || usage_per_user <= 0) {
            req.flash('error', 'Giá trị giảm, số lượng và giới hạn mỗi người phải lớn hơn 0!');
            return res.redirect("back");
        }

        // 🔄 Chuyển đổi kiểu dữ liệu Boolean
        const isCombinable = is_combinable === 'true';
        const isActive = is_active === 'true';

        // ✅ Cập nhật mã giảm giá
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponId,
            {
                code,
                description,
                discount_value,
                discount_type,
                min_order_value: min_order_value || 0,
                start_date,
                end_date,
                usage_limit: usage_limit || 0,
                usage_per_user: usage_per_user || 1,
                quantity,
                is_combinable: isCombinable,
                is_active: isActive
            },
            { new: true, runValidators: true }
        );

        // 🛡️ Kiểm tra nếu mã giảm giá không tồn tại
        if (!updatedCoupon) {
            req.flash('error', 'Mã giảm giá không tồn tại!');
            return res.redirect("back");
        }

        // 🎯 Chuyển hướng sau khi cập nhật thành công
        req.flash('success', '🎉 Mã giảm giá đã được cập nhật thành công!');
        res.redirect(`/${req.prefixAdmin || 'admin'}/coupon/list`);
    } catch (error) {

        // 🛡️ Xử lý lỗi trùng mã giảm giá
        if (error.code === 11000) {
            req.flash('error', 'Mã giảm giá đã tồn tại, vui lòng chọn mã khác.');
        } else {
            req.flash('error', 'Có lỗi xảy ra khi cập nhật mã giảm giá, vui lòng thử lại sau.');
        }

        res.redirect("back");
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        const { couponId, status } = req.body; 

        const isActive = status === 'active';

        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, { is_active: isActive }, { new: true });

        if (!updatedCoupon) {
            req.flash("error", "Không tìm thấy mã giảm giá.");
            return res.redirect("back");
        }

        req.flash("success", "Trạng thái mã giảm giá đã được cập nhật thành công!");
        res.redirect("back");
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi cập nhật trạng thái mã giảm giá.");
        res.redirect("back");
    }
};

module.exports.delete = async (req, res) => {
    try {
        const { couponId } = req.body; 

        const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

        if (!deletedCoupon) {
            req.flash("error", "Không tìm thấy mã giảm giá để xóa.");
            return res.redirect("back");
        }

        req.flash("success", "Mã giảm giá đã được xóa thành công!");
        res.redirect(`back`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi xóa mã giảm giá.");
        res.redirect("back");
    }
};








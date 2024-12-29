const system = require("../../configs/system");
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.flash("error", "Bạn cần đăng nhập để truy cập.");
            return res.redirect(`/${system.prefixAdmin}/auth/login`);
        }

        const user = await Account.findOne({ token: token });
        if (!user) {
            req.flash("error", "Phiên đăng nhập của bạn không hợp lệ.");
            return res.redirect(`/${system.prefixAdmin}/auth/login`);
        }

        if (user.status === "inactive") {
            req.flash("error", "Tài khoản của bạn đã bị khóa.");
            return res.redirect(`/${system.prefixAdmin}/auth/login`);
        }
        const role = await Role.findOne({_id: user.role_id});
        res.locals.role = role
        res.locals.user = user; 
        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        req.flash("error", "Có lỗi xảy ra trong quá trình xác thực.");
        return res.redirect(`/${system.prefixAdmin}/auth/login`);
    }
};

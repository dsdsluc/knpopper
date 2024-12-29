const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    try {
        
        const token = req.cookies.tokenUser;
        
       
        if (!token) {
            req.flash("error", "Bạn cần đăng nhập để truy cập.");
            return res.redirect(`/auth/login`);
        }

        
        const user = await User.findOne({ tokenUser: token });
        
       
        if (!user) {
            req.flash("error", "Phiên đăng nhập của bạn không hợp lệ.");
            return res.redirect(`/auth/login`);
        }

        
        if (user.status === "inactive") {
            req.flash("error", "Tài khoản của bạn đã bị khóa.");
            return res.redirect(`/auth/login`);
        }

        
        next();
    } catch (error) {
        
        console.error('Error during authentication:', error);
        req.flash("error", "Có lỗi xảy ra trong quá trình xác thực.");
        return res.redirect(`/auth/login`);
    }
};

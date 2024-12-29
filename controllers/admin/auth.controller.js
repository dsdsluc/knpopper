const md5 = require("md5");
const system = require("../../configs/system");
const Account = require("../../models/account.model");

module.exports.login = async (req, res)=>{
    
    res.render('admin/pages/auth/login', {
        title: 'Shop của tôi',
        message: 'Hello there!',
      });
}

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash("error", "Email và mật khẩu không được để trống.");
        return res.redirect("back");
    }

    const hashedPassword = md5(password);

    try {
        const user = await Account.findOne({
            email: email,
            password: hashedPassword
        });

        if (!user) {
            req.flash("error", "Email hoặc mật khẩu của bạn không đúng");
            return res.redirect("back");
        }

        if (user.status === "inactive") {
            req.flash("error", "Tài khoản của bạn đã bị khóa");
            return res.redirect("back");
        }

        res.cookie("token", user.token, { httpOnly: true, secure: true }); 

        return res.redirect(`/${system.prefixAdmin}/dashboard`);
        
    } catch (error) {
        console.error('Error during login:', error);
        req.flash("error", "Có lỗi xảy ra. Vui lòng thử lại.");
        return res.redirect("back");
    }
};

module.exports.logout = (req, res) => {
    try {

        res.clearCookie("token"); 
        req.flash("success", "Bạn đã đăng xuất thành công.");
        res.redirect(`/${system.prefixAdmin}/auth/login`); 
    } catch (error) {

        console.error('Error during logout:', error);
        req.flash("error", "Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
        res.redirect("back");

    }
};


module.exports.register = async (req, res) => {
    res.render('admin/pages/auth/register', {
        title: 'Shop của tôi',
        message: 'Hello there!',
      });
};

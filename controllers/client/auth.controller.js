const md5 = require("md5");
const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");

const helperGenerate= require("../../helpers/generate");
const helperSendMail= require("../../helpers/sendMail");

module.exports.login = async (req, res) => {
    
    res.render('clients/pages/auth/login', {
      title: 'Shop của tôi',
      message: 'Hello there!',
    }); 
};

module.exports.logout = async(req, res) =>{

    res.clearCookie("tokenUser");
    req.flash('success', 'Logout Successful');
    res.redirect(`/auth/login`)
}

module.exports.register = async(req, res) =>{

    res.render("clients/pages/auth/register",{
        title: 'Shop của tôi',
        message: 'Hello there!',
    });
};

module.exports.registerPost = async (req, res) => {
    const { fullName, email, password, phone, address } = req.body;

    // Kiểm tra xem tất cả thông tin đầu vào có hợp lệ không
    if (!fullName || !email || !password || !phone) {
        req.flash('error', 'Vui lòng điền đầy đủ thông tin');
        return res.redirect("back");
    }

    try {
        // Kiểm tra xem email đã tồn tại hay chưa
        const existingUser = await User.findOne({ email, deleted: false });
        if (existingUser) {
            req.flash('error', 'Email đã tồn tại');
            return res.redirect("back");
        }

        // Mã hóa mật khẩu
        const hashedPassword = md5(password);

        // Tạo đối tượng người dùng mới
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address,
        });

        await newUser.save();

        if (req.cookies.cartId) {
            await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: newUser.id });
        }

       
        res.cookie("tokenUser", newUser.tokenUser);

        req.flash('success', 'Đăng ký thành công! Chào mừng bạn đến với cửa hàng.');
        res.redirect("/");
    } catch (error) {
        console.error("Error during registration:", error);
        req.flash('error', 'Đã xảy ra lỗi, vui lòng thử lại');
        res.redirect("back");
    }
};



module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'Email không tồn tại');
            return res.redirect("back");
        }

        if (md5(password) !== user.password) {
            req.flash('error', 'Sai mật khẩu');
            return res.redirect("back");
        }

        if (user.status === "inactive") {
            req.flash('error', 'Tài khoản đã bị khóa');
            return res.redirect("back");
        }

        await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });

        
        res.cookie("tokenUser", user.tokenUser);

        const redirectTo = req.session.returnTo || "/"; 
        if(redirectTo){
            delete req.session.returnTo; 
            res.redirect(redirectTo);
        }
        else{
            res.redirect("back");
        }
       
        
    } catch (error) {
        console.error("Error during login:", error);
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại');
        res.redirect("back");
    }
};

  

module.exports.forgotPassword = async(req, res) =>{

    res.render('clients/pages/auth/forgot', {
        title: 'Shop của tôi',
        message: 'Hello there!',
      }); 
}

module.exports.forgotPasswordPost = async(req, res) =>{
    const email = req.body.email ;
    const otp = helperGenerate.generateRandomNumber(6)
    const user = await User.findOne({
        email: email
    });
    if(!user){
        req.flash('error', 'Email không tồn tại');
        res.redirect("back");
        return ;
    }
    
    const objectForgotPassword = {
        email: email,
        otp : otp
    }
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gui ma OTP vao email
    const subject = "Mã OTP để lấy lại mật khẩu"
    const html = `
        Mã OTP của bạn là : <b>${otp}<b/>.Lưu ý mã chỉ có hiệu lực trong 3 phút
    `

    helperSendMail.sendMail(email,subject,html)


    res.redirect(`/auth/password/otp?email=${email}`);
}

module.exports.otp = async (req, res) => {
    const email = req.query.email

    res.render('clients/pages/auth/otp', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      email: email
    }); 
};

module.exports.otpPost = async(req, res) => {
    const {otp,email} = req.body;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if(!result){
        req.flash('error', 'OTP Không đúng');
        res.redirect("back");
        return ;
    }
    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser)

    res.redirect(`/auth/password/reset?email=${email}`)
}

module.exports.reset = async (req, res) => {
    const email = req.query.email

    res.render('clients/pages/auth/reset', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      email: email
    }); 
};

module.exports.resetPatch = async(req, res) => {
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(req.body.password)
    })

    req.flash('success', 'Đổi mật khẩu thành công');
    res.redirect("/")
}
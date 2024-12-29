module.exports.register = (req, res, next)=>{
    if(!req.body.fullName){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    }
    if(!req.body.email){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    }
    if(!req.body.password){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    }
    
    next();
}

module.exports.loginPost = (req, res, next)=>{
    if(!req.body.email){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    }
    if(!req.body.password){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    }
    
    next();
}
module.exports.forgotPassword = (req, res, next)=>{
    if(!req.body.email){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    } 
    
    next();
}
module.exports.resetPassword = (req, res, next)=>{
    if(!req.body.password){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    } 
    if(!req.body.confirm){
        req.flash('error', 'Vui lòng điền đẩy đủ thông tin');
        res.redirect("back");
        return ;
    } 
    if(req.body.confirm != req.body.password){
        req.flash('error', 'Xác nhận lại mật khẩu không đúng');
        res.redirect("back");
        return ;
    } 

    next();
}

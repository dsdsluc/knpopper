const Problem = require('../../models/problem.model');

module.exports.index = async (req, res) => {

    res.render('clients/pages/contact/index', {
      title: 'Shop của tôi',
      message: 'Hello there!',
    });
  };
  
  module.exports.createProblem = async (req, res) => {
    try {
      console.log(req.body)
      const { name, email, subject, message } = req.body;
  
      if (!name || !email || !subject || !message) {
        req.flash('error', 'Tất cả các trường là bắt buộc.');
        return res.redirect('back');
      }
  
      const problem = new Problem({
        user: res.locals.user ? res.locals.user._id : null, 
        name,
        email,
        subject,
        message,
      });
  
      await problem.save();
  
      req.flash('success', 'Cảm ơn bạn đã gửi vấn đề. Chúng tôi sẽ liên hệ lại sớm.');
      res.redirect('back');
    } catch (error) {
      console.error('❌ Error saving problem:', error);
      req.flash('error', 'Có lỗi xảy ra khi gửi vấn đề. Vui lòng thử lại.');
      res.redirect('back');
    }
  };


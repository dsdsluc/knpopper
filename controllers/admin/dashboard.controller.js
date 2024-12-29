
module.exports.index = async (req, res) => {
    

    res.render('admin/pages/dashboard/index', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      titleTopbar: "WELCOME!"
    });
  };
  
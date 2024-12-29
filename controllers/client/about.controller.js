
module.exports.index = async (req, res) => {

    res.render('clients/pages/about/index', {
      title: 'Shop của tôi',
      message: 'Hello there!',
    });
  };
  


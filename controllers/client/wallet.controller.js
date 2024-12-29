module.exports.index = async (req, res) => {
    
    
    res.render('clients/pages/wallet/index', {
        title: 'Shop của tôi',
        message: 'Hello there!'
      });
  };
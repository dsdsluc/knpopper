const Product = require("../../models/product.model");
const producHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
  const settings = res.locals.settings;

      const products = await Product.find({
          deleted: false,
          status: "active",
          isFeatured: true
      }).limit(4).sort({ position: -1 });

      
      req.flash("success", `Xin chào đến với ${settings.site_name}`);
      res.render('clients/pages/home/index', {
          title: 'Shop của tôi',
          message: 'Hello there!',
          productsFeature: producHelper.formatCurrencyVNDs(products)
      });
};

  




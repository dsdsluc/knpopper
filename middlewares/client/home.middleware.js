const HomePage = require('../../models/homePage.model');

module.exports.dataHome = async (req, res, next) => {
  try {
    // Fetch the HomePage data
    let homePage = await HomePage.findOne();

    // Attach HomePage data to res.locals
    res.locals.homePage = homePage || {
      banners: [],
      featuredCategories: [],
      advs: [],
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('❌ Error fetching HomePage:', error);

    
    res.locals.homePage = {
      banners: [],
      featuredCategories: [],
      advs: [],
    };

    next(); 
  }
};

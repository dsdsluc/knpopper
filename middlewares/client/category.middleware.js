const ProductCategory = require("../../models/products-category.model");

module.exports.getCategories = async (req, res, next) => {
  try {
    // Fetch up to 6 categories, sorted by position in descending order
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
    })
      .sort({ position: -1 }) // Sort by position (descending)
      .limit(6); // Limit the result to 6 categories

    // Attach categories to res.locals for use in the view
    res.locals.categories = categories || [];

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("❌ Error fetching product categories:", error);

    // Attach an empty array in case of an error
    res.locals.categories = [];

    next(); // Continue even if an error occurs
  }
};

const Product = require("../../models/product.model");

module.exports.getLatestProducts = async (req, res, next) => {
    try {
        
        const latestProducts = await Product.find()
            .sort({ createdAt: -1 }) 
            .limit(5);

       
        res.locals.latestProducts = latestProducts;
        next(); 
    } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm mới:", error);
        res.locals.latestProducts = []; 
        next(); 
    }
};

module.exports.getFeaturedProducts = async (req, res, next) => {
    try {
        
        const featuredProducts = await Product.find({ isFeatured: true })
            .sort({ createdAt: -1 }) 
            .limit(3); 

        res.locals.featuredProducts = featuredProducts; 
        next(); 
    } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm nổi bật:", error);
        res.locals.featuredProducts = [];
        next(); 
    }
};
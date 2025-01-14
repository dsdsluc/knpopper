const ProductCategory = require("../../models/products-category.model");
const Product = require("../../models/product.model");
const Seller = require("../../models/seller.model");
const Comment = require("../../models/comment.model");
const Wishlist = require("../../models/wishlist.model");

const productHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
    try {
      const find = { 
        deleted: false, 
        status: "active" 
      };
  
      if (req.query.query) {       
        const regex = new RegExp(req.query.query, "i");
        find.title = regex;
      }
      if (req.body['categories[]'] && req.body['categories[]'].length > 0) {

        const categoryIds = Array.isArray(req.body['categories[]'])
          ? req.body['categories[]']
          : [req.body['categories[]']];
        find.product_category_id = { $in: categoryIds }; 
      }
  
      let sortOption = { position: "desc" }; 
  
      // Xử lý tham số sort
      if (req.query.sort) {
        switch (req.query.sort) {
          case "price_asc":
            sortOption = { price: "asc" }; 
            break;
          case "price_desc":
            sortOption = { price: "desc" }; 
            break;
          case "newest":
            sortOption = { createdAt: "desc" }; 
            break;
          default:
            sortOption = { position: "desc" }; 
        }
      }

  
      const productsDB = await Product.find(find).sort(sortOption);
      const products = productHelper.formatCurrencyVNDs(productsDB);

  
      res.render("clients/pages/products/index", {
        title: "Shop của tôi",
        message: "Hello there!",
        products,
        valueSearch: req.query.query,
        currentSort: req.query.sort || "default" ,
        categoriesChecked : req.body['categories[]']
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  };


module.exports.detail = async (req, res) => { 
  _io.on('connection', (socket) => {
    socket.on("CLIENT_SEND_COMMENT", async (comment) => {
      try {
          const newComment = new Comment({
              commentText: comment.commentText,
              rating: comment.rating,
              product_id: comment.productId, 
              user_id: comment.userId 
          });

          const savedComment = await newComment.save();
          
          socket.emit("COMMENT_SAVED", { success: true, comment: savedComment });
      } catch (error) {
          console.error('Error saving comment:', error);
          socket.emit("COMMENT_ERROR", { success: false, error: error.message });
      }
    });
  });
    
  const slugProduct = req.params.slug;
  
  // Lấy sản phẩm từ slug
  const product = await Product.findOne({ slug: slugProduct }).populate('product_category_id', 'title');

  // Lấy tất cả bình luận cho sản phẩm đó và populate thông tin người dùng
  const comments = await Comment.find({ product_id: product._id }).populate('user_id', 'fullName address'); 

  const newProduct = productHelper.priceNew(product);

  res.render('clients/pages/products/detail', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      product: newProduct,
      comments: comments 
  });
};


module.exports.category = async (req, res) => {
    const slug = req.params.slug; 

    const productCategory = await ProductCategory.findOne({
        slug: slug
    }) 
    const getSubCategory = async (parentId)=>{
        const subs = await ProductCategory.find({
            parent_id: parentId,
            deleted: false,
            status: "active"
        })

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSub = allSub.concat(childs);
        }
        return allSub
    }
    const listSbuCategory =  await getSubCategory(productCategory.id);
    const listSbuCategoryId = listSbuCategory.map(item=>item.id);

    const products = await Product.find({
        product_category_id:{$in : [productCategory.id, ...listSbuCategoryId]}
    })
    const newProducts =productHelper.priceNews(products)
    res.render("clients/pages/products/index",{
        title: 'Shop của tôi',
        message: 'Hello there!',
        products : newProducts
    })
}

module.exports.wishlistPatch = async (req, res) => {
    try {
        const user = res.locals.user
        
        const { product_id, action } = req.body; 

        // Ensure the product ID is provided
        if (!product_id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        // Check if the product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Retrieve the user's wishlist
        let wishlist = await Wishlist.findOne({ user_id: user.id });

        // If no wishlist exists, create a new one
        if (!wishlist) {
            wishlist = new Wishlist({ user_id: user.id, products: [] });
        }

        // Handle different actions
        if (action === 'add') {
            if (wishlist.products.some(item => item.product_id.toString() === product_id)) {
              req.flash("error", "Product is already in your wishlist.");
              return res.redirect("back");
              
            }
            wishlist.products.push({ product_id });
            await wishlist.save();
            req.flash("success", "Product added to wishlist.");
            return res.redirect("back");
        }

        if (action === 'remove') {
            const productIndex = wishlist.products.findIndex(item => item.product_id.toString() === product_id);
            if (productIndex === -1) {
              req.flash("error", "Product not found in your wishlist.");
              return res.redirect("back");
            }
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            return res.status(200).json({ message: "Product removed from wishlist", wishlist });
        }

        if (action === 'update') {
            // For example, we can update the quantity of the product if it's an array (but for now, we'll leave it simple)
            const productIndex = wishlist.products.findIndex(item => item.product_id.toString() === product_id);
            if (productIndex === -1) {
              req.flash("error", "Product not found in your wishlist.");
              return res.redirect("back");
            }
            // Example update: In real case, you might update quantity or other details here
            wishlist.products[productIndex] = { product_id };
            await wishlist.save();
            req.flash("success", "Product updated in wishlist.");
            return res.redirect("back");
        }

        // If action is not recognized, return an error
        return res.status(400).json({ error: "Invalid action" });
    } catch (error) {
        console.error("Error in wishlistPatch:", error);
        res.status(500).json({ error: "Server error" });
    }
};



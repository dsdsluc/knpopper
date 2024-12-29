const homeRouters = require("./home.router");
const productRouters = require("./product.router");
const aboutRouters = require("./about.router");
const blogRouters = require("./blog.router");
const userRouters = require("./user.router");
const contactRouters = require("./contact.router");
const cartRouters = require("./cart.router");
const authRouters = require("./auth.router");
const orderRouters = require("./order.router");
const walletRouters = require("./wallet.router");

const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const productMiddeware = require("../../middlewares/client/product.middelware");


module.exports = (app)=>{
    
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.inforUser);
    app.use(categoryMiddleware.getCategories);
    app.use(settingMiddleware.attachSettings);
    app.use(productMiddeware.getLatestProducts);
    app.use(productMiddeware.getFeaturedProducts);
    

    app.use('/',homeRouters);

    app.use('/products', productRouters);

    app.use('/about',aboutRouters); 

    app.use('/blogs', blogRouters);

    app.use('/user', userRouters);

    app.use('/contact', contactRouters);

    app.use('/cart',cartRouters);

    app.use('/order',userMiddleware.requireLogin, orderRouters);

    app.use('/auth', authRouters);
    
    app.use('/wallet', walletRouters);
}
const system = require("../../configs/system")
const dashboardRoute = require("./dashboard.router");
const userRoute = require("./user.router");
const productRoute = require("./product.router");
const categoryRoute = require("./category.router");
const authRoute = require("./auth.router");
const roleRoute = require("./role.router");
const permissionRoute = require("./permission.router");
const accountRoute = require("./account.router");
const couponRoute = require("./coupon.router");
const orderRoute = require("./order.router");
const transitionRoute = require("./transition.router");
const settingRoute = require("./setting.router");
const pageRoute = require("./page.router");
const customerRoute = require("./customer.router");
const articalRoute = require("./artical.router");

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const orderMiddlware = require("../../middlewares/admin/order.middleware");

module.exports = (app)=>{
    const PATH_ADMIN = "/" + system.prefixAdmin;
    app.use(orderMiddlware.countPendingOrdersMiddleware);

    app.use( PATH_ADMIN +"/dashboard",authMiddleware.requireAuth, dashboardRoute)

    app.use( PATH_ADMIN +"/user",authMiddleware.requireAuth, userRoute)

    app.use( PATH_ADMIN +"/products",authMiddleware.requireAuth,  productRoute)

    app.use( PATH_ADMIN +"/category",authMiddleware.requireAuth,  categoryRoute)

    app.use( PATH_ADMIN +"/setting",authMiddleware.requireAuth,  settingRoute)

    app.use( PATH_ADMIN +"/auth", authRoute)

    app.use( PATH_ADMIN +"/role",authMiddleware.requireAuth,  roleRoute)

    app.use( PATH_ADMIN +"/permission",authMiddleware.requireAuth,  permissionRoute)

    app.use( PATH_ADMIN +"/coupon",authMiddleware.requireAuth,  couponRoute)

    app.use( PATH_ADMIN +"/account",authMiddleware.requireAuth,  accountRoute)
    
    app.use( PATH_ADMIN +"/order",authMiddleware.requireAuth,  orderRoute)

    app.use( PATH_ADMIN +"/transition",authMiddleware.requireAuth,  transitionRoute)

    app.use( PATH_ADMIN +"/page",authMiddleware.requireAuth,  pageRoute)

    app.use( PATH_ADMIN +"/customer",authMiddleware.requireAuth,  customerRoute)

    app.use( PATH_ADMIN +"/articles",authMiddleware.requireAuth,  articalRoute)
    
}
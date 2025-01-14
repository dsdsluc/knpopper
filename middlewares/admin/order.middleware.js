const Order = require('../../models/order.model'); // Đảm bảo đường dẫn đúng đến model Order

/**
 * Middleware lấy danh sách và đếm số lượng đơn hàng đang xử lý (pending)
 */
module.exports.countPendingOrdersMiddleware = async (req, res, next) => {
  try {
    
    const pendingOrders = await Order.find({ status: 'pending' })
      .select('_id recipientName phoneNumber totalPrice createdAt')
      .lean();

    
    const pendingOrdersCount = pendingOrders.length;

    
    res.locals.pendingOrders = pendingOrders;
    res.locals.pendingOrdersCount = pendingOrdersCount; 

  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách đơn hàng đang xử lý:', error.message);
    res.locals.pendingOrders = []; 
    res.locals.pendingOrdersCount = 0;
  }
  next();
};

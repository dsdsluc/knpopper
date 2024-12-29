const Cart = require("../../models/cart.model");

async function createNewCartAndSetCookie(res) {
  const cart = new Cart();
  await cart.save();

  const timeExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  res.cookie("cartId", cart.id, {
    expires: timeExpires,
    httpOnly: true, // Ngăn client-side script truy cập cookie
    secure: process.env.NODE_ENV === "production", // Chỉ sử dụng HTTPS trong môi trường production
  });

  return cart;
}

module.exports.cartId = async (req, res, next) => {
  try {
    // Nếu người dùng không có cookie `cartId`
    if (!req.cookies.cartId) {
      // Tạo mới giỏ hàng và đặt cookie
      const cart = await createNewCartAndSetCookie(res);
      res.locals.miniCart = { totalQuantity: 0, products: [] }; // Giỏ hàng trống
    } else {
      // Tìm giỏ hàng dựa trên `cartId` trong cookie
      const cart = await Cart.findOne({ _id: req.cookies.cartId });

      if (!cart) {
        // Nếu giỏ hàng không tồn tại, tạo giỏ hàng mới
        const newCart = await createNewCartAndSetCookie(res);
        res.locals.miniCart = { totalQuantity: 0, products: [] }; // Giỏ hàng trống
      } else {
        // Nếu giỏ hàng tồn tại, tính toán tổng số lượng sản phẩm
        cart.totalQuantity = Array.isArray(cart.products)
          ? cart.products.reduce((sum, item) => sum + item.quantity, 0)
          : 0;

        // Lưu giỏ hàng vào `res.locals.miniCart` để dùng ở các middleware tiếp theo
        res.locals.miniCart = cart;
      }
    }
  } catch (err) {
    console.error("Error in cartId middleware:", err.message); // Log lỗi
    return res.status(500).send("Internal Server Error");
  }

  next();
};

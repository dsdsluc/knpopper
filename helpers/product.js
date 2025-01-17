module.exports.priceNews = (products)=>{
    products.forEach(item =>{
        item.priceNew = Math.round((item.price * (100-item.discountPercentage))/100,0);
    })
    return products
}

module.exports.formatCurrencyVNDs = (products)=>{
    products.forEach(item =>{
        item.priceNew = Math.round((item.price * (100-item.discountPercentage))/100,0);

        item.priceNew = item.priceNew.toLocaleString('vi-VN') + ' ₫';
        item.price = item.price.toLocaleString('vi-VN') + ' ₫';
    })
    return products
}

module.exports.priceNew = (product)=>{
    product.priceNew = Math.round((product.price * (100-product.discountPercentage))/100,0);
    return product
}

module.exports.formatCurrencyVND = (product)=>{
    product.priceNew = Math.round((product.price * (100-product.discountPercentage))/100,0);

    product.priceNew = product.priceNew.toLocaleString('vi-VN') + ' ₫';
    product.price = product.price.toLocaleString('vi-VN') + ' ₫';
    return product
}

// productHelper.js
module.exports.calculateDiscountedPrice = function(product, appliedCoupons) {
    let priceNew = product.price; // Giá gốc

    appliedCoupons.forEach(coupon => {
        if (coupon.discount_type === 'percentage') {
            const discount = (priceNew * (coupon.discount_value / 100));
            priceNew -= discount; // Giảm theo phần trăm
        } else if (coupon.discount_type === 'fixed_amount') {
            priceNew -= coupon.discount_value; // Giảm theo số tiền cố định
        }
    });

    return Math.max(priceNew, 0); 
};

module.exports.calculateDiscountedPriceNew = function(product, appliedCoupons) {
    let priceNew = product.priceNew; // Giá gốc

    appliedCoupons.forEach(coupon => {
        if (coupon.discount_type === 'percentage') {
            const discount = (priceNew * (coupon.discount_value / 100));
            priceNew -= discount; // Giảm theo phần trăm
        } else if (coupon.discount_type === 'fixed_amount') {
            priceNew -= coupon.discount_value; // Giảm theo số tiền cố định
        }
    });

    return Math.max(priceNew, 0); 
};

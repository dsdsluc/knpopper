const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            index: true, 
        },
        products: [
            {
                product_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1, 
                },
                size: {
                    type: String,
                }
            },
        ],
    },
    {
        timestamps: true, 
    }
);

// Create an index to speed up queries that look up carts by product_id
CartSchema.index({ 'products.product_id': 1 });

const Cart = mongoose.model('Cart', CartSchema, 'carts');
module.exports = Cart;

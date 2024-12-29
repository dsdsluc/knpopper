const mongoose = require('mongoose');

// Define the Wishlist Schema
const WishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for references
      ref: 'User',  // Optional: Reference to the User model
      required: true, // Ensure that the user_id is always required
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for references
          ref: 'Product',  // Optional: Reference to the Product model
          required: true,  // Ensure that the product_id is always required
        },
      },
    ],
  },
  { timestamps: true }  
);

// Add an index to user_id for fast lookups
WishlistSchema.index({ user_id: 1 });


const Wishlist = mongoose.model('Wishlist', WishlistSchema, 'wish-list');

module.exports = Wishlist;

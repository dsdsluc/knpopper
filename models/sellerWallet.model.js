const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerWalletSchema = new Schema(
    {
        seller_id: {
            type: Schema.Types.ObjectId,
            ref: 'Seller', // Assuming you have a Seller model
            required: true,
            unique: true, // Each seller has a unique wallet
        },
        balance: {
            type: Number,
            required: true,
            default: 0, // Initial balance can be set to 0 or any other value
            min: 0, // Balance should not be negative
        },
        currency: {
            type: String,
            default: 'USD', // Default currency for the seller wallet
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'], // Define wallet status
            default: 'active', // Default status
        },
        lastTransactionAt: {
            type: Date, // Stores the date of the last transaction
        },
        transactionHistory: [
            {
                amount: {
                    type: Number,
                    required: true,
                },
                type: {
                    type: String,
                    enum: ['cash', 'incoming'], // Define transaction types
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                description: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create the SellerWallet model
const SellerWallet = mongoose.model('SellerWallet', SellerWalletSchema, 'sellerWallets');

module.exports = SellerWallet;

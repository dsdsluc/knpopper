const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminWalletSchema = new Schema(
    {
        balance: {
            type: Number,
            required: true,
            default: 0, // Initial balance can be set to 0 or any other value
            min: 0, // Balance should not be negative
        },
        currency: {
            type: String,
            default: 'USD', // Default currency for the admin wallet
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
                    enum: ['bank', 'card','cash'], 
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


const AdminWallet = mongoose.model('AdminWallet', AdminWalletSchema, 'adminWallets');

module.exports = AdminWallet;
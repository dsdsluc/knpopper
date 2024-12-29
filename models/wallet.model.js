const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Links wallet to a specific user
            required: true,
            unique: true, // Each user has only one wallet
            index: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0, // Balance should not be negative
        },
        currency: {
            type: String,
            default: 'USD', // Define your default currency (e.g., 'USD')
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
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
                    enum: ['credit', 'debit'],
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
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Indexes to improve query performance
WalletSchema.index({ user_id: 1 });
WalletSchema.index({ balance: 1, status: 1 });

const Wallet = mongoose.model('Wallet', WalletSchema, 'wallets');
module.exports = Wallet;

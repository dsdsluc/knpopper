const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
    {
        order_id: {
            type: Schema.Types.ObjectId,
            ref: 'Order', 
            index: true, 
        },
        from_wallet_id: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
        },
        to_wallet_id: {
            type: Schema.Types.ObjectId,
            ref: 'AdminWallet', 
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0, 
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Indexing to speed up transactions lookup by order_id and status
TransactionSchema.index({ order_id: 1 });
TransactionSchema.index({ status: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema, 'transactions');
module.exports = Transaction;

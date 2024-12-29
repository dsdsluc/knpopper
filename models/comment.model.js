const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    commentText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // References the Product model
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    status: { type: String, default: 'visible' }, // visible, hidden, deleted
    likes: { type: Number, default: 0 }
});

const Comment = mongoose.model('Comment', CommentSchema, "comments");
module.exports = Comment;

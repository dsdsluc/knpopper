const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user_id: String,
  seller_id: String, 
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'Account', 
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      is_read: {
        type: Boolean,
        default: false, 
      },
      created_at: {
        type: Date,
        default: Date.now, 
      },
    },
  ], 
}, {
  timestamps: true, 
});

// Tạo model từ schema
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;

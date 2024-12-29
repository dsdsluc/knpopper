const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    }
    
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model('SupportTicket', SupportTicketSchema, 'support_tickets');
module.exports = SupportTicket;

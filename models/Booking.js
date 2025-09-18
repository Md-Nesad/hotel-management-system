const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  resortName: {
    type: String,
    required: true,
  },
  checkIn: Date,
  checkOut: Date,
  email: String,
  phone: String,

  card: {
    cardType: { type: String, enum: ['credit', 'debit'], required: true },
    last4Digits: String,        
    cardHolderName: String,
    expiration: String,        
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Booking", bookingSchema);

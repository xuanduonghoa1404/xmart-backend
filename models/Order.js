const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    //
    status: {
      type: String,
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Not processed",
    },
    //
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    locator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locator",
    },
    total: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    lng: {
      type: Number,
    },
    lat: {
      type: Number,
    },
  },
  {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Date.now() },
  }
);
orderSchema.set('timestamps', true);
module.exports = mongoose.model('Order', orderSchema);

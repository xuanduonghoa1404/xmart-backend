const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  // amount: {
  //     type: Number,
  //     required: true,
  //     max: 128,
  //     min: 0
  // },
  // createdDate: {
  //     type: Date,
  //     default: Date.now,
  // },
  // modifiedDate: {
  //     type: Date,
  //     default: Date.now
  // },
  // createdUID: {
  //     type: User
  // }
  name: {
    type: String,
  },
  locator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Locator",
  },
  imports: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      sku: String,
      date_manufacture: {
        type: Date,
        required: true
      },
      date_expiration: {
        type: Date,
        required: true
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
});
inventorySchema.set("timestamps", true);
module.exports = mongoose.model("ImportInventory", inventorySchema);

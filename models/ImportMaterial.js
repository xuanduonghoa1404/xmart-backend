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
  import: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      sku: String,
      quantity: Number,
      date_manufacture: Date,
      date_expiration: Date,
    },
  ],
});
inventorySchema.set("timestamps", true);
module.exports = mongoose.model("Inventory", inventorySchema);

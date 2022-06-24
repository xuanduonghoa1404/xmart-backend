const mongoose = require("mongoose");

const exportInventorySchema = new mongoose.Schema({
  // _id: {
  //     type: Number,

  // },
  // amount: {
  //     type: Number,
  //     required: true,
  //     max: 128,
  //     min: 6,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  export: [
    {
      inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
      },
      amount: Number,
    },
  ],
});
exportInventorySchema.set("timestamps", true);
module.exports = mongoose.model("ExportInventory", exportInventorySchema);

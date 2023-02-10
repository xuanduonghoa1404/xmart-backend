const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  fromEmailAdress: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  fromEmailPassword: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    default: "0 0 7 ? * *", //every day at 7:00 AM
    //default: '*/2 * * * *' //every 2 minutes
  },
  templateEmail: {
    type: String,
  },
  warningQuantity: [
    {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type",
      },
      quantity: Number,
    },
  ],
  warningDateExpiration: [
    {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type",
      },
      numberOfDate: Number,
    },
  ],
  warningType: [
    {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type",
      },
      quantity: Number,
      numberOfDate: Number,
    },
  ],
  timeWarning: {
    type: String,
    default: "7:00",
  },
  image: [
    {
      type: String,
    },
  ],
});
shopSchema.set('timestamps', true);
module.exports = mongoose.model('Shop', shopSchema);

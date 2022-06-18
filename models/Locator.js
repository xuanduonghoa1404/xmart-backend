const mongoose = require('mongoose');
const locatorSchema = new mongoose.Schema({
    storeID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    lng: {
        type: Number,
        // required: true,
    },
    lat: {
        type: Number,
        // required: true,
    },
});
locatorSchema.set('timestamps', true);
module.exports = mongoose.model('Locator', locatorSchema);


const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        min: 0,
        max: 255,
    },
    description: {
        type: String,
        required: false,
        max: 1023,
        min: 0,
    },
    status: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    compare_at_price: {
        type: Number
    },
    photo: {
        type: String,
        required: false
    },
    uom: {
        type: String,
        required: false
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    },
    inventory: [
        {
            locator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Locator'
            },
            imports: [
                {
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
                }
            ]

        }
    ]
});
productSchema.set('timestamps', true);
module.exports = mongoose.model('Product', productSchema);
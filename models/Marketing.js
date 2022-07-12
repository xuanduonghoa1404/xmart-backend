const mongoose = require('mongoose');
const marketingSchema = new mongoose.Schema({
    // ruleID: {
    //     type: String,
    //     required: true,
    // },
    name: {
        type: String,
        required: true,
    },
    apply: {
        type: String,
        enum: ['ALL', 'TYPE', 'PRODUCT'],
        default: 'ALL',
    },
    apply_type: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }
    ],
    apply_product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    status: {
        type: Boolean,
        default: true,
    },
    discount_type: {
        type: String,
        enum: ['FLAT', 'FIX_AMOUNT', 'PERCENT'],
        default: 'PERCENT',
    },
    value: {
        type: Number,
        default: 0,
    },
    condition: {
        type: String,
        enum: ['QTY', 'DATE', 'ALL'],
        default: 'DATE',
    },
    condition_value: {
        type: Number,
        default: 0,
    }
});
marketingSchema.set('timestamps', true);
module.exports = mongoose.model('Marketing', marketingSchema);

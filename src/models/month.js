const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    month : {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const Month = mongoose.model('Month', OrderSchema);
module.exports = Month 
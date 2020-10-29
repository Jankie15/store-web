const mongoose = require('mongoose');

const OrdertSchema = new mongoose.Schema({
    products:{
        type: Array,
        required: true,
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    total:{
        type: Number,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    status:{
        type: Array,
        required: true,
    },
    estimated_date:{
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('Orders', OrdertSchema);
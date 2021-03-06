const mongoose = require('mongoose');

const OrdertSchema = new mongoose.Schema({
    order:{
        type: String,
        required: true,
    },
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
        type: String,
        required: true,
    },
    estimated_date:{
        type: String,
    },
});
module.exports = mongoose.model('Orders', OrdertSchema);
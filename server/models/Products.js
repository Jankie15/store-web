const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    photo:{
        type: String,
        required: true,
    },
    value:{
        type: Number,
        required: true,
    }

});

module.exports = mongoose.model('Products', ProductSchema);
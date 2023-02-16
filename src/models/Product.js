const mongoose = require("mongoose");

const ProductSchema= new mongoose.Schema({
    productName: {
        type: String,
    },
    productPrice: {
        type: Number,
    },
    quantity: {
        type: Number
    }
})

module.exports = mongoose.model('Product', ProductSchema)
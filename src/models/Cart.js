const mongoose = require("mongoose");

const ProductSchema = require('../models/Product').schema

const CartSchema = new mongoose.Schema({
    cartName: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        requried: true
    },
    products: {
        type: [ProductSchema]
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Cart', CartSchema)


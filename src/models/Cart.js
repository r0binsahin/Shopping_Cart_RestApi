const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    cartName: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        requried: true
    },

    products:[{ 
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 0
        }
    }] 
},
{
    timestamps: true,
})

module.exports = mongoose.model('Cart', CartSchema)


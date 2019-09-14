 const mongoose = require('mongoose')

 const CartSchema = new mongoose.Schema({
     ingredients : [{
        count: {
            type: Number,
            required: true
        },
        unit: {
            type: String
        },
        ingredient: {
            type: String,
            required: true,
            trim: true
        }
     }],
     owner: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User'
     }
 })

 const Cart = mongoose.model('Cart', CartSchema);

 module.exports = Cart;
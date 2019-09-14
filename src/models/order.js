const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    ingredients : [{
        ingredientOrder : [{
            count: {
                type: Number,
                required: true
            },
            ingredient: {
                type: String,
                required: true,
                trim: true
            },
            unit: {
                type:String,
                trim: true
            }
        }],
        address: {
            name: {
                type:String,
                required:true
            },
            pincode: {
                type:Number,
                required:true
            },
            address:{
                type: String,
                required:true
            }
        },
        completed : {
            type : Boolean,
            default: false,
            required: true
        },
        deleted:{
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: new Date(),
            required: true
        }
    },{
        timestamps : true
    }],
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
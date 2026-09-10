const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    unitPriceCents:{
        type:Number, 
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    lineTotalCents:{
        type:Number,
        required:true
    }
    }, 
    {
    _id:false
    })


const OrderSchema = new mongoose.Schema({

    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    orderNumber:{
        type:Number,
        required:true,
        unique:true
    },
    items:[orderItemSchema],
    subTotalCents:{
        type:Number,
        required:true
    },
    discountCents:{
        type:Number,
        required:true,
        default:0
    },
    totalCents:{
        type:Number, required:true
    },
    couponCode:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:['completed'],
        default:'completed'
    },
    idempotencyKey:{
        type:String, 
        required:true, 
        unique:true
    }
}, 
    {
    timestamps:true
    }
)
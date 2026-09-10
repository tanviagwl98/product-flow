const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
    {
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Product', 
        required:true
    },
    quantity:{
        type:Number, required:true, min:1
    }},
    {_id:true}, 
    {timestamps:true}
)

const cartSchema = new mongoose.Schema({
    status:{
        type:String, 
        enum:['open', 'checked_out'], 
        default:'open'
    }, 
    items:[cartItemSchema],
    orderId:{
        type:mongoose.Schema.Types.ObjectId, ref:'Order', default:null
    }
}, {
    timestamps:true
}
)

module.exports = mongoose.model('Cart', cartSchema)
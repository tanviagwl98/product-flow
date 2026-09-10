const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  priceCents: {
    type: Number,
    required: true,
    min:0
  },
  inventory:{
    type: Number,
    required: true,
    default: 0,
    min:0
  }
},
{timestamps:true})

module.exports = mongoose.model('Product', productSchema)
const mongoose = require('mongoose')

const Cart = require('../models/Cart')
const Product = require('../models/Product')
const ApiError = require('../utils/ApiError');

async function createCart() {
    return Cart.create({items:[]})
}

async function getCart(cartId){
    const cart = await Cart.findById(cartId).populate('items.product')
    if(!cart) throw ApiError.notFound('CART_NOT_FOUND', "Cart not found");
    return hydrate(cart)
}

async function addItem(cartId, productId, quantity) {
    if(!mongoose.isValidObjectId(productId)){
        throw ApiError.badRequest('INVALID_PRODUCT', 'productId is not a valid id')
    }

    if(!Number.isInteger(quantity) || quantity < 1){
        throw ApiError.badRequest('INVALID_QUANTITY', 'quantity must be a positive integer')
    }
}

module.exports = {createCart, getCart, addItem}
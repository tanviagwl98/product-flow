const cartService = require('../services/cart')

module.exports = {
    create: async(req,res,next) => {
        try{
            const cart = await cartService.createCart();
            res.status(201).json({id:cart._id, status:cart.status, items:[]})
        } catch(e){
            next(err)
        }
    },

    get: async(req, res, next) => {
        try{
            res.status(201).json(await cartService.getCart(req.params.id))
        } catch(err){
            next(err)
        }
    }
}
const Product = require("../models/Product")

module.exports = {
    list: async(req,res, next) => {
        try{
            res.json(await Product.find())
        } catch(e){
            next(e)
        }
    },
    get: async(req, res, next) => {
        try{
            const product = await Product.findById(req.params.id)
            if(!product){
                return res.status(400).json({error:{code:'Product_Not_Found', message:'Producy not found'}})
            }
            res.json(product)
        } catch(e){
            next(e)
        }
    }
}
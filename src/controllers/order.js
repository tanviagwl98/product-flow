const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
const checkoutService = require('../services/checkout.js');

module.exports = {
  checkout: async (req, res, next) => {
    try {
      const order = await checkoutService.checkout(req.params.id, {
        couponCode: req.body.couponCode || null,
        idempotencyKey: req.idempotencyKey,
      });
      res.status(201).json(order);
    } catch (err) { next(err); }
  },
  get: async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) throw ApiError.notFound('ORDER_NOT_FOUND', 'Order not found');
      res.json(order);
    } catch (err) { next(err); }
  },
};

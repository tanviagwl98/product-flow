const mongoose = require('mongoose');
const { Cart, Product, Order, Coupon } = require('../models');
const { nextOrderNumber } = require('../models/Counter');
const { percentOfCents } = require('../utils/money');
const ApiError = require('../utils/ApiError');

async function checkout(cartId, { couponCode, idempotencyKey }) {
  const existingOrder = await Order.findOne({ idempotencyKey });
  if (existingOrder) {
    return toOrderResponse(existingOrder);
  }

  const cart = await Cart.findById(cartId);
  if (!cart) throw ApiError.notFound('CART_NOT_FOUND', 'Cart not found');
  if (cart.status !== 'open') {
    throw ApiError.conflict('CART_ALREADY_CHECKED_OUT', 'This cart has already been checked out');
  }
  if (cart.items.length === 0) {
    throw ApiError.badRequest('EMPTY_CART', 'Cannot check out an empty cart');
  }

  const session = await mongoose.startSession();
  try {
    let orderDoc;

    await session.withTransaction(async () => {
      const orderItems = [];
      let subtotalCents = 0;

      for (const item of cart.items) {
        const product = await Product.findOneAndUpdate(
          { _id: item.product, inventory: { $gte: item.quantity } },
          { $inc: { inventory: -item.quantity } },
          { new: true, session }
        );
        if (!product) {
          throw ApiError.conflict(
            'OUT_OF_STOCK',
            `Insufficient inventory for product ${item.product}`,
            { productId: item.product }
          );
        }

        // Price is locked in at CHECKOUT time (current product price), not
        // at add-to-cart time. See DECISIONS.md for the reasoning.
        const lineTotal = product.priceCents * item.quantity;
        subtotalCents += lineTotal;
        orderItems.push({
          product: product._id,
          name: product.name,
          unitPriceCents: product.priceCents,
          quantity: item.quantity,
          lineTotalCents: lineTotal,
        });
      }

      // 3. Redeem coupon, if supplied. Conditional on status:'available' so
      // two concurrent checkouts referencing the same code can't both win.
      let discountCents = 0;
      let redeemedCoupon = null;
      if (couponCode) {
        redeemedCoupon = await Coupon.findOneAndUpdate(
          { code: couponCode, status: 'available' },
          { status: 'redeemed' },
          { new: true, session }
        );
        if (!redeemedCoupon) {
          throw ApiError.conflict(
            'COUPON_INVALID_OR_REDEEMED',
            'Coupon is invalid, unknown, or already redeemed'
          );
        }
        discountCents = percentOfCents(subtotalCents, redeemedCoupon.percentOff);
      }

      const totalCents = Math.max(subtotalCents - discountCents, 0); // never negative

      const orderNumber = await nextOrderNumber(session);

      const created = await Order.create(
        [
          {
            cart: cart._id,
            orderNumber,
            items: orderItems,
            subtotalCents,
            discountCents,
            totalCents,
            couponCode: couponCode || null,
            status: 'completed',
            idempotencyKey,
          },
        ],
        { session }
      );
      orderDoc = created[0];

      if (redeemedCoupon) {
        redeemedCoupon.redeemedByOrder = orderDoc._id;
        await redeemedCoupon.save({ session });
      }

      cart.status = 'checked_out';
      cart.orderId = orderDoc._id;
      await cart.save({ session });
    });

    return toOrderResponse(orderDoc);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.idempotencyKey) {
      const winner = await Order.findOne({ idempotencyKey });
      if (winner) return toOrderResponse(winner);
    }
    throw err;
  } finally {
    session.endSession();
  }
}

function toOrderResponse(order) {
  return {
    id: order._id,
    orderNumber: order.orderNumber,
    items: order.items,
    subtotalCents: order.subtotalCents,
    discountCents: order.discountCents,
    totalCents: order.totalCents,
    couponCode: order.couponCode,
    status: order.status,
    createdAt: order.createdAt,
  };
}

module.exports = { checkout };

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    percentOff: { type: Number, required: true },
    milestoneOrderNumber: { type: Number, required: true, unique: true }, // enforces "one coupon per milestone"
    status: { type: String, enum: ['available', 'redeemed'], default: 'available' },
    redeemedByOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);

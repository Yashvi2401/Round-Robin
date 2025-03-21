const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           description: Unique code for the coupon
 *         description:
 *           type: string
 *           description: Description of what the coupon is for
 *         discount:
 *           type: number
 *           description: Discount amount or percentage
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Date when coupon expires
 *         isActive:
 *           type: boolean
 *           description: Whether the coupon is currently active
 *           default: true
 *         isClaimed:
 *           type: boolean
 *           description: Whether the coupon has been claimed
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date when coupon was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Date when coupon was last updated
 */

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  discount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isClaimed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon; 
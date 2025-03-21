const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     ClaimHistory:
 *       type: object
 *       required:
 *         - couponId
 *         - ipAddress
 *       properties:
 *         couponId:
 *           type: string
 *           description: ID of the claimed coupon
 *         userId:
 *           type: string
 *           description: ID of the user who claimed the coupon (if registered)
 *         ipAddress:
 *           type: string
 *           description: IP address from which the coupon was claimed
 *         browserInfo:
 *           type: string
 *           description: Browser information (user agent)
 *         sessionId:
 *           type: string
 *           description: Browser session ID
 *         claimedAt:
 *           type: string
 *           format: date
 *           description: Date when coupon was claimed
 */

const claimHistorySchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ipAddress: {
    type: String,
    required: true
  },
  browserInfo: {
    type: String
  },
  sessionId: {
    type: String
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by IP address (for rate limiting)
claimHistorySchema.index({ ipAddress: 1, claimedAt: -1 });
claimHistorySchema.index({ sessionId: 1, claimedAt: -1 });

const ClaimHistory = mongoose.model('ClaimHistory', claimHistorySchema);

module.exports = ClaimHistory; 
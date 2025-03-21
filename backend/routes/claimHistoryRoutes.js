const express = require('express');
const {
  getClaimHistory,
  getClaimHistoryByIP,
  getClaimHistoryByUser,
  getClaimHistoryByCoupon,
  getUserCouponsDetailed
} = require('../controllers/claimHistoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get all claim history (admin only)
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all claim history
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/', protect, admin, getClaimHistory);

/**
 * @swagger
 * /api/history/ip/{ipAddress}:
 *   get:
 *     summary: Get claim history by IP address (admin only)
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: ipAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: IP address
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of claim history for IP
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/ip/:ipAddress', protect, admin, getClaimHistoryByIP);

/**
 * @swagger
 * /api/history/user/{userId}:
 *   get:
 *     summary: Get claim history by user ID (admin only)
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Claim history for the specified user
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/user/:userId', protect, admin, getClaimHistoryByUser);

/**
 * @swagger
 * /api/history/user/{userId}/detailed:
 *   get:
 *     summary: Get detailed coupon claim history for a user (admin only)
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed coupon information claimed by the user
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/user/:userId/detailed', protect, admin, getUserCouponsDetailed);

/**
 * @swagger
 * /api/history/coupon/{couponId}:
 *   get:
 *     summary: Get claim history by coupon ID (admin only)
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: couponId
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of claim history for coupon
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/coupon/:couponId', protect, admin, getClaimHistoryByCoupon);

module.exports = router; 
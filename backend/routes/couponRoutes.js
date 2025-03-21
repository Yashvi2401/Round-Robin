const express = require('express');
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  claimCoupon,
  getLastClaimed
} = require('../controllers/couponController');
const { protect, admin, trackIP } = require('../middlewares/authMiddleware');
const { ipRateLimit, sessionRateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons (admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all coupons
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get('/', protect, admin, getCoupons);

/**
 * @swagger
 * /api/coupons/claim:
 *   post:
 *     summary: Claim a coupon (public)
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: Coupon claimed successfully
 *       404:
 *         description: No coupons available
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/claim', trackIP, ipRateLimit, sessionRateLimit, claimCoupon);

/**
 * @swagger
 * /api/coupons/last-claimed:
 *   get:
 *     summary: Get last claimed coupon and cooldown info
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: Last claimed coupon and cooldown info
 */
router.get('/last-claimed', trackIP, getLastClaimed);

/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Get coupon by ID (admin only)
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupon details
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Coupon not found
 */
router.get('/:id', protect, admin, getCouponById);

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create a new coupon (admin only)
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Coupon with this code already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.post('/', protect, admin, createCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Update a coupon (admin only)
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Coupon with this code already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Coupon not found
 */
router.put('/:id', protect, admin, updateCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete a coupon (admin only)
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupon removed
 *       400:
 *         description: Cannot delete a coupon that has been claimed
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Coupon not found
 */
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router; 
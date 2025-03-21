const Coupon = require('../models/Coupon');
const ClaimHistory = require('../models/ClaimHistory');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all coupons (admin only)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    
    res.json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get coupon by ID (admin only)
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (coupon) {
      res.json({
        success: true,
        coupon
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
  } catch (error) {
    console.error('Get coupon by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Create a new coupon (admin only)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, description, discount, expiryDate, isActive } = req.body;

    // Check if coupon with the same code already exists
    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
      return res.status(400).json({
        success: false,
        message: 'Coupon with this code already exists'
      });
    }

    // Create new coupon
    const coupon = await Coupon.create({
      code,
      description,
      discount,
      expiryDate,
      isActive
    });

    res.status(201).json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Update a coupon (admin only)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const { code, description, discount, expiryDate, isActive } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // If code is being changed, check if the new code already exists
    if (code && code !== coupon.code) {
      const couponWithCode = await Coupon.findOne({ code });
      
      if (couponWithCode) {
        return res.status(400).json({
          success: false,
          message: 'Coupon with this code already exists'
        });
      }
    }

    // Update coupon
    coupon.code = code || coupon.code;
    coupon.description = description || coupon.description;
    coupon.discount = discount !== undefined ? discount : coupon.discount;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    const updatedCoupon = await coupon.save();

    res.json({
      success: true,
      coupon: updatedCoupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Delete a coupon (admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon has been claimed
    const claimCheck = await ClaimHistory.findOne({ couponId: coupon._id });
    
    if (claimCheck) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a coupon that has been claimed'
      });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      message: 'Coupon removed'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Claim a coupon (public)
// @route   POST /api/coupons/claim
// @access  Public
const claimCoupon = async (req, res) => {
  try {
    // Find the next available coupon (active, not claimed, not expired)
    const coupon = await Coupon.findOne({
      isActive: true,
      isClaimed: false,
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: 1 });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'No coupons available at the moment'
      });
    }

    // Mark the coupon as claimed
    coupon.isClaimed = true;
    await coupon.save();

    // Generate a session ID if not present
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
      });
    }

    // Create claim history record
    await ClaimHistory.create({
      couponId: coupon._id,
      userId: req.user ? req.user._id : null,
      ipAddress: req.clientIP,
      browserInfo: req.headers['user-agent'],
      sessionId: sessionId
    });

    res.status(200).json({
      success: true,
      message: 'Coupon claimed successfully',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount: coupon.discount,
        expiryDate: coupon.expiryDate
      }
    });
  } catch (error) {
    console.error('Claim coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get last claimed coupon and cooldown info
// @route   GET /api/coupons/last-claimed
// @access  Public
const getLastClaimed = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    const ipAddress = req.clientIP;
    const cooldownPeriod = parseInt(process.env.COOLDOWN_PERIOD) || 3600000;
    
    // Find the most recent claim by this user (via session or IP)
    const query = {};
    if (sessionId) {
      query.sessionId = sessionId;
    } else {
      query.ipAddress = ipAddress;
    }
    
    const recentClaim = await ClaimHistory.findOne(query)
      .sort({ claimedAt: -1 })
      .populate('couponId');
    
    if (!recentClaim) {
      return res.json({
        success: true,
        message: 'No claimed coupons found',
        cooldownRemaining: 0
      });
    }
    
    // Calculate remaining cooldown time
    const elapsedTime = Date.now() - recentClaim.claimedAt.getTime();
    const cooldownRemaining = Math.max(0, cooldownPeriod - elapsedTime);
    
    // Format the coupon response
    const coupon = recentClaim.couponId ? {
      code: recentClaim.couponId.code,
      description: recentClaim.couponId.description,
      discount: recentClaim.couponId.discount,
      expiryDate: recentClaim.couponId.expiryDate
    } : null;
    
    res.json({
      success: true,
      coupon,
      cooldownRemaining,
      lastClaimedAt: recentClaim.claimedAt
    });
  } catch (error) {
    console.error('Get last claimed coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  claimCoupon,
  getLastClaimed
}; 
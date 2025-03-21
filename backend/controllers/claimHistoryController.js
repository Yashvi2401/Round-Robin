const ClaimHistory = require('../models/ClaimHistory');

// @desc    Get all claim history (admin only)
// @route   GET /api/history
// @access  Private/Admin
const getClaimHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find({})
      .populate('couponId', 'code description')
      .populate('userId', 'email firstName lastName')
      .sort({ claimedAt: -1 });
    
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Get claim history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get claim history by IP address (admin only)
// @route   GET /api/history/ip/:ipAddress
// @access  Private/Admin
const getClaimHistoryByIP = async (req, res) => {
  try {
    const { ipAddress } = req.params;
    
    const history = await ClaimHistory.find({ ipAddress })
      .populate('couponId', 'code description')
      .populate('userId', 'email firstName lastName')
      .sort({ claimedAt: -1 });
    
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Get claim history by IP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get claim history by user ID (admin only)
// @route   GET /api/history/user/:userId
// @access  Private/Admin
const getClaimHistoryByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const history = await ClaimHistory.find({ userId })
      .populate('couponId', 'code description')
      .sort({ claimedAt: -1 });
    
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Get claim history by user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get claim history by coupon ID (admin only)
// @route   GET /api/history/coupon/:couponId
// @access  Private/Admin
const getClaimHistoryByCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    
    const history = await ClaimHistory.find({ couponId })
      .populate('userId', 'email firstName lastName')
      .sort({ claimedAt: -1 });
    
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Get claim history by coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Get detailed claim history by user ID with full coupon details (admin only)
// @route   GET /api/history/user/:userId/detailed
// @access  Private/Admin
const getUserCouponsDetailed = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const history = await ClaimHistory.find({ userId })
      .populate({
        path: 'couponId',
        select: 'code description discount expiryDate isActive'
      })
      .sort({ claimedAt: -1 });
    
    if (!history.length) {
      return res.json({
        success: true,
        message: 'No coupons claimed by this user',
        coupons: []
      });
    }
    
    // Format the response to include both coupon and claim details
    const coupons = history.map(claim => ({
      coupon: claim.couponId,
      claimedAt: claim.claimedAt,
      ipAddress: claim.ipAddress,
      browserInfo: claim.browserInfo
    }));
    
    res.json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    console.error('Get user coupons detailed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

module.exports = {
  getClaimHistory,
  getClaimHistoryByIP,
  getClaimHistoryByUser,
  getClaimHistoryByCoupon,
  getUserCouponsDetailed
}; 
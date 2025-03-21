const ClaimHistory = require('../models/ClaimHistory');

// Rate limit for coupon claims based on IP address
const ipRateLimit = async (req, res, next) => {
  try {
    const ipAddress = req.clientIP;
    const cooldownPeriod = parseInt(process.env.COOLDOWN_PERIOD) || 3600000; // 1 hour in milliseconds
    
    // Check if user has claimed a coupon within the cooldown period
    const recentClaim = await ClaimHistory.findOne({
      ipAddress,
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
    });

    if (recentClaim) {
      // Calculate remaining cooldown time
      const elapsedTime = Date.now() - recentClaim.claimedAt.getTime();
      const remainingTime = Math.ceil((cooldownPeriod - elapsedTime) / 60000); // in minutes
      
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Please try again after ${remainingTime} minutes.`
      });
    }
    
    next();
  } catch (error) {
    console.error('IP rate limit error:', error);
    next(error);
  }
};

// Rate limit for coupon claims based on session ID (cookies)
const sessionRateLimit = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    // If no session ID, skip this check
    if (!sessionId) {
      return next();
    }
    
    const cooldownPeriod = parseInt(process.env.COOLDOWN_PERIOD) || 3600000; // 1 hour in milliseconds
    
    // Check if session has claimed a coupon within the cooldown period
    const recentClaim = await ClaimHistory.findOne({
      sessionId,
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
    });

    if (recentClaim) {
      // Calculate remaining cooldown time
      const elapsedTime = Date.now() - recentClaim.claimedAt.getTime();
      const remainingTime = Math.ceil((cooldownPeriod - elapsedTime) / 60000); // in minutes
      
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Please try again after ${remainingTime} minutes.`
      });
    }
    
    next();
  } catch (error) {
    console.error('Session rate limit error:', error);
    next(error);
  }
};

module.exports = { ipRateLimit, sessionRateLimit }; 
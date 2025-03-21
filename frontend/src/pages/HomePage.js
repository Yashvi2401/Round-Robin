import React, { useState, useEffect } from 'react';
import { couponService } from '../services/api';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaRegCalendarAlt, FaPercentage } from 'react-icons/fa';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check for last claimed coupon and cooldown status
    const checkClaimedStatus = async () => {
      try {
        const response = await couponService.getLastClaimed();
        if (response.coupon) {
          setClaimedCoupon(response.coupon);
          if (response.cooldownRemaining > 0) {
            setCooldownRemaining(response.cooldownRemaining);
            startCooldownTimer(response.cooldownRemaining);
          }
        }
      } catch (err) {
        console.error("Failed to fetch claimed status:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkClaimedStatus();
  }, []);

  const startCooldownTimer = (initialTime) => {
    let startTime = Date.now();
    const endTime = startTime + initialTime;
    
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const remaining = endTime - currentTime;
      
      if (remaining <= 0) {
        clearInterval(timer);
        setCooldownRemaining(0);
      } else {
        setCooldownRemaining(remaining);
      }
    }, 1000);

    // Clean up the timer when component unmounts
    return () => clearInterval(timer);
  };

  const formatCooldownTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate seconds for circular progress
  const getSecondsProgress = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    return (seconds / 60) * 100;
  };

  const handleClaimCoupon = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await couponService.claimCoupon();
      setSuccessMessage(response.message);
      setClaimedCoupon(response.coupon);
      
      if (response.cooldownRemaining > 0) {
        setCooldownRemaining(response.cooldownRemaining);
        startCooldownTimer(response.cooldownRemaining);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to claim coupon. Please try again later.');
      setLoading(false);
    }
  };

  // Skeleton loader for initial page load
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded-md w-64 mx-auto mb-6"></div>
            <div className="h-32 bg-gray-200 rounded-lg w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            Welcome to Round Robin
          </motion.h1>
          <p className="text-lg text-gray-600 mb-8">
            Click the button below to claim your exclusive coupon code!
          </p>
          
          {cooldownRemaining > 0 ? (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center mb-3">
                  <FaClock className="text-amber-500 mr-2 text-xl animate-pulse" />
                  <h3 className="text-amber-800 font-semibold text-lg">Cooldown Period</h3>
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="relative w-40 h-40">
                    {/* Background circle */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#FDE68A" 
                        strokeWidth="8" 
                      />
                      {/* Progress circle with animation */}
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#F59E0B" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray="283" 
                        initial={{ strokeDashoffset: 0 }}
                        animate={{ strokeDashoffset: 283 * ((cooldownRemaining / 1000) % 60) / 60 }}
                        transition={{ ease: "linear", duration: 1 }}
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    
                    {/* Time display in center of circle */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-amber-600 text-sm mb-1">Next claim in</div>
                      <motion.div 
                        className="font-mono text-xl font-bold text-amber-700"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                      >
                        {formatCooldownTime(cooldownRemaining)}
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <div className="text-amber-700 text-sm">
                    Please wait before claiming another coupon
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaimCoupon}
              disabled={loading}
              className={`w-64 py-3 px-6 rounded-md text-white font-medium ${
                loading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Claiming...
                </span>
              ) : (
                'Get My Coupon'
              )}
            </motion.button>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 rounded-md border border-red-200"
            >
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 rounded-md border border-green-200"
            >
              <p className="text-green-600 font-medium">{successMessage}</p>
            </motion.div>
          )}

          {claimedCoupon && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-300"
            >
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
                className="text-2xl font-bold text-indigo-800 mb-4 flex items-center justify-center"
              >
                <FaTag className="mr-2" /> Your Coupon Code
              </motion.h2>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white p-3 rounded-md border border-indigo-200 inline-block"
              >
                <span className="text-xl font-mono font-semibold text-indigo-900">{claimedCoupon.code}</span>
              </motion.div>
              {claimedCoupon.description && (
                <p className="mt-3 text-indigo-600 flex items-center justify-center">
                  <span className="mr-2">📝</span>{claimedCoupon.description}
                </p>
              )}
              {claimedCoupon.discount > 0 && (
                <p className="mt-2 text-green-700 font-medium flex items-center justify-center">
                  <FaPercentage className="mr-1" />
                  Discount: {claimedCoupon.discount}%
                </p>
              )}
              <p className="mt-4 text-sm text-gray-600 flex items-center justify-center">
                <FaRegCalendarAlt className="mr-2" />
                Valid until: {new Date(claimedCoupon.expiryDate).toLocaleDateString()}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage; 
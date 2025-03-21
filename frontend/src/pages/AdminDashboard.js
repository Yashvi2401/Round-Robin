import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { couponService, historyService, userService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTag, FaHistory, FaUsers, FaPen, FaTrash, 
  FaToggleOn, FaToggleOff, FaInfoCircle, FaCalendar, 
  FaPercent, FaUserCircle, FaChevronLeft, FaSort, 
  FaSearch, FaExclamationTriangle
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('coupons');
  const [coupons, setCoupons] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCoupons, setUserCoupons] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Move hooks before any conditional returns
  useEffect(() => {
    if (user?.isAdmin) {
      if (activeTab === 'coupons') {
        fetchCoupons();
      } else if (activeTab === 'history') {
        fetchClaimHistory();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [user, activeTab]);

  // Effect to clear selected user when changing tabs
  useEffect(() => {
    setSelectedUser(null);
    setUserCoupons([]);
  }, [activeTab]);

  // If user is not admin, redirect to home
  if (!authLoading && (!user || !user.isAdmin)) {
    return <Navigate to="/" />;
  }

  const fetchCoupons = async () => {
    setDataLoading(true);
    setError('');
    try {
      const data = await couponService.getCoupons();
      setCoupons(data.coupons);
      setDataLoading(false);
    } catch (err) {
      setError('Failed to fetch coupons. Please try again.');
      setDataLoading(false);
    }
  };

  const fetchClaimHistory = async () => {
    setDataLoading(true);
    setError('');
    try {
      const data = await historyService.getClaimHistory();
      setClaimHistory(data.history);
      setDataLoading(false);
    } catch (err) {
      setError('Failed to fetch claim history. Please try again.');
      setDataLoading(false);
    }
  };

  const fetchUsers = async () => {
    setDataLoading(true);
    setError('');
    try {
      const data = await userService.getUsers();
      setUsers(data.users);
      setDataLoading(false);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      setDataLoading(false);
    }
  };

  const fetchUserCoupons = async (userId) => {
    setDataLoading(true);
    setError('');
    try {
      const data = await historyService.getUserCouponsDetailed(userId);
      setUserCoupons(data.coupons || []);
      setDataLoading(false);
    } catch (err) {
      setError('Failed to fetch user coupons. Please try again.');
      setDataLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    fetchUserCoupons(userId);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setUserCoupons([]);
  };

  const handleToggleCouponStatus = async (id, currentStatus) => {
    try {
      await couponService.updateCoupon(id, { isActive: !currentStatus });
      // Refresh coupons after update
      fetchCoupons();
    } catch (err) {
      setError('Failed to update coupon status. Please try again.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponService.deleteCoupon(id);
        // Refresh coupons after delete
        fetchCoupons();
      } catch (err) {
        setError(err.message || 'Failed to delete coupon. It may have been claimed already.');
      }
    }
  };

  const filteredUsers = searchTerm 
    ? users.filter(u => 
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : users;

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Skeleton loader for data loading
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="grid grid-cols-6 gap-4">
            <div className="h-8 bg-gray-200 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 rounded col-span-1"></div>
            <div className="h-8 bg-gray-200 rounded col-span-1"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Robin Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage coupons, view claim history, and manage users</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'coupons'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('coupons')}
          >
            <FaTag className="mr-2" /> Coupons
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory className="mr-2" /> Claim History
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers className="mr-2" /> Users
          </motion.button>
        </nav>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center"
        >
          <FaExclamationTriangle className="mr-2" /> {error}
        </motion.div>
      )}

      {/* Add New Coupon Button (only on coupons tab) */}
      {activeTab === 'coupons' && (
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/coupons/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm"
          >
            Add New Coupon
          </motion.button>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && !selectedUser && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow overflow-hidden rounded-lg"
        >
          <div className="p-4 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {dataLoading ? (
            <div className="p-10">
              <SkeletonLoader />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600">No users found{searchTerm ? ' matching your search.' : '.'}</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUserCircle className="mr-1" /> User Info
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaTag className="mr-1" /> Claimed Coupons
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" /> Last Activity
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user._id}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-800 font-medium text-lg">
                            {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* This would be populated from API, for now just a placeholder */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <FaTag className="mr-1" /> View Coupons
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUserSelect(user._id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        title="View User's Coupons"
                      >
                        <FaInfoCircle className="mr-1" /> View Coupons
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* User Details View */}
      {activeTab === 'users' && selectedUser && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow overflow-hidden rounded-lg"
        >
          <div className="p-4 border-b flex items-center">
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ x: -4 }}
              onClick={handleBackToUsers}
              className="mr-2 text-indigo-600 hover:text-indigo-800"
              title="Back to Users List"
            >
              <FaChevronLeft />
            </motion.button>
            <h2 className="text-lg font-medium">User's Claimed Coupons</h2>
          </div>
          
          {dataLoading ? (
            <div className="p-10">
              <SkeletonLoader />
            </div>
          ) : userCoupons.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600">This user hasn't claimed any coupons yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaTag className="mr-1" /> Coupon Code
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaInfoCircle className="mr-1" /> Description
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaPercent className="mr-1" /> Discount
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaCalendar className="mr-1" /> Claimed At
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userCoupons.map((item, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {item.coupon?.code || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.coupon?.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.coupon?.discount ? `${item.coupon.discount}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(item.claimedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.coupon?.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.coupon?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Coupons Table */}
      {activeTab === 'coupons' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow overflow-hidden rounded-lg"
        >
          {dataLoading ? (
            <div className="p-10">
              <SkeletonLoader />
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600">No coupons available. Add a new coupon to get started.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaTag className="mr-1" /> Code
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaInfoCircle className="mr-1" /> Description
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaPercent className="mr-1" /> Discount
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" /> Expiry Date
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <motion.tr 
                    key={coupon._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{coupon.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{coupon.discount}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          coupon.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {coupon.isClaimed && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Claimed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleCouponStatus(coupon._id, coupon.isActive)}
                          className={coupon.isActive ? 'text-red-600' : 'text-green-600'}
                          title={coupon.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                        >
                          {coupon.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            to={`/admin/coupons/edit/${coupon._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Coupon"
                          >
                            <FaPen />
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Coupon"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* Claim History Table */}
      {activeTab === 'history' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow overflow-hidden rounded-lg"
        >
          {dataLoading ? (
            <div className="p-10">
              <SkeletonLoader />
            </div>
          ) : claimHistory.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600">No claim history available.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaTag className="mr-1" /> Coupon
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaUserCircle className="mr-1" /> User
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" /> Claimed At
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {claimHistory.map((item) => (
                    <motion.tr 
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.couponId ? (
                          <span className="font-medium">{item.couponId.code}</span>
                        ) : (
                          'Unknown Coupon'
                        )}
                        {item.couponId && item.couponId.description && (
                          <p className="text-xs text-gray-500 mt-1">{item.couponId.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.userId ? (
                          <div>
                            <div className="font-medium">
                              {item.userId.firstName} {item.userId.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{item.userId.email}</div>
                          </div>
                        ) : (
                          'Anonymous User'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(item.claimedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.ipAddress || 'Unknown'}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard; 
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { couponService } from '../services/api';

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: 0,
    expiryDate: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Move all useEffect hooks before any conditionals
  useEffect(() => {
    // Set default expiry date to 30 days from now
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    // Format the date as YYYY-MM-DD for input[type="date"]
    const formattedDate = thirtyDaysFromNow.toISOString().split('T')[0];
    
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        expiryDate: formattedDate
      }));
      setInitialDataLoaded(true);
    }
  }, [isEditMode]);

  // Fetch coupon data if in edit mode
  useEffect(() => {
    if (isEditMode && user?.isAdmin) {
      const fetchCoupon = async () => {
        setLoading(true);
        try {
          const data = await couponService.getCouponById(id);
          const coupon = data.coupon;
          // Format the expiry date for the date input
          const expiryDate = new Date(coupon.expiryDate).toISOString().split('T')[0];
          
          setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discount: coupon.discount || 0,
            expiryDate,
            isActive: coupon.isActive
          });
          
          setInitialDataLoaded(true);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch coupon data. Please try again.');
          setLoading(false);
        }
      };
      
      fetchCoupon();
    }
  }, [id, isEditMode, user]);

  // Redirect if not admin
  if (!authLoading && (!user || !user.isAdmin)) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await couponService.updateCoupon(id, formData);
      } else {
        await couponService.createCoupon(formData);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to save coupon. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading || (isEditMode && !initialDataLoaded)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Coupon Code*
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. SUMMER20"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Description of what this coupon offers"
            ></textarea>
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Coupon' : 'Create Coupon'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm; 
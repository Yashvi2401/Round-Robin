const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User email address
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         password:
 *           type: string
 *           description: User password (hashed)
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user is an admin
 *           default: false
 *         ipAddress:
 *           type: string
 *           description: User's registration IP address
 *         lastLogin:
 *           type: string
 *           format: date
 *           description: Date of user's last login
 *         loginHistory:
 *           type: array
 *           description: History of user logins with IP addresses
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date when user was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Date when user was last updated
 */

const loginHistorySchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters long']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  loginHistory: [loginHistorySchema]
}, {
  timestamps: true
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
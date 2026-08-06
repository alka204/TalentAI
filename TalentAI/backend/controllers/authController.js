const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { uploadBufferToCloudinary } = require('../services/cloudinaryService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond with success to avoid leaking which emails are registered
  if (!user) {
    return res.json({ success: true, message: 'If that account exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // TODO: wire up a real email service (e.g. Nodemailer/SendGrid) in a later phase.
  console.log(`Password reset token for ${email}: ${resetToken}`);

  res.json({ success: true, message: 'If that account exists, a reset link has been sent.' });
});

// @desc    Update the current user's profile (name only — email is immutable)
// @route   PATCH /api/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Name cannot be empty');
  }

  req.user.name = name.trim();
  await req.user.save();

  res.json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Upload/replace the current user's profile photo
// @route   POST /api/auth/me/photo
// @access  Private
const updatePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  const { url } = await uploadBufferToCloudinary(req.file.buffer, 'talentai/avatars', 'image');

  req.user.photo = url;
  await req.user.save();

  res.json({ success: true, user: req.user.toSafeObject() });
});

module.exports = { register, login, getMe, forgotPassword, updateProfile, updatePhoto };

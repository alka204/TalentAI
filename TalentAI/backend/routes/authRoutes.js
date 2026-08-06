const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, forgotPassword, updateProfile, updatePhoto } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const uploadImage = require('../middleware/uploadImageMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('A valid email is required')],
  validateRequest,
  forgotPassword
);

router.get('/me', protect, getMe);

router.patch(
  '/me',
  protect,
  [body('name').trim().notEmpty().withMessage('Name cannot be empty')],
  validateRequest,
  updateProfile
);

router.post('/me/photo', protect, uploadImage.single('photo'), updatePhoto);

module.exports = router;

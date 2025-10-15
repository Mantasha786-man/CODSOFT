const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user profile (public)
router.get('/:id', userController.getUserProfile);

// Update user profile (authenticated user only)
router.put('/:id', authenticate, userController.updateUserProfile);

// Get current user profile
router.get('/me/profile', authenticate, userController.getCurrentUser);

module.exports = router;

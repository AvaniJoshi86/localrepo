const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile (already in auth routes)
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  res.redirect('/api/auth/profile');
});

module.exports = router;
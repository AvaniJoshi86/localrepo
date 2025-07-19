const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress
// @desc    Get user's skin progress tracking
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Progress tracking coming soon'
  });
});

module.exports = router;
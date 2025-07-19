const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/routines
// @desc    Get user's skincare routines
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Routine management coming soon'
  });
});

module.exports = router;
const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/samples
// @desc    Get sample recommendations
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Smart sampling system coming soon'
  });
});

module.exports = router;
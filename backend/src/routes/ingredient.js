const express = require('express');

const router = express.Router();

// @route   GET /api/ingredients
// @desc    Get ingredient information
// @access  Public
router.get('/', async (req, res) => {
  res.json({
    success: true,
    message: 'Ingredient intelligence coming soon'
  });
});

module.exports = router;
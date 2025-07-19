const express = require('express');
const router = express.Router();

// POST /api/skin-analysis/quiz
router.post('/quiz', (req, res) => {
  res.json({ message: 'Skin analysis quiz endpoint - coming soon' });
});

// POST /api/skin-analysis/photo
router.post('/photo', (req, res) => {
  res.json({ message: 'Photo analysis endpoint - coming soon' });
});

module.exports = router;
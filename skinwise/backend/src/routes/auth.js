const express = require('express');
const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - coming soon' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - coming soon' });
});

module.exports = router;
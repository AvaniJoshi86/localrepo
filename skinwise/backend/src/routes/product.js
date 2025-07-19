const express = require('express');
const router = express.Router();

// GET /api/products
router.get('/', (req, res) => {
  res.json({ 
    message: 'Products endpoint',
    products: []
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  res.json({ 
    message: 'Product detail endpoint - coming soon',
    productId: req.params.id
  });
});

module.exports = router;
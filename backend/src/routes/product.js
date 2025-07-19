const express = require('express');
const { query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get products with filtering, sorting, and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment', 'mask', 'eye_care', 'lip_care', 'tool', 'exfoliant', 'oil']),
  query('skin_type').optional().isIn(['oily', 'dry', 'combination', 'sensitive', 'normal', 'all']),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_low', 'price_high', 'rating', 'popularity', 'newest'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { status: 'active' };

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Skin type filter
    if (req.query.skin_type && req.query.skin_type !== 'all') {
      query['suitability.skin_types'] = { $in: [req.query.skin_type, 'all'] };
    }

    // Skin concerns filter
    if (req.query.concerns) {
      const concerns = req.query.concerns.split(',');
      query['suitability.skin_concerns'] = { $in: concerns };
    }

    // Price range filter
    if (req.query.min_price || req.query.max_price) {
      query['price.selling_price'] = {};
      if (req.query.min_price) {
        query['price.selling_price'].$gte = parseFloat(req.query.min_price);
      }
      if (req.query.max_price) {
        query['price.selling_price'].$lte = parseFloat(req.query.max_price);
      }
    }

    // Brand filter
    if (req.query.brands) {
      const brands = req.query.brands.split(',');
      query.brand = { $in: brands };
    }

    // Property filters
    if (req.query.fragrance_free === 'true') {
      query['properties.fragrance'] = 'fragrance_free';
    }

    if (req.query.natural === 'true') {
      query['properties.is_natural'] = true;
    }

    if (req.query.vegan === 'true') {
      query['properties.is_vegan'] = true;
    }

    // Search filter
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case 'price_low':
        sort = { 'price.selling_price': 1 };
        break;
      case 'price_high':
        sort = { 'price.selling_price': -1 };
        break;
      case 'rating':
        sort = { 'ratings.average': -1, 'ratings.count': -1 };
        break;
      case 'popularity':
        sort = { sales_count: -1, 'ratings.count': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { featured: -1, 'ratings.average': -1, sales_count: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-ingredient_list -clinical_studies')
      .lean();

    const total = await Product.countDocuments(query);

    // Add personalized scores if user is authenticated
    if (req.user && req.user.skinProfile) {
      products.forEach(product => {
        product.compatibility_score = calculateCompatibilityScore(product, req.user.skinProfile);
      });
    }

    // Get filter options for frontend
    const filterOptions = await getFilterOptions();

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit,
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1
        },
        filters: filterOptions
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      status: 'active',
      featured: true
    })
      .sort({ 'ratings.average': -1, sales_count: -1 })
      .limit(limit)
      .select('-ingredient_list -clinical_studies')
      .lean();

    res.json({
      success: true,
      data: {
        products
      }
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products'
    });
  }
});

// @route   GET /api/products/recommended
// @desc    Get personalized product recommendations
// @access  Private
router.get('/recommended', authenticateToken, async (req, res) => {
  try {
    const userProfile = req.user.skinProfile;
    
    if (!userProfile || userProfile.skinType === 'unknown') {
      return res.status(400).json({
        success: false,
        message: 'Please complete your skin profile to get personalized recommendations'
      });
    }

    const limit = parseInt(req.query.limit) || 12;

    // Build recommendation query
    const query = {
      status: 'active',
      'suitability.skin_types': { $in: [userProfile.skinType, 'all'] }
    };

    // Add skin concerns filter
    if (userProfile.skinConcerns && userProfile.skinConcerns.length > 0) {
      query['suitability.skin_concerns'] = { $in: userProfile.skinConcerns };
    }

    // Add preference filters
    if (req.user.preferences) {
      if (req.user.preferences.fragrance_free) {
        query['properties.fragrance'] = 'fragrance_free';
      }

      if (req.user.preferences.natural_preference) {
        query['properties.is_natural'] = true;
      }

      // Budget filter
      if (req.user.preferences.budget_range) {
        const budgetRanges = {
          'under_1000': 1000,
          '1000_3000': 3000,
          '3000_5000': 5000,
          '5000_10000': 10000,
          'above_10000': Infinity
        };
        const maxBudget = budgetRanges[req.user.preferences.budget_range];
        if (maxBudget !== Infinity) {
          query['price.selling_price'] = { $lte: maxBudget };
        }
      }
    }

    const products = await Product.find(query)
      .sort({ 'ratings.average': -1, sales_count: -1 })
      .limit(limit)
      .select('-ingredient_list -clinical_studies')
      .lean();

    // Calculate compatibility scores
    const recommendedProducts = products.map(product => ({
      ...product,
      compatibility_score: calculateCompatibilityScore(product, userProfile),
      recommendation_reason: generateRecommendationReason(product, userProfile)
    })).sort((a, b) => b.compatibility_score - a.compatibility_score);

    res.json({
      success: true,
      data: {
        products: recommendedProducts,
        user_profile: {
          skin_type: userProfile.skinType,
          skin_concerns: userProfile.skinConcerns,
          preferences: req.user.preferences
        }
      }
    });

  } catch (error) {
    console.error('Get recommended products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching personalized recommendations'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get products grouped by category
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment'];
    const productsByCategory = {};

    for (const category of categories) {
      const products = await Product.find({
        status: 'active',
        category: category
      })
        .sort({ 'ratings.average': -1, sales_count: -1 })
        .limit(6)
        .select('name brand price images category ratings')
        .lean();

      productsByCategory[category] = products;
    }

    res.json({
      success: true,
      data: productsByCategory
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product categories'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: 'active'
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add compatibility score if user is authenticated
    if (req.user && req.user.skinProfile) {
      product.compatibility_score = calculateCompatibilityScore(product, req.user.skinProfile);
      product.recommendation_reason = generateRecommendationReason(product, req.user.skinProfile);
      product.is_suitable = product.compatibility_score >= 60;
    }

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      'suitability.skin_types': { $in: product.suitability.skin_types },
      status: 'active'
    })
      .sort({ 'ratings.average': -1 })
      .limit(4)
      .select('name brand price images category ratings')
      .lean();

    // Get alternative products (different brands, same category)
    const alternatives = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      brand: { $ne: product.brand },
      'suitability.skin_concerns': { $in: product.suitability.skin_concerns },
      status: 'active'
    })
      .sort({ 'ratings.average': -1 })
      .limit(4)
      .select('name brand price images category ratings')
      .lean();

    res.json({
      success: true,
      data: {
        product,
        related_products: relatedProducts,
        alternatives
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product details'
    });
  }
});

// @route   GET /api/products/:id/ingredients
// @desc    Get detailed ingredient analysis for a product
// @access  Public
router.get('/:id/ingredients', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: 'active'
    }).select('name ingredients ingredient_list key_ingredients interactions').lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Categorize ingredients
    const categorizedIngredients = {
      actives: product.ingredients.filter(ing => ing.function.includes('active')),
      moisturizers: product.ingredients.filter(ing => 
        ing.function.includes('emollient') || ing.function.includes('humectant')
      ),
      preservatives: product.ingredients.filter(ing => ing.function.includes('preservative')),
      others: product.ingredients.filter(ing => 
        !ing.function.includes('active') && 
        !ing.function.includes('emollient') && 
        !ing.function.includes('humectant') && 
        !ing.function.includes('preservative')
      )
    };

    res.json({
      success: true,
      data: {
        product_name: product.name,
        key_ingredients: product.key_ingredients,
        ingredient_list: product.ingredient_list,
        categorized_ingredients: categorizedIngredients,
        interactions: product.interactions
      }
    });

  } catch (error) {
    console.error('Get product ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ingredient details'
    });
  }
});

// @route   POST /api/products/:id/compare
// @desc    Compare products ingredients and suitability
// @access  Public
router.post('/:id/compare', [
  query('with').isMongoId().withMessage('Comparison product ID must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const [product1, product2] = await Promise.all([
      Product.findOne({ _id: req.params.id, status: 'active' }).lean(),
      Product.findOne({ _id: req.query.with, status: 'active' }).lean()
    ]);

    if (!product1 || !product2) {
      return res.status(404).json({
        success: false,
        message: 'One or more products not found'
      });
    }

    // Compare key aspects
    const comparison = {
      products: [
        {
          id: product1._id,
          name: product1.name,
          brand: product1.brand,
          price: product1.price,
          ratings: product1.ratings
        },
        {
          id: product2._id,
          name: product2.name,
          brand: product2.brand,
          price: product2.price,
          ratings: product2.ratings
        }
      ],
      comparison: {
        price_difference: product1.price.selling_price - product2.price.selling_price,
        rating_difference: product1.ratings.average - product2.ratings.average,
        shared_ingredients: findSharedIngredients(product1.ingredients, product2.ingredients),
        unique_ingredients: {
          product1: findUniqueIngredients(product1.ingredients, product2.ingredients),
          product2: findUniqueIngredients(product2.ingredients, product1.ingredients)
        },
        skin_type_suitability: {
          product1: product1.suitability.skin_types,
          product2: product2.suitability.skin_types
        },
        concerns_addressed: {
          product1: product1.suitability.skin_concerns,
          product2: product2.suitability.skin_concerns
        }
      }
    };

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    console.error('Product comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing products'
    });
  }
});

// Helper functions
function calculateCompatibilityScore(product, userProfile) {
  let score = 0;
  const maxScore = 100;

  // Skin type compatibility (40 points)
  if (product.suitability.skin_types.includes('all')) {
    score += 40;
  } else if (product.suitability.skin_types.includes(userProfile.skinType)) {
    score += 40;
  } else if (userProfile.skinType === 'combination' && 
            (product.suitability.skin_types.includes('oily') || 
             product.suitability.skin_types.includes('dry'))) {
    score += 25;
  }

  // Skin concerns match (40 points)
  if (userProfile.skinConcerns && userProfile.skinConcerns.length > 0) {
    const concernMatches = userProfile.skinConcerns.filter(concern =>
      product.suitability.skin_concerns.includes(concern)
    ).length;
    score += Math.min(40, concernMatches * 10);
  }

  // Product properties alignment (20 points)
  if (product.dermatologist_approved) score += 5;
  if (product.properties.is_natural) score += 3;
  if (product.properties.fragrance === 'fragrance_free') score += 3;
  if (product.ratings.average >= 4) score += 5;
  if (product.ratings.count >= 100) score += 4;

  return Math.min(score, maxScore);
}

function generateRecommendationReason(product, userProfile) {
  const reasons = [];

  if (product.suitability.skin_types.includes(userProfile.skinType)) {
    reasons.push(`Perfect for ${userProfile.skinType} skin`);
  }

  if (userProfile.skinConcerns) {
    const matchingConcerns = userProfile.skinConcerns.filter(concern =>
      product.suitability.skin_concerns.includes(concern)
    );
    if (matchingConcerns.length > 0) {
      reasons.push(`Addresses ${matchingConcerns.join(', ')}`);
    }
  }

  if (product.dermatologist_approved) {
    reasons.push('Dermatologist approved');
  }

  if (product.ratings.average >= 4.5) {
    reasons.push('Highly rated by users');
  }

  return reasons.length > 0 ? reasons.join('. ') + '.' : 'Good general option for your skin type.';
}

async function getFilterOptions() {
  try {
    const [brands, priceRange] = await Promise.all([
      Product.distinct('brand', { status: 'active' }),
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            min_price: { $min: '$price.selling_price' },
            max_price: { $max: '$price.selling_price' }
          }
        }
      ])
    ]);

    return {
      brands: brands.sort(),
      price_range: priceRange[0] || { min_price: 0, max_price: 10000 },
      categories: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment', 'mask'],
      skin_types: ['oily', 'dry', 'combination', 'sensitive', 'normal'],
      skin_concerns: ['acne', 'dark_spots', 'wrinkles', 'dullness', 'large_pores', 'redness', 'sensitivity']
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {};
  }
}

function findSharedIngredients(ingredients1, ingredients2) {
  const names1 = ingredients1.map(ing => ing.name.toLowerCase());
  const names2 = ingredients2.map(ing => ing.name.toLowerCase());
  
  return ingredients1.filter(ing => 
    names2.includes(ing.name.toLowerCase())
  );
}

function findUniqueIngredients(ingredients1, ingredients2) {
  const names2 = ingredients2.map(ing => ing.name.toLowerCase());
  
  return ingredients1.filter(ing => 
    !names2.includes(ing.name.toLowerCase())
  );
}

module.exports = router;
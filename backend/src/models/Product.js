const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  inci_name: String, // International Nomenclature of Cosmetic Ingredients
  concentration: {
    percentage: Number,
    range: String // e.g., "1-3%", "10-15%"
  },
  function: [{
    type: String,
    enum: ['active', 'emollient', 'humectant', 'preservative', 'fragrance', 'colorant', 'emulsifier', 'thickener', 'pH_adjuster', 'antioxidant', 'penetration_enhancer']
  }],
  benefits: [String],
  warnings: [String],
  safety_rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
});

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment', 'mask', 'eye_care', 'lip_care', 'tool', 'exfoliant', 'oil']
  },
  subcategory: {
    type: String,
    // Will vary by category
  },
  
  // Product Details
  description: {
    type: String,
    required: true
  },
  short_description: {
    type: String,
    maxlength: 200
  },
  key_benefits: [String],
  how_to_use: {
    type: String,
    required: true
  },
  
  // Pricing
  price: {
    mrp: {
      type: Number,
      required: true
    },
    selling_price: {
      type: Number,
      required: true
    },
    discount_percentage: {
      type: Number,
      default: 0
    }
  },
  
  // Variants
  variants: [{
    size: {
      value: Number,
      unit: {
        type: String,
        enum: ['ml', 'g', 'oz', 'pieces']
      }
    },
    price: {
      mrp: Number,
      selling_price: Number
    },
    sku: String,
    stock: {
      type: Number,
      default: 0
    }
  }],
  
  // Ingredients
  ingredients: [ingredientSchema],
  key_ingredients: [String], // Highlighted ingredients
  ingredient_list: String, // Full INCI list as text
  
  // Suitability
  suitability: {
    skin_types: [{
      type: String,
      enum: ['oily', 'dry', 'combination', 'sensitive', 'normal', 'all']
    }],
    skin_concerns: [{
      type: String,
      enum: ['acne', 'dark_spots', 'wrinkles', 'dullness', 'large_pores', 'redness', 'blackheads', 'uneven_texture', 'dark_circles', 'sensitivity', 'sun_protection']
    }],
    age_groups: [{
      type: String,
      enum: ['teens', 'twenties', 'thirties', 'forties', 'fifties_plus', 'all']
    }],
    climate: [{
      type: String,
      enum: ['humid', 'dry', 'tropical', 'temperate', 'cold', 'all']
    }]
  },
  
  // Product Properties
  properties: {
    texture: {
      type: String,
      enum: ['gel', 'cream', 'lotion', 'oil', 'foam', 'powder', 'liquid', 'balm', 'serum']
    },
    finish: {
      type: String,
      enum: ['matte', 'dewy', 'natural', 'glossy', 'satin']
    },
    fragrance: {
      type: String,
      enum: ['fragrance_free', 'lightly_scented', 'strongly_scented']
    },
    ph_level: {
      type: Number,
      min: 0,
      max: 14
    },
    is_comedogenic: {
      type: Boolean,
      default: false
    },
    is_natural: {
      type: Boolean,
      default: false
    },
    is_organic: {
      type: Boolean,
      default: false
    },
    is_vegan: {
      type: Boolean,
      default: false
    },
    is_cruelty_free: {
      type: Boolean,
      default: false
    },
    spf_value: Number // For sunscreens
  },
  
  // Usage Guidelines
  usage: {
    frequency: {
      type: String,
      enum: ['daily', 'twice_daily', 'weekly', 'as_needed', 'alternate_days']
    },
    time_of_day: [{
      type: String,
      enum: ['morning', 'evening', 'anytime']
    }],
    order_in_routine: {
      type: Number,
      min: 1,
      max: 10
    },
    patch_test_required: {
      type: Boolean,
      default: false
    },
    sun_sensitivity: {
      type: Boolean,
      default: false
    }
  },
  
  // Interactions & Warnings
  interactions: {
    avoid_with: [String], // Ingredients to avoid mixing
    layering_tips: [String],
    warnings: [String]
  },
  
  // Media
  images: [{
    url: String,
    alt_text: String,
    type: {
      type: String,
      enum: ['main', 'ingredient', 'texture', 'packaging', 'before_after']
    },
    order: Number
  }],
  videos: [{
    url: String,
    title: String,
    type: {
      type: String,
      enum: ['demo', 'review', 'tutorial']
    }
  }],
  
  // Reviews & Ratings
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      five_star: { type: Number, default: 0 },
      four_star: { type: Number, default: 0 },
      three_star: { type: Number, default: 0 },
      two_star: { type: Number, default: 0 },
      one_star: { type: Number, default: 0 }
    }
  },
  
  // Professional Info
  dermatologist_approved: {
    type: Boolean,
    default: false
  },
  clinical_studies: [{
    title: String,
    description: String,
    results: String,
    url: String
  }],
  certifications: [String],
  
  // Inventory & Sales
  sku: {
    type: String,
    unique: true,
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  low_stock_threshold: {
    type: Number,
    default: 10
  },
  sales_count: {
    type: Number,
    default: 0
  },
  
  // SEO & Discovery
  tags: [String],
  search_keywords: [String],
  meta_title: String,
  meta_description: String,
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Sample Availability
  sample_available: {
    type: Boolean,
    default: false
  },
  sample_price: Number,
  sample_size: {
    value: Number,
    unit: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ 'suitability.skin_types': 1 });
productSchema.index({ 'suitability.skin_concerns': 1 });
productSchema.index({ 'price.selling_price': 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: -1 });
productSchema.index({ createdAt: -1 });

// Calculate discount percentage before saving
productSchema.pre('save', function(next) {
  if (this.price.mrp && this.price.selling_price) {
    this.price.discount_percentage = Math.round(
      ((this.price.mrp - this.price.selling_price) / this.price.mrp) * 100
    );
  }
  next();
});

// Method to check if product is suitable for user
productSchema.methods.isSuitableForUser = function(userSkinProfile) {
  const { skinType, skinConcerns } = userSkinProfile;
  
  // Check skin type compatibility
  const skinTypeMatch = this.suitability.skin_types.includes('all') || 
                       this.suitability.skin_types.includes(skinType);
  
  // Check if product addresses user's concerns
  const concernMatch = skinConcerns.some(concern => 
    this.suitability.skin_concerns.includes(concern)
  );
  
  return skinTypeMatch && concernMatch;
};

// Method to calculate compatibility score
productSchema.methods.calculateCompatibilityScore = function(userProfile) {
  let score = 0;
  const maxScore = 100;
  
  // Skin type compatibility (30 points)
  if (this.suitability.skin_types.includes('all')) {
    score += 30;
  } else if (this.suitability.skin_types.includes(userProfile.skinType)) {
    score += 30;
  } else if (userProfile.skinType === 'combination' && 
            (this.suitability.skin_types.includes('oily') || 
             this.suitability.skin_types.includes('dry'))) {
    score += 20;
  }
  
  // Skin concerns match (40 points)
  const concernMatches = userProfile.skinConcerns.filter(concern =>
    this.suitability.skin_concerns.includes(concern)
  ).length;
  score += Math.min(40, concernMatches * 10);
  
  // Preference alignment (30 points)
  if (userProfile.preferences) {
    // Natural preference
    if (userProfile.preferences.natural_preference && this.properties.is_natural) {
      score += 10;
    }
    
    // Fragrance preference
    if (userProfile.preferences.fragrance_free && 
        this.properties.fragrance === 'fragrance_free') {
      score += 10;
    }
    
    // Budget compatibility
    const budgetRanges = {
      'under_1000': 1000,
      '1000_3000': 3000,
      '3000_5000': 5000,
      '5000_10000': 10000,
      'above_10000': Infinity
    };
    
    const userMaxBudget = budgetRanges[userProfile.preferences.budget_range];
    if (this.price.selling_price <= userMaxBudget) {
      score += 10;
    }
  }
  
  return Math.min(score, maxScore);
};

// Virtual for display price
productSchema.virtual('displayPrice').get(function() {
  return {
    original: this.price.mrp,
    discounted: this.price.selling_price,
    savings: this.price.mrp - this.price.selling_price,
    discount_percentage: this.price.discount_percentage
  };
});

// Virtual for availability status
productSchema.virtual('availabilityStatus').get(function() {
  if (this.status !== 'active') return this.status;
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.low_stock_threshold) return 'low_stock';
  return 'in_stock';
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema);
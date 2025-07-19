const mongoose = require('mongoose');

const skinAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Analysis Type
  analysis_type: {
    type: String,
    enum: ['quiz', 'photo', 'combined'],
    required: true
  },
  
  // Quiz Results
  quiz_responses: {
    // Skin Type Questions
    skin_feel_morning: {
      type: String,
      enum: ['tight_dry', 'comfortable', 'slightly_oily', 'very_oily']
    },
    skin_feel_evening: {
      type: String,
      enum: ['tight_dry', 'comfortable', 'slightly_oily', 'very_oily']
    },
    pore_visibility: {
      type: String,
      enum: ['barely_visible', 'visible_t_zone', 'visible_face', 'very_prominent']
    },
    breakout_frequency: {
      type: String,
      enum: ['never', 'rarely', 'occasionally', 'frequently']
    },
    skin_sensitivity: {
      type: String,
      enum: ['not_sensitive', 'slightly_sensitive', 'sensitive', 'very_sensitive']
    },
    reaction_to_products: {
      type: String,
      enum: ['no_reaction', 'occasional_irritation', 'frequent_irritation', 'severe_reactions']
    },
    
    // Environmental Factors
    climate: {
      type: String,
      enum: ['humid', 'dry', 'tropical', 'temperate', 'cold']
    },
    sun_exposure: {
      type: String,
      enum: ['minimal', 'moderate', 'high', 'very_high']
    },
    indoor_environment: {
      type: String,
      enum: ['air_conditioned', 'heated', 'natural', 'humid']
    },
    
    // Lifestyle Factors
    stress_level: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    sleep_quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    diet_quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    water_intake: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    exercise_frequency: {
      type: String,
      enum: ['none', 'occasional', 'regular', 'daily']
    },
    
    // Current Routine
    current_routine_steps: {
      type: Number,
      min: 0,
      max: 15
    },
    routine_consistency: {
      type: String,
      enum: ['never', 'sometimes', 'usually', 'always']
    },
    product_types_used: [{
      type: String,
      enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment', 'mask', 'exfoliant']
    }],
    
    // Concerns & Goals
    primary_concerns: [{
      type: String,
      enum: ['acne', 'dark_spots', 'wrinkles', 'dullness', 'large_pores', 'redness', 'blackheads', 'uneven_texture', 'dark_circles', 'sensitivity']
    }],
    skin_goals: [{
      type: String,
      enum: ['clear_skin', 'anti_aging', 'hydration', 'brightness', 'even_tone', 'minimize_pores', 'oil_control', 'sensitivity_relief']
    }],
    
    // Budget & Preferences
    budget_comfort: {
      type: String,
      enum: ['under_1000', '1000_3000', '3000_5000', '5000_10000', 'above_10000']
    },
    routine_complexity_preference: {
      type: String,
      enum: ['minimal', 'moderate', 'advanced']
    },
    ingredient_preferences: {
      natural_preference: Boolean,
      fragrance_free: Boolean,
      vegan_preference: Boolean,
      specific_interests: [String]
    }
  },
  
  // Photo Analysis
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['front_face', 'left_profile', 'right_profile', 'close_up_concerns']
    },
    lighting_conditions: {
      type: String,
      enum: ['natural', 'artificial', 'mixed']
    },
    analysis_metadata: {
      image_quality: Number,
      face_detection_confidence: Number,
      skin_area_percentage: Number
    }
  }],
  
  // AI Analysis Results
  ai_analysis: {
    // Skin Type Determination
    predicted_skin_type: {
      primary: {
        type: String,
        enum: ['oily', 'dry', 'combination', 'sensitive', 'normal']
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      secondary_characteristics: [String]
    },
    
    // Detailed Skin Metrics
    skin_metrics: {
      hydration_level: {
        score: { type: Number, min: 0, max: 100 },
        description: String,
        recommendations: [String]
      },
      oiliness_level: {
        score: { type: Number, min: 0, max: 100 },
        t_zone_score: Number,
        cheek_score: Number,
        description: String
      },
      sensitivity_indicators: {
        score: { type: Number, min: 0, max: 100 },
        risk_factors: [String],
        precautions: [String]
      },
      pore_analysis: {
        visibility_score: { type: Number, min: 0, max: 100 },
        size_distribution: {
          small: Number,
          medium: Number,
          large: Number
        },
        problem_areas: [String]
      },
      pigmentation_analysis: {
        dark_spots_detected: Boolean,
        melasma_indicators: Boolean,
        hyperpigmentation_score: { type: Number, min: 0, max: 100 },
        affected_areas: [String]
      },
      aging_analysis: {
        fine_lines_score: { type: Number, min: 0, max: 100 },
        wrinkle_depth: { type: Number, min: 0, max: 100 },
        elasticity_score: { type: Number, min: 0, max: 100 },
        problem_areas: [String]
      },
      acne_analysis: {
        severity_score: { type: Number, min: 0, max: 100 },
        type_distribution: {
          blackheads: Number,
          whiteheads: Number,
          papules: Number,
          pustules: Number
        },
        affected_zones: [String]
      }
    },
    
    // Overall Assessment
    overall_assessment: {
      skin_health_score: {
        type: Number,
        min: 0,
        max: 100
      },
      improvement_potential: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      timeline_expectations: {
        short_term: String, // 2-4 weeks
        medium_term: String, // 2-3 months
        long_term: String // 6+ months
      }
    }
  },
  
  // Recommendations Generated
  recommendations: {
    // Product Recommendations
    products: [{
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      category: String,
      priority: {
        type: String,
        enum: ['essential', 'recommended', 'optional']
      },
      confidence_score: Number,
      reasoning: String,
      expected_benefits: [String]
    }],
    
    // Routine Recommendations
    routine: {
      morning: [{
        step: Number,
        category: String,
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        instructions: String,
        timing: String
      }],
      evening: [{
        step: Number,
        category: String,
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        instructions: String,
        timing: String
      }],
      weekly: [{
        frequency: String,
        category: String,
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        instructions: String
      }]
    },
    
    // Lifestyle Recommendations
    lifestyle_tips: [{
      category: {
        type: String,
        enum: ['diet', 'hydration', 'sleep', 'stress', 'environment', 'sun_protection']
      },
      recommendation: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }],
    
    // Ingredient Recommendations
    ingredients: {
      beneficial: [{
        name: String,
        benefits: [String],
        usage_notes: String
      }],
      to_avoid: [{
        name: String,
        reason: String,
        severity: {
          type: String,
          enum: ['caution', 'avoid', 'strict_avoid']
        }
      }]
    }
  },
  
  // Follow-up & Tracking
  follow_up: {
    next_analysis_date: Date,
    tracking_metrics: [String],
    progress_photos_needed: Boolean,
    routine_adjustment_needed: Boolean
  },
  
  // Validation & Quality
  analysis_quality: {
    completeness_score: {
      type: Number,
      min: 0,
      max: 100
    },
    confidence_level: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    manual_review_required: {
      type: Boolean,
      default: false
    },
    dermatologist_consultation_recommended: {
      type: Boolean,
      default: false
    }
  },
  
  // Professional Review
  professional_review: {
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Dermatologist user
    },
    review_date: Date,
    adjustments_made: [String],
    additional_notes: String,
    approved: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
skinAnalysisSchema.index({ user: 1, createdAt: -1 });
skinAnalysisSchema.index({ 'ai_analysis.predicted_skin_type.primary': 1 });
skinAnalysisSchema.index({ 'analysis_quality.confidence_level': 1 });
skinAnalysisSchema.index({ 'professional_review.approved': 1 });

// Method to calculate overall compatibility score
skinAnalysisSchema.methods.calculateOverallScore = function() {
  const metrics = this.ai_analysis.skin_metrics;
  let totalScore = 0;
  let validMetrics = 0;
  
  if (metrics.hydration_level && metrics.hydration_level.score) {
    totalScore += metrics.hydration_level.score;
    validMetrics++;
  }
  
  if (metrics.oiliness_level && metrics.oiliness_level.score) {
    totalScore += (100 - metrics.oiliness_level.score); // Inverted for balance
    validMetrics++;
  }
  
  if (metrics.sensitivity_indicators && metrics.sensitivity_indicators.score) {
    totalScore += (100 - metrics.sensitivity_indicators.score); // Inverted
    validMetrics++;
  }
  
  if (metrics.acne_analysis && metrics.acne_analysis.severity_score) {
    totalScore += (100 - metrics.acne_analysis.severity_score); // Inverted
    validMetrics++;
  }
  
  return validMetrics > 0 ? Math.round(totalScore / validMetrics) : 0;
};

// Method to get prioritized concerns
skinAnalysisSchema.methods.getPrioritizedConcerns = function() {
  const concerns = [];
  const metrics = this.ai_analysis.skin_metrics;
  
  if (metrics.acne_analysis && metrics.acne_analysis.severity_score > 30) {
    concerns.push({
      type: 'acne',
      severity: metrics.acne_analysis.severity_score,
      priority: 'high'
    });
  }
  
  if (metrics.sensitivity_indicators && metrics.sensitivity_indicators.score > 60) {
    concerns.push({
      type: 'sensitivity',
      severity: metrics.sensitivity_indicators.score,
      priority: 'high'
    });
  }
  
  if (metrics.hydration_level && metrics.hydration_level.score < 40) {
    concerns.push({
      type: 'dehydration',
      severity: 100 - metrics.hydration_level.score,
      priority: 'medium'
    });
  }
  
  if (metrics.pigmentation_analysis && metrics.pigmentation_analysis.hyperpigmentation_score > 50) {
    concerns.push({
      type: 'pigmentation',
      severity: metrics.pigmentation_analysis.hyperpigmentation_score,
      priority: 'medium'
    });
  }
  
  return concerns.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority] || b.severity - a.severity;
  });
};

module.exports = mongoose.model('SkinAnalysis', skinAnalysisSchema);
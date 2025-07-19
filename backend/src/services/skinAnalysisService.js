const Product = require('../models/Product');

// Simulated AI analysis for quiz responses
const analyzeQuizResponses = async (quizResponses) => {
  // In a real application, this would connect to an AI service
  // For now, we'll implement rule-based analysis
  
  const analysis = {
    predicted_skin_type: {
      primary: determineSkinType(quizResponses),
      confidence: calculateSkinTypeConfidence(quizResponses),
      secondary_characteristics: []
    },
    skin_metrics: {
      hydration_level: {
        score: calculateHydrationScore(quizResponses),
        description: '',
        recommendations: []
      },
      oiliness_level: {
        score: calculateOilinessScore(quizResponses),
        t_zone_score: 0,
        cheek_score: 0,
        description: ''
      },
      sensitivity_indicators: {
        score: calculateSensitivityScore(quizResponses),
        risk_factors: [],
        precautions: []
      },
      pore_analysis: {
        visibility_score: calculatePoreVisibility(quizResponses),
        size_distribution: { small: 40, medium: 40, large: 20 },
        problem_areas: []
      },
      acne_analysis: {
        severity_score: calculateAcneScore(quizResponses),
        type_distribution: {
          blackheads: 30,
          whiteheads: 25,
          papules: 25,
          pustules: 20
        },
        affected_zones: []
      },
      aging_analysis: {
        fine_lines_score: 20, // Low for younger demographic
        wrinkle_depth: 15,
        elasticity_score: 85,
        problem_areas: []
      },
      pigmentation_analysis: {
        dark_spots_detected: false,
        melasma_indicators: false,
        hyperpigmentation_score: 25,
        affected_areas: []
      }
    },
    overall_assessment: {
      skin_health_score: 0,
      improvement_potential: 'medium',
      timeline_expectations: {
        short_term: 'Improved hydration and reduced irritation within 2-4 weeks',
        medium_term: 'Clearer skin and better texture within 2-3 months',
        long_term: 'Significant improvement in overall skin health within 6+ months'
      }
    }
  };

  // Calculate overall skin health score
  analysis.overall_assessment.skin_health_score = calculateOverallHealthScore(analysis.skin_metrics);

  // Add descriptions and recommendations
  addDescriptionsAndRecommendations(analysis, quizResponses);

  return analysis;
};

// Simulated AI analysis for photos
const analyzeSkinnessFromPhotos = async (photos) => {
  // In a real application, this would use computer vision APIs
  // For demo purposes, we'll generate realistic-looking analysis
  
  const analysis = {
    predicted_skin_type: {
      primary: 'combination', // Default for photo analysis
      confidence: 0.75,
      secondary_characteristics: ['oily_t_zone', 'normal_cheeks']
    },
    skin_metrics: {
      hydration_level: {
        score: Math.floor(Math.random() * 40) + 40, // 40-80
        description: 'Moderate hydration levels detected',
        recommendations: ['Use a hydrating serum', 'Apply moisturizer twice daily']
      },
      oiliness_level: {
        score: Math.floor(Math.random() * 60) + 20, // 20-80
        t_zone_score: Math.floor(Math.random() * 40) + 50,
        cheek_score: Math.floor(Math.random() * 30) + 20,
        description: 'Elevated oil production in T-zone area'
      },
      sensitivity_indicators: {
        score: Math.floor(Math.random() * 30) + 10, // 10-40
        risk_factors: ['environmental_stress', 'product_reactions'],
        precautions: ['Patch test new products', 'Avoid harsh ingredients']
      },
      pore_analysis: {
        visibility_score: Math.floor(Math.random() * 50) + 30, // 30-80
        size_distribution: {
          small: Math.floor(Math.random() * 30) + 30,
          medium: Math.floor(Math.random() * 40) + 30,
          large: Math.floor(Math.random() * 30) + 10
        },
        problem_areas: ['nose', 'chin', 'forehead']
      },
      acne_analysis: {
        severity_score: Math.floor(Math.random() * 60) + 10, // 10-70
        type_distribution: {
          blackheads: Math.floor(Math.random() * 40) + 20,
          whiteheads: Math.floor(Math.random() * 30) + 15,
          papules: Math.floor(Math.random() * 25) + 10,
          pustules: Math.floor(Math.random() * 20) + 5
        },
        affected_zones: ['t_zone', 'jawline']
      },
      pigmentation_analysis: {
        dark_spots_detected: Math.random() > 0.6,
        melasma_indicators: Math.random() > 0.8,
        hyperpigmentation_score: Math.floor(Math.random() * 40) + 10,
        affected_areas: ['cheeks', 'forehead']
      },
      aging_analysis: {
        fine_lines_score: Math.floor(Math.random() * 30) + 10,
        wrinkle_depth: Math.floor(Math.random() * 25) + 5,
        elasticity_score: Math.floor(Math.random() * 30) + 60,
        problem_areas: ['eye_area', 'mouth_corners']
      }
    },
    overall_assessment: {
      skin_health_score: 0,
      improvement_potential: 'high',
      timeline_expectations: {
        short_term: 'Visible reduction in oiliness and improved texture within 2-4 weeks',
        medium_term: 'Clearer pores and reduced breakouts within 2-3 months',
        long_term: 'Significantly improved skin clarity and health within 6+ months'
      }
    }
  };

  // Calculate overall health score
  analysis.overall_assessment.skin_health_score = calculateOverallHealthScore(analysis.skin_metrics);

  return analysis;
};

// Generate product and routine recommendations
const generateRecommendations = async (analysis, user) => {
  const skinType = analysis.predicted_skin_type.primary;
  const concerns = extractConcerns(analysis);
  const userPreferences = user.preferences || {};

  // Get suitable products for each category
  const products = await getRecommendedProducts(skinType, concerns, userPreferences);

  // Build routine recommendations
  const routine = buildRoutineRecommendations(products, analysis, userPreferences);

  // Generate lifestyle recommendations
  const lifestyleTips = generateLifestyleTips(analysis, user);

  // Generate ingredient recommendations
  const ingredients = generateIngredientRecommendations(analysis, userPreferences);

  return {
    products,
    routine,
    lifestyle_tips: lifestyleTips,
    ingredients
  };
};

// Helper functions for quiz analysis
function determineSkinType(responses) {
  let oilyScore = 0;
  let dryScore = 0;
  let sensitiveScore = 0;

  // Analyze morning skin feel
  if (responses.skin_feel_morning === 'very_oily') oilyScore += 3;
  else if (responses.skin_feel_morning === 'slightly_oily') oilyScore += 2;
  else if (responses.skin_feel_morning === 'tight_dry') dryScore += 3;

  // Analyze evening skin feel
  if (responses.skin_feel_evening === 'very_oily') oilyScore += 2;
  else if (responses.skin_feel_evening === 'slightly_oily') oilyScore += 1;
  else if (responses.skin_feel_evening === 'tight_dry') dryScore += 2;

  // Analyze pore visibility
  if (responses.pore_visibility === 'very_prominent') oilyScore += 3;
  else if (responses.pore_visibility === 'visible_face') oilyScore += 2;
  else if (responses.pore_visibility === 'barely_visible') dryScore += 2;

  // Analyze sensitivity
  if (responses.skin_sensitivity === 'very_sensitive') sensitiveScore += 3;
  else if (responses.skin_sensitivity === 'sensitive') sensitiveScore += 2;
  else if (responses.reaction_to_products === 'severe_reactions') sensitiveScore += 3;

  // Determine primary skin type
  if (sensitiveScore >= 4) return 'sensitive';
  if (oilyScore > dryScore + 2) return 'oily';
  if (dryScore > oilyScore + 2) return 'dry';
  if (oilyScore > 2 && dryScore > 2) return 'combination';
  return 'normal';
}

function calculateSkinTypeConfidence(responses) {
  const answeredQuestions = Object.keys(responses).length;
  const relevantQuestions = ['skin_feel_morning', 'skin_feel_evening', 'pore_visibility', 'skin_sensitivity'];
  const relevantAnswered = relevantQuestions.filter(q => responses[q]).length;
  
  return Math.min(0.95, (relevantAnswered / relevantQuestions.length) * 0.8 + 0.2);
}

function calculateHydrationScore(responses) {
  let score = 50; // Base score
  
  if (responses.skin_feel_morning === 'tight_dry') score -= 20;
  if (responses.skin_feel_evening === 'tight_dry') score -= 15;
  if (responses.water_intake === 'low') score -= 10;
  if (responses.water_intake === 'high') score += 15;
  if (responses.indoor_environment === 'air_conditioned') score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateOilinessScore(responses) {
  let score = 30; // Base score
  
  if (responses.skin_feel_morning === 'very_oily') score += 30;
  if (responses.skin_feel_morning === 'slightly_oily') score += 20;
  if (responses.skin_feel_evening === 'very_oily') score += 25;
  if (responses.pore_visibility === 'very_prominent') score += 20;
  if (responses.pore_visibility === 'visible_face') score += 15;
  
  return Math.max(0, Math.min(100, score));
}

function calculateSensitivityScore(responses) {
  let score = 10; // Base score
  
  if (responses.skin_sensitivity === 'very_sensitive') score += 40;
  if (responses.skin_sensitivity === 'sensitive') score += 30;
  if (responses.skin_sensitivity === 'slightly_sensitive') score += 15;
  if (responses.reaction_to_products === 'severe_reactions') score += 35;
  if (responses.reaction_to_products === 'frequent_irritation') score += 25;
  if (responses.stress_level === 'high') score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculatePoreVisibility(responses) {
  if (responses.pore_visibility === 'very_prominent') return 80;
  if (responses.pore_visibility === 'visible_face') return 60;
  if (responses.pore_visibility === 'visible_t_zone') return 40;
  if (responses.pore_visibility === 'barely_visible') return 15;
  return 30; // Default
}

function calculateAcneScore(responses) {
  let score = 10; // Base score
  
  if (responses.breakout_frequency === 'frequently') score += 40;
  if (responses.breakout_frequency === 'occasionally') score += 25;
  if (responses.breakout_frequency === 'rarely') score += 10;
  if (responses.stress_level === 'high') score += 15;
  if (responses.diet_quality === 'poor') score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateOverallHealthScore(metrics) {
  const scores = [
    metrics.hydration_level?.score || 50,
    100 - (metrics.oiliness_level?.score || 50), // Inverted
    100 - (metrics.sensitivity_indicators?.score || 30), // Inverted
    100 - (metrics.acne_analysis?.severity_score || 20), // Inverted
    100 - (metrics.pore_analysis?.visibility_score || 40), // Inverted
  ];
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function addDescriptionsAndRecommendations(analysis, responses) {
  const hydration = analysis.skin_metrics.hydration_level;
  if (hydration.score < 40) {
    hydration.description = 'Your skin shows signs of dehydration';
    hydration.recommendations = [
      'Use a hydrating serum with hyaluronic acid',
      'Apply moisturizer on damp skin',
      'Increase water intake'
    ];
  } else if (hydration.score > 70) {
    hydration.description = 'Your skin appears well-hydrated';
    hydration.recommendations = [
      'Maintain current hydration routine',
      'Use a lightweight moisturizer'
    ];
  } else {
    hydration.description = 'Your skin has moderate hydration levels';
    hydration.recommendations = [
      'Use a daily moisturizer',
      'Consider a hydrating serum'
    ];
  }

  const sensitivity = analysis.skin_metrics.sensitivity_indicators;
  if (sensitivity.score > 60) {
    sensitivity.risk_factors = ['harsh_products', 'environmental_stress', 'fragrance'];
    sensitivity.precautions = [
      'Always patch test new products',
      'Avoid products with alcohol and strong fragrances',
      'Introduce new products gradually'
    ];
  }
}

function extractConcerns(analysis) {
  const concerns = [];
  
  if (analysis.skin_metrics.acne_analysis?.severity_score > 30) {
    concerns.push('acne');
  }
  if (analysis.skin_metrics.hydration_level?.score < 40) {
    concerns.push('dullness');
  }
  if (analysis.skin_metrics.sensitivity_indicators?.score > 50) {
    concerns.push('sensitivity');
  }
  if (analysis.skin_metrics.pore_analysis?.visibility_score > 60) {
    concerns.push('large_pores');
  }
  if (analysis.skin_metrics.pigmentation_analysis?.hyperpigmentation_score > 40) {
    concerns.push('dark_spots');
  }
  
  return concerns;
}

async function getRecommendedProducts(skinType, concerns, userPreferences) {
  const query = {
    status: 'active',
    'suitability.skin_types': { $in: [skinType, 'all'] }
  };

  if (concerns.length > 0) {
    query['suitability.skin_concerns'] = { $in: concerns };
  }

  // Add preference filters
  if (userPreferences.fragrance_free) {
    query['properties.fragrance'] = 'fragrance_free';
  }

  if (userPreferences.natural_preference) {
    query['properties.is_natural'] = true;
  }

  if (userPreferences.budget_range) {
    const budgetRanges = {
      'under_1000': 1000,
      '1000_3000': 3000,
      '3000_5000': 5000,
      '5000_10000': 10000,
      'above_10000': Infinity
    };
    const maxBudget = budgetRanges[userPreferences.budget_range];
    if (maxBudget !== Infinity) {
      query['price.selling_price'] = { $lte: maxBudget };
    }
  }

  const products = await Product.find(query)
    .sort({ 'ratings.average': -1, sales_count: -1 })
    .limit(20);

  // Categorize products
  const categorizedProducts = {};
  ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment'].forEach(category => {
    categorizedProducts[category] = products
      .filter(p => p.category === category)
      .slice(0, 3)
      .map(product => ({
        product_id: product._id,
        category: product.category,
        priority: determinePriority(product, concerns),
        confidence_score: product.calculateCompatibilityScore({ skinType, skinConcerns: concerns }),
        reasoning: generateRecommendationReasoning(product, skinType, concerns),
        expected_benefits: product.key_benefits.slice(0, 3)
      }));
  });

  return categorizedProducts;
}

function buildRoutineRecommendations(products, analysis, preferences) {
  const complexity = preferences.routine_complexity || 'minimal';
  
  const morningSteps = [];
  const eveningSteps = [];
  const weeklySteps = [];

  // Morning routine
  if (products.cleanser?.[0]) {
    morningSteps.push({
      step: 1,
      category: 'cleanser',
      product_id: products.cleanser[0].product_id,
      instructions: 'Gently massage onto damp skin for 30 seconds, then rinse with lukewarm water',
      timing: 'AM'
    });
  }

  if (products.serum?.[0] && complexity !== 'minimal') {
    morningSteps.push({
      step: 2,
      category: 'serum',
      product_id: products.serum[0].product_id,
      instructions: 'Apply 2-3 drops to clean skin and gently pat in',
      timing: 'AM'
    });
  }

  if (products.moisturizer?.[0]) {
    morningSteps.push({
      step: complexity === 'minimal' ? 2 : 3,
      category: 'moisturizer',
      product_id: products.moisturizer[0].product_id,
      instructions: 'Apply evenly to face and neck',
      timing: 'AM'
    });
  }

  if (products.sunscreen?.[0]) {
    morningSteps.push({
      step: morningSteps.length + 1,
      category: 'sunscreen',
      product_id: products.sunscreen[0].product_id,
      instructions: 'Apply generously 15 minutes before sun exposure',
      timing: 'AM'
    });
  }

  // Evening routine (more comprehensive)
  if (products.cleanser?.[0]) {
    eveningSteps.push({
      step: 1,
      category: 'cleanser',
      product_id: products.cleanser[0].product_id,
      instructions: 'Double cleanse if wearing makeup or sunscreen',
      timing: 'PM'
    });
  }

  if (products.treatment?.[0] && complexity === 'advanced') {
    eveningSteps.push({
      step: 2,
      category: 'treatment',
      product_id: products.treatment[0].product_id,
      instructions: 'Use every other night initially, then build up to daily use',
      timing: 'PM'
    });
  }

  if (products.moisturizer?.[0]) {
    eveningSteps.push({
      step: eveningSteps.length + 1,
      category: 'moisturizer',
      product_id: products.moisturizer[0].product_id,
      instructions: 'Apply to slightly damp skin for better absorption',
      timing: 'PM'
    });
  }

  return {
    morning: morningSteps,
    evening: eveningSteps,
    weekly: weeklySteps
  };
}

function generateLifestyleTips(analysis, user) {
  const tips = [];

  if (analysis.skin_metrics.hydration_level?.score < 50) {
    tips.push({
      category: 'hydration',
      recommendation: 'Drink at least 8 glasses of water daily and use a humidifier in dry environments',
      priority: 'high'
    });
  }

  if (analysis.skin_metrics.acne_analysis?.severity_score > 40) {
    tips.push({
      category: 'diet',
      recommendation: 'Limit dairy and high-glycemic foods, increase omega-3 rich foods',
      priority: 'medium'
    });
  }

  tips.push({
    category: 'sleep',
    recommendation: 'Aim for 7-9 hours of quality sleep and change pillowcases regularly',
    priority: 'medium'
  });

  tips.push({
    category: 'sun_protection',
    recommendation: 'Wear sunscreen daily and reapply every 2 hours when outdoors',
    priority: 'high'
  });

  return tips;
}

function generateIngredientRecommendations(analysis, preferences) {
  const beneficial = [];
  const toAvoid = [];

  // Beneficial ingredients based on analysis
  if (analysis.skin_metrics.hydration_level?.score < 50) {
    beneficial.push({
      name: 'Hyaluronic Acid',
      benefits: ['Deep hydration', 'Plumping effect', 'Suitable for all skin types'],
      usage_notes: 'Apply to damp skin for maximum effectiveness'
    });
  }

  if (analysis.skin_metrics.acne_analysis?.severity_score > 30) {
    beneficial.push({
      name: 'Salicylic Acid',
      benefits: ['Unclogs pores', 'Reduces inflammation', 'Prevents breakouts'],
      usage_notes: 'Start with 0.5% concentration and use sunscreen'
    });
  }

  // Ingredients to avoid based on sensitivity
  if (analysis.skin_metrics.sensitivity_indicators?.score > 50) {
    toAvoid.push({
      name: 'Alcohol (Denat.)',
      reason: 'Can cause dryness and irritation in sensitive skin',
      severity: 'avoid'
    });

    toAvoid.push({
      name: 'Strong Fragrances',
      reason: 'Common cause of allergic reactions and irritation',
      severity: 'caution'
    });
  }

  return { beneficial, to_avoid: toAvoid };
}

function determinePriority(product, concerns) {
  const productConcerns = product.suitability.skin_concerns || [];
  const matchingConcerns = concerns.filter(c => productConcerns.includes(c));
  
  if (matchingConcerns.length >= 2) return 'essential';
  if (matchingConcerns.length === 1) return 'recommended';
  return 'optional';
}

function generateRecommendationReasoning(product, skinType, concerns) {
  const reasons = [];
  
  if (product.suitability.skin_types.includes(skinType)) {
    reasons.push(`Perfect for ${skinType} skin`);
  }
  
  const matchingConcerns = concerns.filter(c => 
    product.suitability.skin_concerns.includes(c)
  );
  
  if (matchingConcerns.length > 0) {
    reasons.push(`Addresses ${matchingConcerns.join(', ')}`);
  }
  
  if (product.dermatologist_approved) {
    reasons.push('Dermatologist approved');
  }
  
  return reasons.join('. ');
}

module.exports = {
  analyzeQuizResponses,
  analyzeSkinnessFromPhotos,
  generateRecommendations
};
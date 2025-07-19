const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const SkinAnalysis = require('../models/SkinAnalysis');
const Product = require('../models/Product');
const { authenticateToken, requireProfileCompletion } = require('../middleware/auth');
const { analyzeSkinnessFromPhotos, analyzeQuizResponses, generateRecommendations } = require('../services/skinAnalysisService');

const router = express.Router();

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/skin-analysis/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `skin-photo-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create uploads directory if it doesn't exist
const ensureUploadDir = async () => {
  try {
    await fs.mkdir('uploads/skin-analysis', { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
};
ensureUploadDir();

// @route   POST /api/skin-analysis/quiz
// @desc    Submit skin analysis quiz
// @access  Private
router.post('/quiz', authenticateToken, [
  body('quiz_responses').isObject().withMessage('Quiz responses must be an object'),
  body('quiz_responses.skin_feel_morning').optional().isIn(['tight_dry', 'comfortable', 'slightly_oily', 'very_oily']),
  body('quiz_responses.skin_feel_evening').optional().isIn(['tight_dry', 'comfortable', 'slightly_oily', 'very_oily']),
  body('quiz_responses.pore_visibility').optional().isIn(['barely_visible', 'visible_t_zone', 'visible_face', 'very_prominent']),
  body('quiz_responses.breakout_frequency').optional().isIn(['never', 'rarely', 'occasionally', 'frequently']),
  body('quiz_responses.skin_sensitivity').optional().isIn(['not_sensitive', 'slightly_sensitive', 'sensitive', 'very_sensitive'])
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

    const { quiz_responses } = req.body;

    // Analyze quiz responses using AI service
    const aiAnalysis = await analyzeQuizResponses(quiz_responses);

    // Generate product and routine recommendations
    const recommendations = await generateRecommendations(aiAnalysis, req.user);

    // Create skin analysis record
    const skinAnalysis = new SkinAnalysis({
      user: req.user._id,
      analysis_type: 'quiz',
      quiz_responses,
      ai_analysis: aiAnalysis,
      recommendations,
      analysis_quality: {
        completeness_score: calculateQuizCompleteness(quiz_responses),
        confidence_level: determineConfidenceLevel(quiz_responses),
        manual_review_required: false
      }
    });

    await skinAnalysis.save();

    // Update user's skin profile based on analysis
    await updateUserSkinProfile(req.user, aiAnalysis);

    res.status(201).json({
      success: true,
      message: 'Skin analysis completed successfully',
      data: {
        analysis: skinAnalysis,
        recommendations: recommendations
      }
    });

  } catch (error) {
    console.error('Quiz analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing skin analysis quiz'
    });
  }
});

// @route   POST /api/skin-analysis/photos
// @desc    Upload and analyze skin photos
// @access  Private
router.post('/photos', authenticateToken, upload.array('photos', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one photo is required'
      });
    }

    const processedPhotos = [];

    // Process each uploaded photo
    for (const file of req.files) {
      try {
        // Resize and optimize image
        const optimizedPath = file.path.replace(path.extname(file.path), '-optimized' + path.extname(file.path));
        
        await sharp(file.path)
          .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(optimizedPath);

        processedPhotos.push({
          url: `/uploads/skin-analysis/${path.basename(optimizedPath)}`,
          type: req.body.photoTypes?.[processedPhotos.length] || 'front_face',
          lighting_conditions: req.body.lightingConditions?.[processedPhotos.length] || 'natural',
          analysis_metadata: {
            image_quality: 85,
            face_detection_confidence: 0.9, // This would come from actual AI analysis
            skin_area_percentage: 75
          }
        });

        // Remove original file
        await fs.unlink(file.path);
      } catch (imageError) {
        console.error('Error processing image:', imageError);
      }
    }

    // Analyze photos using AI service
    const photoAnalysis = await analyzeSkinnessFromPhotos(processedPhotos);

    // Generate recommendations based on photo analysis
    const recommendations = await generateRecommendations(photoAnalysis, req.user);

    // Create skin analysis record
    const skinAnalysis = new SkinAnalysis({
      user: req.user._id,
      analysis_type: 'photo',
      photos: processedPhotos,
      ai_analysis: photoAnalysis,
      recommendations,
      analysis_quality: {
        completeness_score: calculatePhotoCompleteness(processedPhotos),
        confidence_level: 'medium',
        manual_review_required: photoAnalysis.overall_assessment?.skin_health_score < 50
      }
    });

    await skinAnalysis.save();

    // Update user's skin profile
    await updateUserSkinProfile(req.user, photoAnalysis);

    res.status(201).json({
      success: true,
      message: 'Photo analysis completed successfully',
      data: {
        analysis: skinAnalysis,
        recommendations: recommendations
      }
    });

  } catch (error) {
    console.error('Photo analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing photo analysis'
    });
  }
});

// @route   POST /api/skin-analysis/combined
// @desc    Submit combined quiz and photo analysis
// @access  Private
router.post('/combined', authenticateToken, upload.array('photos', 4), [
  body('quiz_responses').isObject().withMessage('Quiz responses must be an object')
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

    const { quiz_responses } = req.body;
    let processedPhotos = [];

    // Process photos if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const optimizedPath = file.path.replace(path.extname(file.path), '-optimized' + path.extname(file.path));
          
          await sharp(file.path)
            .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(optimizedPath);

          processedPhotos.push({
            url: `/uploads/skin-analysis/${path.basename(optimizedPath)}`,
            type: req.body.photoTypes?.[processedPhotos.length] || 'front_face',
            lighting_conditions: req.body.lightingConditions?.[processedPhotos.length] || 'natural',
            analysis_metadata: {
              image_quality: 85,
              face_detection_confidence: 0.9,
              skin_area_percentage: 75
            }
          });

          await fs.unlink(file.path);
        } catch (imageError) {
          console.error('Error processing image:', imageError);
        }
      }
    }

    // Combine quiz and photo analysis
    const quizAnalysis = await analyzeQuizResponses(quiz_responses);
    const photoAnalysis = processedPhotos.length > 0 ? await analyzeSkinnessFromPhotos(processedPhotos) : null;

    // Merge analyses for more accurate results
    const combinedAnalysis = mergeSkinAnalyses(quizAnalysis, photoAnalysis);

    // Generate comprehensive recommendations
    const recommendations = await generateRecommendations(combinedAnalysis, req.user);

    // Create skin analysis record
    const skinAnalysis = new SkinAnalysis({
      user: req.user._id,
      analysis_type: 'combined',
      quiz_responses,
      photos: processedPhotos,
      ai_analysis: combinedAnalysis,
      recommendations,
      analysis_quality: {
        completeness_score: Math.max(
          calculateQuizCompleteness(quiz_responses),
          calculatePhotoCompleteness(processedPhotos)
        ),
        confidence_level: 'high',
        manual_review_required: false
      }
    });

    await skinAnalysis.save();

    // Update user's skin profile
    await updateUserSkinProfile(req.user, combinedAnalysis);

    res.status(201).json({
      success: true,
      message: 'Combined skin analysis completed successfully',
      data: {
        analysis: skinAnalysis,
        recommendations: recommendations
      }
    });

  } catch (error) {
    console.error('Combined analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing combined skin analysis'
    });
  }
});

// @route   GET /api/skin-analysis/history
// @desc    Get user's skin analysis history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await SkinAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recommendations.products.product_id', 'name brand price images category');

    const total = await SkinAnalysis.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        analyses,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });

  } catch (error) {
    console.error('Get analysis history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis history'
    });
  }
});

// @route   GET /api/skin-analysis/:id
// @desc    Get specific skin analysis
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const analysis = await SkinAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('recommendations.products.product_id');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Skin analysis not found'
      });
    }

    res.json({
      success: true,
      data: {
        analysis
      }
    });

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skin analysis'
    });
  }
});

// @route   GET /api/skin-analysis/latest/recommendations
// @desc    Get recommendations from latest analysis
// @access  Private
router.get('/latest/recommendations', authenticateToken, async (req, res) => {
  try {
    const latestAnalysis = await SkinAnalysis.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('recommendations.products.product_id', 'name brand price images category suitability');

    if (!latestAnalysis) {
      return res.status(404).json({
        success: false,
        message: 'No skin analysis found. Please complete a skin analysis first.'
      });
    }

    res.json({
      success: true,
      data: {
        recommendations: latestAnalysis.recommendations,
        analysis_date: latestAnalysis.createdAt,
        skin_type: latestAnalysis.ai_analysis.predicted_skin_type,
        concerns: latestAnalysis.getPrioritizedConcerns()
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations'
    });
  }
});

// Helper functions
function calculateQuizCompleteness(quizResponses) {
  const totalQuestions = 15; // Adjust based on your quiz structure
  const answeredQuestions = Object.keys(quizResponses).length;
  return Math.round((answeredQuestions / totalQuestions) * 100);
}

function calculatePhotoCompleteness(photos) {
  const recommendedPhotoTypes = ['front_face', 'left_profile', 'right_profile', 'close_up_concerns'];
  const providedTypes = photos.map(p => p.type);
  const uniqueTypes = [...new Set(providedTypes)];
  return Math.round((uniqueTypes.length / recommendedPhotoTypes.length) * 100);
}

function determineConfidenceLevel(quizResponses) {
  const completeness = calculateQuizCompleteness(quizResponses);
  if (completeness >= 80) return 'high';
  if (completeness >= 60) return 'medium';
  return 'low';
}

function mergeSkinAnalyses(quizAnalysis, photoAnalysis) {
  if (!photoAnalysis) return quizAnalysis;
  
  // Combine the two analyses with weighted averaging
  const merged = { ...quizAnalysis };
  
  if (photoAnalysis.skin_metrics && quizAnalysis.skin_metrics) {
    // Average the metrics with quiz having 40% weight and photos having 60% weight
    const quizWeight = 0.4;
    const photoWeight = 0.6;
    
    Object.keys(quizAnalysis.skin_metrics).forEach(metric => {
      if (photoAnalysis.skin_metrics[metric] && photoAnalysis.skin_metrics[metric].score) {
        merged.skin_metrics[metric].score = Math.round(
          (quizAnalysis.skin_metrics[metric].score * quizWeight) +
          (photoAnalysis.skin_metrics[metric].score * photoWeight)
        );
      }
    });
  }
  
  return merged;
}

async function updateUserSkinProfile(user, analysis) {
  try {
    if (analysis.predicted_skin_type?.primary) {
      user.skinProfile.skinType = analysis.predicted_skin_type.primary;
    }
    
    // Update skin concerns based on analysis
    const detectedConcerns = [];
    if (analysis.skin_metrics?.acne_analysis?.severity_score > 30) {
      detectedConcerns.push('acne');
    }
    if (analysis.skin_metrics?.pigmentation_analysis?.hyperpigmentation_score > 50) {
      detectedConcerns.push('dark_spots');
    }
    if (analysis.skin_metrics?.hydration_level?.score < 40) {
      detectedConcerns.push('dullness');
    }
    
    if (detectedConcerns.length > 0) {
      user.skinProfile.skinConcerns = [...new Set([...user.skinProfile.skinConcerns, ...detectedConcerns])];
    }
    
    await user.save();
  } catch (error) {
    console.error('Error updating user skin profile:', error);
  }
}

module.exports = router;
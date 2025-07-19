const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  
  // Skin Profile
  skinProfile: {
    skinType: {
      type: String,
      enum: ['oily', 'dry', 'combination', 'sensitive', 'normal', 'unknown'],
      default: 'unknown'
    },
    skinConcerns: [{
      type: String,
      enum: ['acne', 'dark_spots', 'wrinkles', 'dullness', 'large_pores', 'redness', 'blackheads', 'uneven_texture', 'dark_circles', 'sensitivity']
    }],
    skinTone: {
      type: String,
      enum: ['very_fair', 'fair', 'light', 'medium', 'tan', 'deep', 'very_deep']
    },
    climateFactor: {
      type: String,
      enum: ['humid', 'dry', 'tropical', 'temperate', 'cold']
    },
    lifestyleFactors: {
      stress_level: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      sleep_hours: {
        type: Number,
        min: 3,
        max: 12
      },
      water_intake: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      exercise_frequency: {
        type: String,
        enum: ['none', 'occasional', 'regular', 'daily']
      },
      smoking: {
        type: Boolean,
        default: false
      },
      alcohol_consumption: {
        type: String,
        enum: ['none', 'occasional', 'moderate', 'frequent']
      }
    }
  },
  
  // Preferences
  preferences: {
    budget_range: {
      type: String,
      enum: ['under_1000', '1000_3000', '3000_5000', '5000_10000', 'above_10000'],
      default: 'under_1000'
    },
    routine_complexity: {
      type: String,
      enum: ['minimal', 'moderate', 'advanced'],
      default: 'minimal'
    },
    ingredient_preferences: {
      preferred: [{
        type: String
      }],
      avoided: [{
        type: String
      }]
    },
    natural_preference: {
      type: Boolean,
      default: false
    },
    fragrance_free: {
      type: Boolean,
      default: false
    }
  },
  
  // Skin Analysis History
  skinAnalysisHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    photos: [{
      url: String,
      type: {
        type: String,
        enum: ['front', 'left', 'right', 'close_up']
      }
    }],
    analysis_results: {
      hydration_level: Number,
      oiliness_level: Number,
      sensitivity_score: Number,
      aging_signs: Number,
      acne_severity: Number,
      pore_visibility: Number,
      pigmentation_issues: Number
    },
    recommendations: [{
      category: String,
      products: [String],
      confidence_score: Number
    }]
  }],
  
  // Address Information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    firstName: String,
    lastName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  
  // Account Settings
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'dermatologist'],
    default: 'user'
  },
  
  // Marketing Preferences
  marketing: {
    email_notifications: {
      type: Boolean,
      default: true
    },
    sms_notifications: {
      type: Boolean,
      default: false
    },
    promotional_emails: {
      type: Boolean,
      default: true
    },
    routine_reminders: {
      type: Boolean,
      default: true
    }
  },
  
  // Metadata
  lastLogin: Date,
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'skinProfile.skinType': 1 });
userSchema.index({ 'skinProfile.skinConcerns': 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completeness
userSchema.methods.calculateProfileCompleteness = function() {
  let score = 0;
  const checks = [
    this.firstName && this.lastName, // 10
    this.phone, // 5
    this.dateOfBirth, // 5
    this.skinProfile.skinType !== 'unknown', // 20
    this.skinProfile.skinConcerns.length > 0, // 15
    this.skinProfile.skinTone, // 10
    this.skinProfile.climateFactor, // 5
    this.preferences.budget_range, // 10
    this.preferences.routine_complexity, // 10
    this.addresses.length > 0, // 10
  ];
  
  const weights = [10, 5, 5, 20, 15, 10, 5, 10, 10, 10];
  
  checks.forEach((check, index) => {
    if (check) score += weights[index];
  });
  
  this.profileCompleteness = score;
  return score;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
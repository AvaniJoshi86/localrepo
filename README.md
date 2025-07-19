# SkinWise - Smart Skincare E-commerce Platform

SkinWise is a modern, trust-focused skincare e-commerce platform that solves the core problems of ingredient confusion, routine overwhelm, and trial-and-error frustration in the crowded skincare market.

## 🌟 Key Features

### Core Problem-Solving Features

1. **Smart Skin Analysis Tool**
   - Interactive skin assessment quiz (5 minutes max)
   - AI-powered photo analysis for skin concern identification
   - Personalized product recommendations based on analysis
   - Skin type + concerns + lifestyle factors integration
   - Progress tracking with before/after photo comparison

2. **Ingredient Intelligence System**
   - Real-time ingredient decoder for any product
   - Interaction checker (warns about conflicting actives)
   - "Plain English" explanations of complex ingredients
   - Ingredient education library with visual guides
   - Personal ingredient blacklist based on sensitivities

3. **Routine Builder & Simplifier**
   - Step-by-step routine creation wizard
   - Complexity level selector (minimal/moderate/advanced)
   - Budget-based routine optimization
   - Seasonal adjustment recommendations
   - Morning vs evening routine separation

4. **Smart Sampling System**
   - Curated sample boxes based on skin analysis
   - Trial-size recommendations before full-size purchases
   - 30-day trial periods with progress tracking
   - Sample-to-full-size upgrade path with discounts
   - Risk-free trial guarantee program

5. **Progress Tracking Dashboard**
   - Weekly skin photo analysis with AI feedback
   - Objective improvement metrics tracking
   - Product effectiveness scoring based on usage
   - Milestone celebrations and motivation system
   - Shareable progress reports

## 🎨 Design Philosophy

- **Clean, medical-grade aesthetic** (whites, soft blues, minimal greens)
- **Trust-building elements** (dermatologist endorsements, clinical data)
- **Mobile-first design** for bathroom/mirror usage
- **Indian skin tone representation** in all imagery
- **Scientific credibility** mixed with approachable language
- **Fast loading** for impatient skincare shoppers

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **Sharp** for image processing
- **Multer** for file uploads
- **Helmet** & rate limiting for security
- **bcryptjs** for password hashing

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **Styled Components** for styling
- **Axios** for API communication
- **React Hook Form** with Yup validation
- **Lucide React** for icons
- **Framer Motion** for animations

### Key Libraries
- **Express Validator** for API validation
- **Cors** for cross-origin requests
- **Morgan** for logging
- **Dotenv** for environment variables

## 📁 Project Structure

```
skinwise/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── uploads/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd skinwise/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skinwise
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd skinwise/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🏗️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Skin Analysis
- `POST /api/skin-analysis/quiz` - Submit skin analysis quiz
- `POST /api/skin-analysis/photos` - Upload and analyze skin photos
- `POST /api/skin-analysis/combined` - Combined quiz and photo analysis
- `GET /api/skin-analysis/history` - Get analysis history
- `GET /api/skin-analysis/:id` - Get specific analysis
- `GET /api/skin-analysis/latest/recommendations` - Get latest recommendations

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/featured` - Get featured products
- `GET /api/products/recommended` - Get personalized recommendations
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/ingredients` - Get product ingredient analysis
- `POST /api/products/:id/compare` - Compare products

## 🎯 Target User Experience

- **Overwhelmed beginners** feel guided and confident
- **Sensitive skin users** feel safe to experiment
- **Results-driven users** see clear progress metrics
- **Budget-conscious users** find cost-effective solutions
- **Time-poor users** get quick, effective recommendations

## 🛡️ Trust & Safety Features

- Dermatologist-reviewed product information
- Patch test reminders and guidance
- Purging vs breakout education
- Ingredient safety ratings and warnings
- Community reviews from verified purchasers only
- Professional consultation booking integration

## 🔮 Future Enhancements

- WhatsApp support for skincare questions
- Virtual try-on for color cosmetics
- Subscription service for routine maintenance
- AI-powered ingredient conflict detection
- Social features for progress sharing
- Integration with wearable devices

## 📝 Development Notes

### Database Models
- **User**: Comprehensive user profiles with skin data
- **Product**: Detailed product information with ingredients
- **SkinAnalysis**: AI analysis results and recommendations

### Security Features
- JWT authentication with refresh tokens
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

### Performance Optimizations
- Image compression and optimization
- Database indexing for faster queries
- Lazy loading of components
- API response caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Designed with Indian skin tones and concerns in mind
- Inspired by the need for trustworthy skincare guidance
- Built with modern web technologies for optimal performance
- Focused on solving real user pain points in skincare shopping

---

**SkinWise** - Making skincare shopping smart, safe, and simple. 🌸
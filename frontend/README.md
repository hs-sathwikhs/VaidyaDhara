# Vaidya Dhara Frontend

A modern, responsive React frontend for team Vaidya Dhara-driven public health chatbot system.

## 🚀 Features

### Core Functionality
- **🤖 AI Health Chat**: Interactive chatbot interface with multilingual support
- **📊 Analytics Dashboard**: Real-time health metrics and usage analytics
- **🩺 Symptom Checker**: AI-powered symptom analysis with medical disclaimers
- **📚 Health Tips**: Curated wellness content with gamification
- **🎯 Rewards System**: Points, badges, and achievement tracking
- **🌍 Multilingual Support**: English, Hindi, Odia, Bengali, Telugu, Tamil

### Design Features
- **🎨 Medical Theme**: Calming blues, greens, and whites color palette
- **📱 Responsive Design**: Mobile-first approach with seamless desktop experience
- **♿ Accessibility**: WCAG compliant design patterns
- **🌟 Modern UI**: Glass-morphism effects, smooth animations, and intuitive navigation

## 🛠 Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom medical theme
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Charts**: Recharts for analytics visualizations
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Markdown**: React Markdown for rich text content

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration and endpoints
│   │   └── index.js       # Main API client with health endpoints
│   ├── components/        # Reusable UI components
│   │   └── Sidebar.jsx    # Main navigation sidebar
│   ├── pages/            # Page components
│   │   ├── ChatPage.jsx          # AI chat interface
│   │   ├── DashboardPage.jsx     # Analytics dashboard
│   │   ├── SymptomCheckerPage.jsx # Symptom analysis
│   │   ├── HealthTipsPage.jsx    # Wellness content
│   │   └── RewardsPage.jsx       # Gamification system
│   ├── store/            # State management
│   │   └── index.js      # Zustand stores
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles with medical theme
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Design System

### Color Palette
```css
/* Primary Medical Blues */
--medical-blue-500: #0ea5e9
--medical-blue-600: #0284c7

/* Calming Greens */
--medical-green-500: #22c55e
--medical-green-600: #16a34a

/* Soft Teals */
--medical-teal-500: #14b8a6
--medical-teal-600: #0d9488
```

### Component Classes
```css
.medical-card              # Standard card with medical styling
.medical-button-primary    # Primary action button
.medical-button-secondary  # Secondary action button
.chat-bubble-user         # User message bubble
.chat-bubble-bot          # Bot message bubble
```

## 🔌 API Integration

The frontend connects to the backend API with the following endpoints:

### Chat API
```javascript
POST /api/chat
{
  "question": "string",
  "language": "en|hi|or|bn|te|ta",
  "location": "string"
}
```

### Health Tips (Planned)
```javascript
GET /api/health-tips/daily
GET /api/health-tips/category/{category}
```

### Symptom Checker (Planned)
```javascript
POST /api/symptoms/check
{
  "symptoms": ["string"],
  "duration": "string",
  "intensity": "string"
}
```

## 🎯 Key Features Implementation

### 1. AI Chat Interface
- Real-time messaging with typing indicators
- Markdown support for rich responses
- Language selection dropdown
- Message persistence in local storage
- Medical disclaimers and emergency contacts

### 2. Symptom Checker
- Interactive symptom selection
- Custom symptom input
- Severity and duration tracking
- AI-powered analysis with disclaimers
- Emergency contact integration

### 3. Health Tips
- Categorized wellness content
- Search and filter functionality
- Favorite tips system
- Difficulty levels and reading time
- Points-based gamification

### 4. Analytics Dashboard
- Real-time health metrics
- Interactive charts and graphs
- Regional usage statistics
- System health monitoring
- Recent activity feed

### 5. Rewards System
- Points for user engagement
- Achievement badges
- Level progression
- Daily task completion
- Redeemable rewards catalog

## 🌍 Internationalization

### Supported Languages
- **English** (en) - Default
- **Hindi** (hi) - हिंदी
- **Odia** (or) - ଓଡ଼ିଆ
- **Bengali** (bn) - বাংলা
- **Telugu** (te) - తెలుగు
- **Tamil** (ta) - தமிழ்

### Implementation
- Language selection persisted in localStorage
- API calls include language parameter
- UI text ready for translation
- Regional health data support

## 🔒 Security Features

- Input sanitization for chat messages
- Medical disclaimer on all health advice
- Emergency contact prominence
- Secure API communication
- Data privacy compliance ready

## 📱 Mobile Responsiveness

- Mobile-first responsive design
- Touch-friendly interface elements
- Optimized chat experience on mobile
- Collapsible sidebar for mobile
- Progressive Web App ready

## 🎮 Gamification Elements

### Point System
- Chat interactions: +5 points
- Reading health tips: +5-15 points
- Symptom checking: +10 points
- Daily task completion: +10-20 points

### Achievement Badges
- First Steps, Chatty Helper, Symptom Detective
- Knowledge Seeker, Health Champion, Weekly Warrior
- Custom badges for milestones

### Rewards Catalog
- Free health consultations
- Premium health reports
- Wellness kits
- Digital certificates

## 🔧 Customization

### Theme Customization
Edit `tailwind.config.js` to modify the medical theme colors:

```javascript
theme: {
  extend: {
    colors: {
      medical: {
        blue: { /* custom blue shades */ },
        green: { /* custom green shades */ },
        teal: { /* custom teal shades */ }
      }
    }
  }
}
```

### API Configuration
Update API endpoints in `src/api/index.js`:

```javascript
const api = axios.create({
  baseURL: 'your-api-url',
  timeout: 30000,
});
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Smart India Hackathon 2025 submission for Problem Statement SIH25049.

## 🆘 Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team
- Refer to the main project README

---

**Rishi** - Your AI-Driven Public Health Companion 🏥💙

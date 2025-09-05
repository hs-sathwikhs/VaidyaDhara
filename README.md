# VaidyaDhara - AI Healthcare ChatBot

A comprehensive AI-powered healthcare chatbot that provides medical guidance in multiple Indian languages.

## 🏥 Features

- **AI-Powered Chat**: Intelligent health consultations using Google's Gemini AI
- **Multilingual Support**: English and Hindi (expandable to 11 Indian languages)
- **Symptom Checker**: AI-driven symptom analysis and recommendations
- **Emergency Contacts**: Quick access to medical emergency services
- **Health Tips**: Personalized health advice and preventive care
- **Real-time Backend Integration**: FastAPI backend with React frontend

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with functional components
- **JavaScript/JSX** - Component-based architecture
- **CSS3** - Responsive styling
- **Fetch API** - Backend communication

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini AI** - Advanced language model for health consultations
- **LangChain** - AI framework for document processing
- **SQLAlchemy** - Database ORM
- **ChromaDB** - Vector database for knowledge base
- **SQLite** - Local database storage

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)
```powershell
cd backend
python -m venv vaidya_env
.\vaidya_env\Scripts\Activate.ps1
pip install -r requirements.txt
# Add your Google API key to .env file
echo "GOOGLE_API_KEY=your_key_here" > .env
uvicorn app.main:app --reload --port 8000
```

### 2. Start Frontend (Terminal 2)
```powershell
cd frontend
npm install
npm start
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs

## 💬 Current Status

✅ **Frontend Running**: React application with chat interface  
✅ **Backend Integrated**: FastAPI server with AI capabilities  
✅ **API Connected**: Frontend communicates with backend  
✅ **Chat Working**: AI-powered health consultations  
✅ **Multilingual**: English & Hindi support  
✅ **Emergency Features**: Quick access to medical help  

## 🔧 Features Overview

### Chat Assistant
- Real-time AI health consultations
- Multilingual support (English/Hindi)
- Connection status indicator
- Offline fallback responses

### Navigation Pages
- **Chat**: Main AI assistant interface
- **Symptoms**: Symptom checker (redirects to chat)
- **Health Tips**: Wellness advice cards
- **Emergency**: Quick access to emergency numbers

### Backend Integration
- FastAPI server with Google Gemini AI
- Vector database for medical knowledge
- Real-time chat API endpoints
- Health consultation logging

## ⚠️ Medical Disclaimer

**IMPORTANT**: VaidyaDhara is an AI assistant tool and should not replace professional medical advice. Always consult qualified healthcare providers for medical concerns.

Emergency: Call 108 for immediate medical assistance.

---
**Made with ❤️ for better healthcare accessibility in India**


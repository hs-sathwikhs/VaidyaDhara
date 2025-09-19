# Vaidya Dhara: AI-Driven Public Health Platform

![Built With](https://img.shields.io/badge/Built%20With-AI%20%7C%20LangChain%20%7C%20FastAPI%20%7C%20React-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
  - [Docker Deployment](#docker-deployment)
- [Usage](#usage)
- [Project Architecture](#project-architecture)
- [Business Implementation](#business-implementation)
- [Contributing](#contributing)
- [License](#license)
- [Project Details](#project-details)

---

## 🌟 Overview

**Vaidya Dhara** is an AI-powered public health platform that goes beyond simple information dissemination. It is a comprehensive, scalable, and community-driven solution designed to make a real-world impact on public health awareness and education.

Our platform addresses the critical need for accessible and intelligent systems to disseminate health information and raise awareness about diseases. Through a combination of conversational AI, gamified engagement, and actionable health analytics, Vaidya Dhara serves as a foundation for sustainable public health initiatives.

---

## 🔍 Features

- **AI-Driven Conversational Interface** – Delivers accurate, localized, and multi-lingual health information through natural conversations.
  
- **Multi-lingual Support** – Supports regional languages (initially focusing on Odisha, scalable to pan-India).
  
- **Disease-Specific Knowledge Base** – Comprehensive information on COVID, TB, Malaria, and other endemic diseases.
  
- **Gamified Engagement** – Incentive-based participation (points for quizzes, tips, engagement) that drives long-term user interaction and data contribution.
  
- **Symptom Checker** – Provides initial guidance with appropriate disclaimers for seeking professional medical advice.
  
- **Actionable Health Analytics** – Real-time data dashboard for health authorities to track public health trends and make informed decisions.
  
- **Geo-specific Insights** – Location-based health information and analytics for targeted interventions.

---

## 💻 Technology Stack

### Frontend
- **React** with Vite
- **TailwindCSS** for styling
- **Zustand** for state management
- **Axios** for API communication
- **Recharts** for data visualization

### Backend
- **FastAPI** - High-performance web framework
- **LangChain** - For AI/LLM integration
- **Google Gemini** - AI model for conversational interface
- **SQLite/PostgreSQL** - Database options
- **Streamlit** - For analytics dashboard
- **Plotly & Pandas** - For data visualization and analysis

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📋 Installation Guide

### Prerequisites

- **Node.js** (v16+) and **npm** (v7+)
- **Python** (v3.9+)
- **Docker** and **Docker Compose** (optional, for containerized deployment)
- **Google Gemini API Key** (Get yours at https://aistudio.google.com/app/apikey)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/hs-sathwikhs/VaidyaDhara.git
   cd VaidyaDhara
   ```

2. **Create environment configuration**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your Google Gemini API key.

3. **Install dependencies and initialize database**
   ```bash
   npm run setup
   ```
   This will install all required dependencies for both frontend and backend, and initialize the database.

4. **Start the development servers**
   ```bash
   npm start
   ```
   This will start both the frontend and backend servers concurrently.
   - Frontend will be available at: http://localhost:5173
   - Backend API will be available at: http://localhost:8000
   - Dashboard will be available at: http://localhost:8501

### Docker Deployment

For containerized deployment:

1. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

2. **Stop containers**
   ```bash
   docker-compose down
   ```

---

## 🚀 Usage

1. **Access the Web Interface**
   - Open your browser and navigate to http://localhost:5173
   - Interact with the chatbot by typing your health-related questions
   
2. **View the Analytics Dashboard**
   - Access the dashboard at http://localhost:8501
   - Explore health trends, user engagement statistics, and regional health data

3. **API Documentation**
   - View the API documentation at http://localhost:8000/docs
   - Test API endpoints directly from the Swagger UI

---

## 🏗 Project Architecture

### High-Level Architecture

```
VaidyaDhara
├── Frontend (React + Vite)
│   ├── User Interface
│   ├── Chat Interface
│   └── User Dashboard
│
├── Backend (FastAPI)
│   ├── API Endpoints
│   ├── Database Layer
│   └── AI Engine (LangChain + Gemini)
│
└── Analytics (Streamlit)
    ├── Health Trends
    ├── User Engagement
    └── Regional Data
```

### Data Flow

1. User interacts with the chat interface
2. Queries are processed by the AI Engine
3. Responses are generated based on the knowledge base
4. User interactions are anonymously logged for analytics
5. Health authorities can access aggregated data via the dashboard

---

## 📈 Business Implementation

### Revenue Model
- **B2G**: Subscription service for government health departments (analytics & campaigns)
- **B2B**: White-labeled chatbot versions for hospitals, clinics, and NGOs

### Scalability
- Modular architecture for quick addition of new datasets & languages
- Expandable across multiple states and regions in India

### Competitive Advantage
- **Gamified engagement** ensures user retention
- **Data-driven insights** differentiate it from static health portals
- **Multi-lingual support** increases accessibility

---

## 👥 Contributing

We welcome contributions to Vaidya Dhara! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📊 Project Details

**Vaidya Dhara** was developed to address the SIH Problem Statement No.: SIH25049 - "AI-Driven Public Health Chatbot for Disease Awareness."

Developed by: Vaidya Dhara Team

For more information, contact us at [contact.vaidyadhara@gmail.com]

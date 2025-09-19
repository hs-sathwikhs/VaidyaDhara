// src/api/index.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth or other headers
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health Chat API
export const chatAPI = {
  sendMessage: async (question, language = 'en', location = 'India') => {
    try {
      const response = await api.post('/api/chat', {
        question,
        language,
        location,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get response from AI');
    }
  },
};

// Health Tips API (placeholder for future implementation)
export const healthTipsAPI = {
  getDailyTips: async () => {
    try {
      const response = await api.get('/api/health-tips/daily');
      return response.data;
    } catch (error) {
      // Fallback data if API not implemented yet
      return {
        tips: [
          {
            id: 1,
            title: "Stay Hydrated",
            description: "Drink at least 8 glasses of water daily to maintain proper hydration.",
            category: "general",
            points: 10
          },
          {
            id: 2,
            title: "Regular Exercise",
            description: "Aim for 30 minutes of physical activity daily to boost your health.",
            category: "fitness",
            points: 15
          }
        ]
      };
    }
  },
  
  getTipsByCategory: async (category) => {
    try {
      const response = await api.get(`/api/health-tips/category/${category}`);
      return response.data;
    } catch (error) {
      return { tips: [] };
    }
  },
};

// Symptom Checker API (placeholder)
export const symptomAPI = {
  checkSymptoms: async (symptomData) => {
    try {
      const response = await api.post('/api/symptoms/check', symptomData);
      return response.data;
    } catch (error) {
      // Fallback response
      return {
        suggestions: [
          "Please consult a healthcare professional for proper diagnosis",
          "Monitor your symptoms and seek medical attention if they persist",
          "Consider scheduling an appointment with your doctor"
        ],
        urgency: "medium",
        disclaimer: "This is not a medical diagnosis. Always consult with qualified healthcare professionals."
      };
    }
  },
};

// User Profile & Rewards API (placeholder)
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      // Fallback data
      return {
        name: "Health Enthusiast",
        points: 150,
        level: "Beginner",
        badges: ["First Steps", "Daily Learner"],
        joinDate: new Date().toISOString()
      };
    }
  },
  
  updatePoints: async (points, activity) => {
    try {
      const response = await api.post('/api/user/points', { points, activity });
      return response.data;
    } catch (error) {
      return { success: false, message: 'Failed to update points' };
    }
  },
};

// Analytics API for dashboard (placeholder)
export const analyticsAPI = {
  getHealthMetrics: async () => {
    try {
      const response = await api.get('/api/analytics/health-metrics');
      return response.data;
    } catch (error) {
      // Fallback data for demo
      return {
        totalQueries: 1250,
        activeUsers: 89,
        topSymptoms: [
          { name: 'Fever', count: 45 },
          { name: 'Headache', count: 32 },
          { name: 'Cough', count: 28 },
          { name: 'Fatigue', count: 23 }
        ],
        dailyInteractions: [
          { date: '2025-01-01', count: 120 },
          { date: '2025-01-02', count: 135 },
          { date: '2025-01-03', count: 148 },
          { date: '2025-01-04', count: 162 },
          { date: '2025-01-05', count: 155 },
          { date: '2025-01-06', count: 189 },
          { date: '2025-01-07', count: 201 }
        ]
      };
    }
  },
};

// Emergency Contacts API
export const emergencyAPI = {
  getContacts: async (location = 'India') => {
    try {
      const response = await api.get(`/api/emergency/contacts?location=${location}`);
      return response.data;
    } catch (error) {
      // Fallback emergency contacts
      return {
        contacts: [
          { name: "National Emergency", number: "112", type: "emergency" },
          { name: "Ambulance", number: "108", type: "medical" },
          { name: "Police", number: "100", type: "police" },
          { name: "Fire Department", number: "101", type: "fire" },
          { name: "Women Helpline", number: "1091", type: "support" },
          { name: "Child Helpline", number: "1098", type: "support" }
        ]
      };
    }
  },
};

export default api;
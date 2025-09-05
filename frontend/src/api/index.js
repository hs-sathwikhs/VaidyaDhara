// Frontend API integration for VaidyaDhara
const API_BASE_URL = 'http://localhost:8000';

class VaidyaDharaAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make HTTP requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck() {
    return this.makeRequest('/');
  }

  // Main chat endpoint
  async sendChatMessage(question, language = 'en', location = 'Mysuru') {
    return this.makeRequest('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        question,
        language,
        location,
      }),
    });
  }

  // Get health tips (if backend supports it)
  async getHealthTips(language = 'en') {
    try {
      return this.makeRequest(`/api/health-tips?language=${language}`);
    } catch (error) {
      // Fallback health tips if backend doesn't support this endpoint
      return {
        tips: [
          language === 'hi' 
            ? 'दिन में कम से कम 8 गिलास पानी पिएं'
            : 'Drink at least 8 glasses of water daily',
          language === 'hi'
            ? 'नियमित व्यायाम करें और संतुलित आहार लें'
            : 'Exercise regularly and maintain a balanced diet',
          language === 'hi'
            ? 'पर्याप्त नींद लें और तनाव से बचें'
            : 'Get adequate sleep and avoid stress'
        ]
      };
    }
  }

  // Emergency contacts (if backend supports it)
  async getEmergencyContacts(location = 'Mysuru') {
    try {
      return this.makeRequest(`/api/emergency-contacts?location=${location}`);
    } catch (error) {
      // Fallback emergency contacts
      return {
        contacts: [
          { name: 'Ambulance', number: '108', type: 'emergency' },
          { name: 'Fire Department', number: '101', type: 'emergency' },
          { name: 'Police', number: '100', type: 'emergency' },
          { name: 'Women Helpline', number: '1091', type: 'support' }
        ]
      };
    }
  }

  // Symptom checker (basic implementation)
  async checkSymptoms(symptoms, patientInfo = {}) {
    const symptomQuery = `I have the following symptoms: ${symptoms.join(', ')}. Can you help me understand what this might indicate?`;
    
    try {
      const response = await this.sendChatMessage(
        symptomQuery, 
        patientInfo.language || 'en', 
        patientInfo.location || 'Mysuru'
      );
      
      return {
        analysis: response.answer,
        recommendations: [
          'Consult with a healthcare professional',
          'Monitor your symptoms closely',
          'Stay hydrated and get adequate rest'
        ],
        severity: 'moderate', // This would be determined by AI in a real implementation
        needsUrgentCare: false
      };
    } catch (error) {
      throw new Error('Failed to analyze symptoms. Please try again.');
    }
  }
}

// Create and export a singleton instance
const vaidyaDharaAPI = new VaidyaDharaAPI();
export default vaidyaDharaAPI;

// Named exports for specific functions
export const {
  healthCheck,
  sendChatMessage,
  getHealthTips,
  getEmergencyContacts,
  checkSymptoms
} = vaidyaDharaAPI;

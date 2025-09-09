// src/api/diseaseAwarenessApi.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class DiseaseAwarenessAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Fetch disease awareness data based on location
   * @param {number} latitude - User's latitude
   * @param {number} longitude - User's longitude
   * @returns {Promise} API response
   */
  async getDiseaseData(latitude = null, longitude = null) {
    try {
      let url = `${this.baseURL}/api/disease-awareness`;
      
      // Add coordinates if provided
      if (latitude !== null && longitude !== null) {
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString()
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('Disease API Error:', error);
      throw error;
    }
  }

  /**
   * Get emergency contacts for a specific location
   * @param {string} locationName - Name of the location
   * @returns {Promise} Emergency contacts data
   */
  async getEmergencyContacts(locationName) {
    try {
      const url = `${this.baseURL}/api/emergency-contacts?location=${encodeURIComponent(locationName)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Emergency Contacts API Error:', error);
      throw error;
    }
  }

  /**
   * Search diseases by symptoms
   * @param {Array} symptoms - Array of symptom strings
   * @param {number} latitude - User's latitude
   * @param {number} longitude - User's longitude
   * @returns {Promise} Disease search results
   */
  async searchDiseasesBySymptoms(symptoms, latitude = null, longitude = null) {
    try {
      const requestBody = {
        symptoms,
        ...(latitude !== null && longitude !== null && {
          location: { latitude, longitude }
        })
      };

      const response = await fetch(`${this.baseURL}/api/disease-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Disease Search API Error:', error);
      throw error;
    }
  }

  /**
   * Report a new disease case (if needed for crowd-sourcing)
   * @param {Object} caseData - Case information
   * @returns {Promise} Report submission result
   */
  async reportCase(caseData) {
    try {
      const response = await fetch(`${this.baseURL}/api/report-case`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(caseData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Case Report API Error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const diseaseAwarenessAPI = new DiseaseAwarenessAPI();

export default diseaseAwarenessAPI;

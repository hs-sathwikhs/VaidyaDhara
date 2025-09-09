// src/services/diseaseDataService.js

class DiseaseDataService {
  constructor() {
    this.diseaseDatabase = {
      'Mumbai': {
        alerts: [
          {
            id: 1,
            disease: 'Dengue',
            severity: 'high',
            cases: 156,
            trend: 'increasing',
            description: 'Dengue cases are rising due to monsoon season. Take precautions against mosquito breeding.',
            prevention: [
              'Use mosquito repellent regularly',
              'Remove stagnant water from containers',
              'Wear long-sleeved clothing',
              'Use bed nets at night',
              'Keep surroundings clean'
            ],
            symptoms: ['High fever (104°F/40°C)', 'Severe headache', 'Joint and muscle pain', 'Skin rash', 'Nausea and vomiting'],
            riskFactors: ['Monsoon season', 'Stagnant water', 'Poor sanitation'],
            emergencySignal: ['Severe abdominal pain', 'Persistent vomiting', 'Difficulty breathing']
          },
          {
            id: 2,
            disease: 'Malaria',
            severity: 'medium',
            cases: 89,
            trend: 'stable',
            description: 'Malaria cases are stable but monitoring continues in high-risk areas.',
            prevention: [
              'Use bed nets treated with insecticide',
              'Take prophylaxis if prescribed',
              'Avoid outdoor activities at dawn and dusk',
              'Use mosquito coils or repellents',
              'Wear protective clothing'
            ],
            symptoms: ['Fever with chills', 'Sweating', 'Headache', 'Fatigue', 'Muscle aches'],
            riskFactors: ['Monsoon season', 'Slum areas', 'Poor drainage'],
            emergencySignal: ['High fever with confusion', 'Difficulty breathing', 'Seizures']
          },
          {
            id: 3,
            disease: 'Chikungunya',
            severity: 'medium',
            cases: 67,
            trend: 'stable',
            description: 'Chikungunya cases reported in several areas. Joint pain may persist for weeks.',
            prevention: [
              'Eliminate mosquito breeding sites',
              'Use protective clothing',
              'Apply insect repellent',
              'Use air conditioning or window screens'
            ],
            symptoms: ['Sudden fever', 'Severe joint pain', 'Muscle pain', 'Headache', 'Rash'],
            riskFactors: ['Aedes mosquito breeding', 'Urbanization', 'Climate change'],
            emergencySignal: ['Severe joint pain lasting weeks', 'High fever with complications']
          }
        ],
        stats: {
          totalCases: 312,
          newCases: 28,
          recovered: 267,
          underTreatment: 45,
          deaths: 0
        },
        riskLevel: 'high',
        mainConcerns: ['Vector-borne diseases', 'Monsoon-related infections'],
        seasonalFactors: ['Monsoon season increases vector breeding']
      },
      'Delhi': {
        alerts: [
          {
            id: 1,
            disease: 'Air Pollution Related Respiratory Issues',
            severity: 'high',
            cases: 289,
            trend: 'increasing',
            description: 'High air pollution levels (AQI > 300) are causing severe respiratory problems. Immediate protective measures recommended.',
            prevention: [
              'Wear N95 or P95 masks outdoors',
              'Use air purifiers indoors',
              'Avoid outdoor exercise during peak pollution',
              'Keep windows closed during high pollution',
              'Stay hydrated and eat antioxidant-rich foods'
            ],
            symptoms: ['Persistent cough', 'Breathing difficulty', 'Throat irritation', 'Eye irritation', 'Chest tightness'],
            riskFactors: ['High AQI levels', 'Vehicle emissions', 'Industrial pollution', 'Crop burning'],
            emergencySignal: ['Severe breathing difficulty', 'Chest pain', 'Blue lips or fingernails']
          },
          {
            id: 2,
            disease: 'Seasonal Flu',
            severity: 'medium',
            cases: 134,
            trend: 'stable',
            description: 'Seasonal influenza cases are at normal levels for this time of year.',
            prevention: [
              'Get annual flu vaccination',
              'Wash hands frequently with soap',
              'Avoid touching face with unwashed hands',
              'Maintain social distance from sick people',
              'Boost immunity with healthy diet'
            ],
            symptoms: ['Fever and chills', 'Body aches', 'Fatigue', 'Runny or stuffy nose', 'Sore throat'],
            riskFactors: ['Seasonal change', 'Crowded places', 'Weak immunity'],
            emergencySignal: ['High fever with difficulty breathing', 'Severe dehydration', 'Persistent chest pain']
          },
          {
            id: 3,
            disease: 'Conjunctivitis (Pink Eye)',
            severity: 'low',
            cases: 78,
            trend: 'decreasing',
            description: 'Conjunctivitis cases are decreasing but still present in some areas.',
            prevention: [
              'Wash hands frequently',
              'Avoid touching or rubbing eyes',
              'Don\'t share personal items like towels',
              'Clean contact lenses properly',
              'Avoid crowded places if infected'
            ],
            symptoms: ['Red or pink eye', 'Itchy eyes', 'Discharge from eyes', 'Tearing', 'Sensitivity to light'],
            riskFactors: ['Poor hygiene', 'Contaminated water', 'Crowded conditions'],
            emergencySignal: ['Severe eye pain', 'Vision changes', 'Light sensitivity with fever']
          }
        ],
        stats: {
          totalCases: 501,
          newCases: 52,
          recovered: 434,
          underTreatment: 67,
          deaths: 0
        },
        riskLevel: 'high',
        mainConcerns: ['Air pollution', 'Respiratory diseases', 'Seasonal infections'],
        seasonalFactors: ['Winter pollution increases respiratory issues']
      },
      'Bangalore': {
        alerts: [
          {
            id: 1,
            disease: 'Dengue',
            severity: 'medium',
            cases: 98,
            trend: 'stable',
            description: 'Dengue cases are under control but vigilance is required.',
            prevention: [
              'Remove water stagnation around homes',
              'Use mosquito nets and repellents',
              'Maintain clean surroundings',
              'Report suspected cases immediately'
            ],
            symptoms: ['High fever', 'Headache', 'Joint pain', 'Rash', 'Low platelet count'],
            riskFactors: ['Urban development', 'Water storage', 'Climate conditions'],
            emergencySignal: ['Bleeding', 'Severe abdominal pain', 'Plasma leakage signs']
          },
          {
            id: 2,
            disease: 'Chikungunya',
            severity: 'low',
            cases: 34,
            trend: 'decreasing',
            description: 'Chikungunya cases are decreasing with effective vector control measures.',
            prevention: [
              'Eliminate breeding sites',
              'Use protective measures',
              'Community awareness programs',
              'Regular health checkups'
            ],
            symptoms: ['Joint pain', 'Fever', 'Rash', 'Headache', 'Muscle pain'],
            riskFactors: ['Aedes mosquito presence', 'Urban planning gaps'],
            emergencySignal: ['Severe joint deformity', 'Neurological symptoms']
          }
        ],
        stats: {
          totalCases: 132,
          newCases: 8,
          recovered: 118,
          underTreatment: 14,
          deaths: 0
        },
        riskLevel: 'medium',
        mainConcerns: ['Vector-borne diseases', 'Urban health challenges'],
        seasonalFactors: ['Post-monsoon vector breeding']
      },
      'default': {
        alerts: [
          {
            id: 1,
            disease: 'Seasonal Allergies',
            severity: 'low',
            cases: 45,
            trend: 'stable',
            description: 'Common seasonal allergies are present. Take preventive measures if you are sensitive.',
            prevention: [
              'Identify and avoid allergens',
              'Use antihistamines as prescribed',
              'Keep windows closed during high pollen days',
              'Shower after outdoor activities',
              'Use air purifiers with HEPA filters'
            ],
            symptoms: ['Sneezing', 'Runny nose', 'Itchy eyes', 'Nasal congestion', 'Postnasal drip'],
            riskFactors: ['Pollen season', 'Environmental allergens', 'Air quality'],
            emergencySignal: ['Severe breathing difficulty', 'Anaphylactic reactions', 'Persistent asthma']
          },
          {
            id: 2,
            disease: 'Common Cold',
            severity: 'low',
            cases: 23,
            trend: 'stable',
            description: 'Regular cold cases due to seasonal changes.',
            prevention: [
              'Wash hands regularly',
              'Avoid close contact with sick people',
              'Don\'t touch face with unwashed hands',
              'Maintain good hygiene',
              'Get adequate rest and nutrition'
            ],
            symptoms: ['Runny nose', 'Sneezing', 'Cough', 'Sore throat', 'Mild headache'],
            riskFactors: ['Seasonal changes', 'Weakened immunity', 'Close contact with infected'],
            emergencySignal: ['High fever lasting more than 3 days', 'Severe breathing difficulty']
          }
        ],
        stats: {
          totalCases: 68,
          newCases: 5,
          recovered: 58,
          underTreatment: 10,
          deaths: 0
        },
        riskLevel: 'low',
        mainConcerns: ['Seasonal health issues', 'General wellness'],
        seasonalFactors: ['Weather changes affecting immunity']
      }
    };

    this.emergencyContacts = {
      national: {
        'Emergency Services': '108',
        'Medical Emergency': '102',
        'Health Helpline': '104',
        'COVID Helpline': '1075'
      },
      'Mumbai': {
        'Disaster Management': '022-22694725',
        'Municipal Corporation': '1916',
        'Police Control Room': '100'
      },
      'Delhi': {
        'Disaster Management': '011-23438091',
        'Pollution Control': '011-23379761',
        'Delhi Police': '100'
      },
      'Bangalore': {
        'Health Department': '080-22221188',
        'Disaster Management': '080-22341111',
        'Traffic Police': '103'
      }
    };
  }

  // Get disease data for a specific location
  getDiseaseData(locationName) {
    const data = this.diseaseDatabase[locationName] || this.diseaseDatabase['default'];
    return {
      ...data,
      location: locationName,
      lastUpdated: new Date().toISOString()
    };
  }

  // Get emergency contacts for a location
  getEmergencyContacts(locationName) {
    const national = this.emergencyContacts.national;
    const local = this.emergencyContacts[locationName] || {};
    
    return {
      national,
      local,
      location: locationName
    };
  }

  // Search diseases by symptoms
  searchBySymptoms(symptoms, locationName = 'default') {
    const locationData = this.getDiseaseData(locationName);
    const results = [];

    locationData.alerts.forEach(alert => {
      const matchingSymptoms = alert.symptoms.filter(symptom => 
        symptoms.some(userSymptom => 
          symptom.toLowerCase().includes(userSymptom.toLowerCase()) ||
          userSymptom.toLowerCase().includes(symptom.toLowerCase())
        )
      );

      if (matchingSymptoms.length > 0) {
        results.push({
          ...alert,
          matchingSymptoms,
          matchScore: matchingSymptoms.length / alert.symptoms.length
        });
      }
    });

    // Sort by match score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Get risk assessment for location
  getRiskAssessment(locationName) {
    const data = this.getDiseaseData(locationName);
    const highSeverityAlerts = data.alerts.filter(alert => alert.severity === 'high').length;
    const totalAlerts = data.alerts.length;
    
    let riskLevel = 'low';
    if (highSeverityAlerts > totalAlerts * 0.5) {
      riskLevel = 'high';
    } else if (highSeverityAlerts > 0) {
      riskLevel = 'medium';
    }

    return {
      riskLevel,
      highSeverityAlerts,
      totalAlerts,
      recommendations: this.getRecommendations(riskLevel, data.alerts)
    };
  }

  // Get general recommendations based on risk level
  getRecommendations(riskLevel, alerts) {
    const baseRecommendations = [
      'Maintain good personal hygiene',
      'Stay hydrated and eat nutritious food',
      'Get adequate rest and sleep',
      'Exercise regularly to boost immunity'
    ];

    if (riskLevel === 'high') {
      return [
        ...baseRecommendations,
        'Avoid crowded places when possible',
        'Wear protective masks in public',
        'Seek immediate medical attention for symptoms',
        'Follow local health authority guidelines strictly'
      ];
    } else if (riskLevel === 'medium') {
      return [
        ...baseRecommendations,
        'Be cautious in crowded areas',
        'Monitor your health regularly',
        'Follow preventive measures for common diseases'
      ];
    }

    return baseRecommendations;
  }

  // Simulate real-time data updates
  getLatestUpdates(locationName) {
    const data = this.getDiseaseData(locationName);
    
    // Simulate some random fluctuations in case numbers
    const updates = data.alerts.map(alert => ({
      ...alert,
      cases: alert.cases + Math.floor(Math.random() * 10) - 5, // ±5 random change
      trend: Math.random() > 0.7 ? (alert.trend === 'increasing' ? 'stable' : 'increasing') : alert.trend
    }));

    return {
      ...data,
      alerts: updates,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Create a singleton instance
const diseaseDataService = new DiseaseDataService();

export default diseaseDataService;

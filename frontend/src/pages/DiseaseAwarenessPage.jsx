// src/pages/DiseaseAwarenessPage.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Info, TrendingUp, Users, RefreshCw, Phone, Shield } from 'lucide-react';
import { useLocalizationStore } from '../store';
import { translations } from '../translations';

function DiseaseAwarenessPage() {
  const { currentLanguage } = useLocalizationStore();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [diseaseAlerts, setDiseaseAlerts] = useState([]);
  const [regionalStats, setRegionalStats] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  // Fetch disease data - using mock data for now until backend is ready
  const fetchDiseaseData = async (lat = null, lng = null) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock location data based on coordinates or use default
      const mockLocation = lat && lng ? 
        { name: 'Mumbai, Maharashtra', coordinates: { latitude: lat, longitude: lng } } :
        { name: 'Your Location', coordinates: null };
      
      setLocation(mockLocation);
      setLocationError(null);
      
      // Set mock disease alerts
      setDiseaseAlerts([
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
          symptoms: ['High fever (104°F)', 'Severe headache', 'Joint and muscle pain', 'Skin rash', 'Nausea and vomiting']
        },
        {
          id: 2,
          disease: 'Seasonal Flu',
          severity: 'medium',
          cases: 45,
          trend: 'stable',
          description: 'Seasonal flu cases are at normal levels. Practice good hygiene.',
          prevention: ['Wash hands frequently', 'Get vaccinated', 'Avoid crowds when sick', 'Stay hydrated'],
          symptoms: ['Fever', 'Cough', 'Body aches', 'Fatigue', 'Runny nose']
        },
        {
          id: 3,
          disease: 'Seasonal Allergies',
          severity: 'low',
          cases: 23,
          trend: 'decreasing',
          description: 'Pollen allergies are decreasing as season changes.',
          prevention: ['Avoid outdoor activities during high pollen', 'Use air purifiers', 'Take antihistamines', 'Keep windows closed'],
          symptoms: ['Sneezing', 'Runny nose', 'Itchy eyes', 'Congestion']
        }
      ]);
      
      // Set mock regional stats
      setRegionalStats({
        totalCases: 224,
        newCases: 18,
        recovered: 180,
        underTreatment: 44
      });
      
    } catch (error) {
      console.error('Error fetching disease data:', error);
      setLocationError('Unable to load disease information');
      
      // Even more basic fallback
      setLocation({ name: 'General Area', coordinates: null });
      setDiseaseAlerts([
        {
          id: 1,
          disease: 'General Health Advisory',
          severity: 'low',
          cases: 0,
          trend: 'stable',
          description: 'Stay healthy by following basic preventive measures.',
          prevention: ['Maintain personal hygiene', 'Eat healthy food', 'Exercise regularly'],
          symptoms: ['Consult doctor for any health concerns']
        }
      ]);
      setRegionalStats({
        totalCases: 0,
        newCases: 0,
        recovered: 0,
        underTreatment: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Get user location and fetch data
  useEffect(() => {
    const initializeData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchDiseaseData(latitude, longitude);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocationError('Location access denied. Showing general information.');
            fetchDiseaseData(); // Fetch without location
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        setLocationError('Geolocation not supported by this browser');
        fetchDiseaseData(); // Fetch without location
      }
    };

    initializeData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'decreasing') return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
  };

  const refreshData = () => {
    if (location?.coordinates) {
      fetchDiseaseData(location.coordinates.latitude, location.coordinates.longitude);
    } else {
      fetchDiseaseData();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">{t('loading', 'Loading disease information for your area...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {t('disease.awareness', 'Disease Awareness')}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {location ? (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>{location.name}</span>
                      {location.coordinates && (
                        <span className="text-xs text-gray-500">
                          ({location.coordinates.latitude?.toFixed(2)}, {location.coordinates.longitude?.toFixed(2)})
                        </span>
                      )}
                    </>
                  ) : locationError ? (
                    <span className="text-yellow-600">{locationError}</span>
                  ) : (
                    <span>Loading location...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t('refresh', 'Refresh')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Regional Stats */}
          {regionalStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">{t('total.cases', 'Total Cases')}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-1">{regionalStats.totalCases.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">{t('new.cases', 'New Cases')}</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-1">{regionalStats.newCases}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">{t('recovered', 'Recovered')}</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{regionalStats.recovered}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">{t('under.treatment', 'Under Treatment')}</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{regionalStats.underTreatment}</p>
              </div>
            </div>
          )}

          {/* Disease Alerts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              {t('disease.alerts', 'Current Health Alerts')}
            </h2>
            
            {diseaseAlerts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No current health alerts for your area.</p>
                <p className="text-sm text-gray-500 mt-2">Stay healthy and follow general preventive measures.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {diseaseAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${getSeverityColor(alert.severity)}`}
                    onClick={() => setSelectedDisease(selectedDisease?.id === alert.id ? null : alert)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{alert.disease}</h3>
                          {getTrendIcon(alert.trend)}
                          <span className="text-sm font-medium capitalize">{alert.trend}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {alert.cases} cases
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                      <Info className="w-5 h-5 text-gray-400 ml-4" />
                    </div>

                    {/* Expanded Details */}
                    {selectedDisease?.id === alert.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">{t('symptoms.watch', 'Symptoms to Watch For')}:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {alert.symptoms?.map((symptom, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                                {symptom}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">{t('prevention.measures', 'Prevention Measures')}:</h4>
                          <div className="grid gap-2">
                            {alert.prevention?.map((measure, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                {measure}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {t('emergency.contacts', 'Emergency Contacts')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3 shadow-sm">
                <span className="font-medium text-red-700">Emergency Services:</span>
                <p className="text-red-600 font-bold text-lg mt-1">108 / 102</p>
                <button 
                  onClick={() => window.open('tel:108')}
                  className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Now
                </button>
              </div>
              <div className="bg-white rounded p-3 shadow-sm">
                <span className="font-medium text-red-700">Health Helpline:</span>
                <p className="text-red-600 font-bold text-lg mt-1">104</p>
                <button 
                  onClick={() => window.open('tel:104')}
                  className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Now
                </button>
              </div>
              <div className="bg-white rounded p-3 shadow-sm">
                <span className="font-medium text-red-700">COVID Helpline:</span>
                <p className="text-red-600 font-bold text-lg mt-1">1075</p>
                <button 
                  onClick={() => window.open('tel:1075')}
                  className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Now
                </button>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Medical Disclaimer:</strong> This information is for awareness purposes only. 
                  Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
                  In case of emergency, immediately contact local emergency services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseAwarenessPage;

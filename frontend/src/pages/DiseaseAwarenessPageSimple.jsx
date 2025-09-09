// src/pages/DiseaseAwarenessPage.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, TrendingUp, Users, RefreshCw, Phone, Shield } from 'lucide-react';

function DiseaseAwarenessPage() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [diseaseAlerts, setDiseaseAlerts] = useState([]);
  const [regionalStats, setRegionalStats] = useState(null);

  useEffect(() => {
    // Simple initialization with mock data
    const initData = () => {
      setTimeout(() => {
        setLocation({ name: 'Your Location' });
        setDiseaseAlerts([
          {
            id: 1,
            disease: 'Seasonal Flu',
            severity: 'medium',
            cases: 45,
            trend: 'stable',
            description: 'Seasonal flu cases are at normal levels.',
            prevention: ['Wash hands frequently', 'Get vaccinated'],
            symptoms: ['Fever', 'Cough', 'Body aches']
          }
        ]);
        setRegionalStats({
          totalCases: 45,
          newCases: 5,
          recovered: 38,
          underTreatment: 7
        });
        setLoading(false);
      }, 1000);
    };

    initData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading disease information...</p>
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
            <MapPin className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Disease Awareness</h1>
              <p className="text-sm text-gray-600">{location?.name || 'Loading location...'}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Regional Stats */}
          {regionalStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Total Cases</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-1">{regionalStats.totalCases}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">New Cases</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-1">{regionalStats.newCases}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Recovered</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{regionalStats.recovered}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Under Treatment</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{regionalStats.underTreatment}</p>
              </div>
            </div>
          )}

          {/* Disease Alerts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Current Health Alerts
            </h2>
            
            <div className="grid gap-4">
              {diseaseAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white rounded-lg border-2 p-6 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{alert.disease}</h3>
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
                  </div>

                  {/* Prevention and Symptoms */}
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Prevention:</h4>
                      <div className="space-y-1">
                        {alert.prevention?.map((measure, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            {measure}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Symptoms:</h4>
                      <div className="space-y-1">
                        {alert.symptoms?.map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            {symptom}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <span className="font-medium text-red-700">Emergency:</span>
                <p className="text-red-600 font-bold text-lg">108</p>
              </div>
              <div className="bg-white rounded p-3">
                <span className="font-medium text-red-700">Health Helpline:</span>
                <p className="text-red-600 font-bold text-lg">104</p>
              </div>
              <div className="bg-white rounded p-3">
                <span className="font-medium text-red-700">COVID Helpline:</span>
                <p className="text-red-600 font-bold text-lg">1075</p>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                <strong>Medical Disclaimer:</strong> This information is for awareness purposes only. 
                Always consult with qualified healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseAwarenessPage;

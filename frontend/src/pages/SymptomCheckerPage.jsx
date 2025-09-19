// src/pages/SymptomCheckerPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, Plus, X, AlertTriangle, Clock, MapPin, 
  Thermometer, Heart, Brain, Eye, Ear, Users
} from 'lucide-react';
import { symptomAPI } from '../api';
import { useHealthStore, useUserStore, useLocalizationStore } from '../store';
import { translations } from '../translations';

function SymptomCheckerPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [location, setLocation] = useState('');
  
  // Translation function
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addSymptom } = useHealthStore();
  const { addPoints } = useUserStore();

  const commonSymptoms = [
    { id: 1, name: 'Fever', icon: Thermometer, category: 'general' },
    { id: 2, name: 'Headache', icon: Brain, category: 'neurological' },
    { id: 3, name: 'Cough', icon: Activity, category: 'respiratory' },
    { id: 4, name: 'Fatigue', icon: Heart, category: 'general' },
    { id: 5, name: 'Nausea', icon: Activity, category: 'digestive' },
    { id: 6, name: 'Dizziness', icon: Brain, category: 'neurological' },
    { id: 7, name: 'Sore Throat', icon: Activity, category: 'respiratory' },
    { id: 8, name: 'Body Aches', icon: Activity, category: 'musculoskeletal' },
    { id: 9, name: 'Runny Nose', icon: Activity, category: 'respiratory' },
    { id: 10, name: 'Eye Irritation', icon: Eye, category: 'sensory' },
    { id: 11, name: 'Ear Pain', icon: Ear, category: 'sensory' },
    { id: 12, name: 'Chest Pain', icon: Heart, category: 'cardiovascular' },
  ];

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (exists) {
        return prev.filter(s => s.id !== symptom.id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim()) {
      const newSymptom = {
        id: Date.now(),
        name: customSymptom.trim(),
        icon: Activity,
        category: 'custom',
        isCustom: true
      };
      setSelectedSymptoms(prev => [...prev, newSymptom]);
      setCustomSymptom('');
    }
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);
    try {
      const symptomData = {
        symptoms: selectedSymptoms.map(s => s.name),
        duration,
        intensity,
        location,
        language: currentLanguage
      };

      const response = await symptomAPI.checkSymptoms(symptomData);
      setResults(response);

      // Log symptoms to store
      addSymptom(symptomData);
      
      // Award points for using symptom checker
      addPoints(10, 'symptom_check');

    } catch (error) {
      console.error('Symptom check failed:', error);
      setResults({
        suggestions: [
          "Unable to process symptoms at this time.",
          "Please consult a healthcare professional for proper evaluation.",
          "If experiencing severe symptoms, seek immediate medical attention."
        ],
        urgency: "high",
        disclaimer: "This tool is for informational purposes only and does not replace professional medical advice."
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800 border-blue-200',
      respiratory: 'bg-green-100 text-green-800 border-green-200',
      neurological: 'bg-purple-100 text-purple-800 border-purple-200',
      cardiovascular: 'bg-red-100 text-red-800 border-red-200',
      digestive: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      musculoskeletal: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      sensory: 'bg-pink-100 text-pink-800 border-pink-200',
      custom: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('symptom.checker', 'AI Symptom Checker')}</h1>
            <p className="text-slate-600 mt-1">
              {t('symptom.description', 'Describe your symptoms to get preliminary health guidance')}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span>{t('symptom.disclaimer', 'For informational purposes only')}</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Common Symptoms */}
            <div className="medical-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {t('symptom.select', 'Select Your Symptoms')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonSymptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.find(s => s.id === symptom.id);
                  const Icon = symptom.icon;
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                          {symptom.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Symptom Input */}
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {t('symptom.add.custom', 'Add Custom Symptom')}
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder={t('symptom.custom.placeholder', 'Describe any other symptoms...')}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddCustomSymptom}
                  disabled={!customSymptom.trim()}
                  className="medical-button-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Additional Details */}
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {t('symptom.additional.info', 'Additional Information')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t('symptom.duration', 'Duration')}
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    <option value="less-than-day">Less than a day</option>
                    <option value="1-3-days">1-3 days</option>
                    <option value="3-7-days">3-7 days</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="more-than-2-weeks">More than 2 weeks</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-1" />
                    {t('symptom.intensity', 'Intensity')}
                  </label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('symptom.select.intensity', 'Select intensity')}</option>
                    <option value="mild">{t('symptom.mild', 'Mild')}</option>
                    <option value="moderate">{t('symptom.moderate', 'Moderate')}</option>
                    <option value="severe">{t('symptom.severe', 'Severe')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {t('symptom.location', 'Location')}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Symptoms & Results */}
          <div className="space-y-6">
            {/* Selected Symptoms */}
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {t('symptom.selected', 'Selected Symptoms')} ({selectedSymptoms.length})
              </h3>
              {selectedSymptoms.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  {t('symptom.none.selected', 'No symptoms selected yet')}
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedSymptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${getCategoryColor(symptom.category)}`}
                    >
                      <div className="flex items-center gap-2">
                        <symptom.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{symptom.name}</span>
                      </div>
                      <button
                        onClick={() => handleSymptomToggle(symptom)}
                        className="text-slate-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleCheckSymptoms}
                    disabled={loading || selectedSymptoms.length === 0}
                    className="w-full medical-button-primary py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </div>
                    ) : (
                      'Check Symptoms'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Results */}
            {results && (
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  AI Analysis Results
                </h3>
                
                {/* Urgency Level */}
                <div className={`p-3 rounded-lg border mb-4 ${getUrgencyColor(results.urgency)}`}>
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="capitalize">{results.urgency} Priority</span>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-3 mb-4">
                  {results.suggestions?.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-700">{suggestion}</p>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      <strong>Medical Disclaimer:</strong> {results.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contacts */}
            <div className="medical-card p-6 bg-red-50 border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                {t('emergency.contacts', 'Emergency Contacts')}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{t('emergency.services', 'Emergency Services')}</span>
                  <a href="tel:112" className="font-mono font-bold text-red-800 hover:underline">
                    112
                  </a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{t('ambulance', 'Ambulance')}</span>
                  <a href="tel:108" className="font-mono font-bold text-red-800 hover:underline">
                    108
                  </a>
                </div>
                <p className="text-xs text-red-600 mt-3">
                  {t('emergency.disclaimer', 'For immediate medical emergencies, call these numbers or visit the nearest hospital.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SymptomCheckerPage;

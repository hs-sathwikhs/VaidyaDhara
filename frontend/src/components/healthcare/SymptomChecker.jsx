import React, { useState } from 'react';
import './SymptomChecker.css';

const SymptomChecker = ({ 
  onSymptomSubmit, 
  currentLanguage = 'en',
  isLoading = false 
}) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [severity, setSeverity] = useState(1);
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [step, setStep] = useState(1);

  const bodyParts = {
    en: [
      { id: 'head', name: 'Head', icon: '🧠', symptoms: ['Headache', 'Dizziness', 'Memory issues'] },
      { id: 'eyes', name: 'Eyes', icon: '👁️', symptoms: ['Blurred vision', 'Eye pain', 'Redness'] },
      { id: 'throat', name: 'Throat', icon: '🫁', symptoms: ['Sore throat', 'Difficulty swallowing', 'Hoarseness'] },
      { id: 'chest', name: 'Chest', icon: '💓', symptoms: ['Chest pain', 'Shortness of breath', 'Palpitations'] },
      { id: 'stomach', name: 'Stomach', icon: '🤢', symptoms: ['Nausea', 'Stomach pain', 'Vomiting'] },
      { id: 'arms', name: 'Arms', icon: '💪', symptoms: ['Arm pain', 'Numbness', 'Weakness'] },
      { id: 'legs', name: 'Legs', icon: '🦵', symptoms: ['Leg pain', 'Swelling', 'Cramps'] },
      { id: 'skin', name: 'Skin', icon: '🩹', symptoms: ['Rash', 'Itching', 'Discoloration'] }
    ],
    hi: [
      { id: 'head', name: 'सिर', icon: '🧠', symptoms: ['सिरदर्द', 'चक्कर आना', 'याददाश्त की समस्या'] },
      { id: 'eyes', name: 'आँखें', icon: '👁️', symptoms: ['धुंधली दृष्टि', 'आंख में दर्द', 'लालिमा'] },
      { id: 'throat', name: 'गला', icon: '🫁', symptoms: ['गले में खराश', 'निगलने में कठिनाई', 'आवाज़ बैठना'] },
      { id: 'chest', name: 'छाती', icon: '💓', symptoms: ['छाती में दर्द', 'सांस लेने में कठिनाई', 'दिल की धड़कन'] },
      { id: 'stomach', name: 'पेट', icon: '🤢', symptoms: ['मतली', 'पेट दर्द', 'उल्टी'] },
      { id: 'arms', name: 'बाहें', icon: '💪', symptoms: ['बांह में दर्द', 'सुन्नता', 'कमजोरी'] },
      { id: 'legs', name: 'पैर', icon: '🦵', symptoms: ['पैर में दर्द', 'सूजन', 'ऐंठन'] },
      { id: 'skin', name: 'त्वचा', icon: '🩹', symptoms: ['रैश', 'खुजली', 'रंग बदलना'] }
    ]
  };

  const currentBodyParts = bodyParts[currentLanguage] || bodyParts.en;

  const handleBodyPartSelect = (partId) => {
    setSelectedBodyPart(partId);
    // Find the selected body part for potential future use
    // eslint-disable-next-line no-unused-vars
    const selectedPart = currentBodyParts.find(p => p.id === partId);
    setSymptoms([]);
    setStep(2);
  };

  const handleSymptomToggle = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    const symptomData = {
      bodyPart: selectedBodyPart,
      symptoms,
      severity,
      duration,
      additionalInfo,
      timestamp: new Date().toISOString()
    };
    onSymptomSubmit(symptomData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">Select the affected body part</h3>
            <div className="body-parts-grid">
              {currentBodyParts.map(part => (
                <button
                  key={part.id}
                  className={`body-part-btn ${selectedBodyPart === part.id ? 'selected' : ''}`}
                  onClick={() => handleBodyPartSelect(part.id)}
                >
                  <span className="body-icon">{part.icon}</span>
                  <span className="body-name">{part.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        const selectedPart = currentBodyParts.find(p => p.id === selectedBodyPart);
        return (
          <div className="step-content">
            <h3 className="step-title">Select your symptoms</h3>
            <div className="symptoms-list">
              {selectedPart?.symptoms.map(symptom => (
                <label key={symptom} className="symptom-checkbox">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                  />
                  <span className="checkmark"></span>
                  <span className="symptom-text">{symptom}</span>
                </label>
              ))}
            </div>
            <div className="custom-symptom">
              <label htmlFor="custom-symptom-input">Other symptoms:</label>
              <input
                id="custom-symptom-input"
                type="text"
                placeholder="Describe any other symptoms..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">Symptom Details</h3>
            
            <div className="severity-section">
              <label className="section-label">How severe is your pain/discomfort?</label>
              <div className="severity-slider">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="slider"
                />
                <div className="severity-labels">
                  <span>Mild (1)</span>
                  <span className="current-severity">Current: {severity}/10</span>
                  <span>Severe (10)</span>
                </div>
              </div>
            </div>

            <div className="duration-section">
              <label className="section-label">How long have you had these symptoms?</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="duration-select"
              >
                <option value="">Select duration</option>
                <option value="less-than-day">Less than a day</option>
                <option value="1-3-days">1-3 days</option>
                <option value="4-7-days">4-7 days</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="more-than-2-weeks">More than 2 weeks</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="symptom-checker">
      <div className="checker-header">
        <h2 className="checker-title">🩺 Symptom Checker</h2>
        <div className="step-indicator">
          {[1, 2, 3].map(num => (
            <div
              key={num}
              className={`step-dot ${step >= num ? 'active' : ''}`}
              aria-label={`Step ${num}`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="checker-content">
        {renderStep()}
      </div>

      <div className="checker-actions">
        {step > 1 && (
          <button
            className="back-btn"
            onClick={() => setStep(step - 1)}
          >
            ← Back
          </button>
        )}
        
        {step < 3 ? (
          <button
            className="next-btn"
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !selectedBodyPart) ||
              (step === 2 && symptoms.length === 0)
            }
          >
            Next →
          </button>
        ) : (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading || !duration}
          >
            {isLoading ? '🔄 Analyzing...' : '✅ Get Analysis'}
          </button>
        )}
      </div>

      <div className="checker-disclaimer">
        <p>
          ⚠️ This is not a medical diagnosis. Please consult a healthcare professional for proper medical advice.
        </p>
      </div>
    </div>
  );
};

export default SymptomChecker;

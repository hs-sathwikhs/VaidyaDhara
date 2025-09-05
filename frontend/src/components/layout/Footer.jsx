import React from 'react';
import './Footer.css';

const Footer = ({ onEmergencyClick, onPrivacyClick, onDisclaimerClick }) => {
  const emergencyNumbers = [
    { label: 'National Emergency', number: '108', description: 'Free emergency service' },
    { label: 'Ambulance', number: '102', description: 'Medical emergency' },
    { label: 'Police', number: '100', description: 'Emergency police help' },
    { label: 'Fire', number: '101', description: 'Fire emergency' }
  ];

  const handleEmergencyCall = (number) => {
    if (typeof onEmergencyClick === 'function') {
      onEmergencyClick(number);
    } else {
      // Fallback for direct calling
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      {/* Main Disclaimer Banner */}
      <div className="disclaimer-banner" role="alert" aria-live="polite">
        <div className="disclaimer-content">
          <span className="disclaimer-icon" aria-hidden="true">⚠️</span>
          <p className="disclaimer-text">
            <strong>Medical Disclaimer:</strong> This app does not provide medical advice—consult a doctor for emergencies. 
            Vaidya Dhara is for informational purposes only and should not replace professional medical consultation.
          </p>
        </div>
      </div>

      <div className="footer-content">
        {/* Emergency Contacts Section */}
        <div className="footer-section emergency-contacts">
          <h3 className="footer-heading">🚨 Emergency Contacts</h3>
          <div className="emergency-grid">
            {emergencyNumbers.map((emergency, index) => (
              <button
                key={index}
                className="emergency-contact-btn"
                onClick={() => handleEmergencyCall(emergency.number)}
                aria-label={`Call ${emergency.label} at ${emergency.number}. ${emergency.description}`}
              >
                <span className="emergency-number">{emergency.number}</span>
                <span className="emergency-label">{emergency.label}</span>
                <span className="emergency-desc">{emergency.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section quick-links">
          <h3 className="footer-heading">Quick Links</h3>
          <nav className="footer-nav" role="navigation" aria-label="Footer navigation">
            <ul className="footer-links">
              <li>
                <button 
                  className="footer-link"
                  onClick={onPrivacyClick}
                  aria-label="View privacy policy"
                >
                  🔒 Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  className="footer-link"
                  onClick={onDisclaimerClick}
                  aria-label="View full medical disclaimer"
                >
                  📋 Medical Disclaimer
                </button>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="footer-link"
                  aria-label="View terms of service"
                >
                  📄 Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="footer-link"
                  aria-label="Contact support"
                >
                  📞 Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="/accessibility" 
                  className="footer-link"
                  aria-label="Accessibility information"
                >
                  ♿ Accessibility
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* App Information */}
        <div className="footer-section app-info">
          <h3 className="footer-heading">About Vaidya Dhara</h3>
          <p className="app-description">
            Your AI-powered health companion providing reliable health information, 
            symptom guidance, and emergency support across multiple Indian languages.
          </p>
          <div className="app-features">
            <span className="feature-tag">🌐 Multi-language</span>
            <span className="feature-tag">🤖 AI-powered</span>
            <span className="feature-tag">🏥 Healthcare focused</span>
            <span className="feature-tag">🎯 Gamified learning</span>
          </div>
        </div>
      </div>

      {/* Legal and Copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © 2025 Vaidya Dhara. All rights reserved. | 
            <span className="version-info"> Version 1.0.0</span>
          </p>
          
          <div className="legal-notices">
            <span className="legal-text">
              🏥 Not a substitute for professional medical advice
            </span>
            <span className="legal-text">
              📱 For educational and informational purposes only
            </span>
          </div>

          {/* Accessibility Statement */}
          <div className="accessibility-statement">
            <p className="accessibility-text">
              <span className="sr-only">Accessibility:</span>
              This application is designed to be accessible to users with disabilities. 
              If you experience any accessibility issues, please contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden text for screen readers */}
      <div className="sr-only" aria-live="polite" id="footer-announcements">
        Emergency numbers are available above. In case of medical emergency, 
        please call 108 for immediate assistance or visit the nearest hospital.
      </div>
    </footer>
  );
};

export default Footer;

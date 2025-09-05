import React, { useState } from 'react';
import './Header.css';
import LanguageSwitcher from '../accessibility/LanguageSwitcher';
import PointsDisplay from '../gamification/PointsDisplay';

const Header = ({ userPoints = 0, onEmergencyClick, currentLanguage, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <img 
            src="/assets/logo.png" 
            alt="Vaidya Dhara - Your AI Health Companion" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="logo-text" style={{ display: 'none' }}>
            <h1 className="logo-title">🩺 Vaidya Dhara</h1>
            <span className="logo-subtitle">AI Health Companion</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav" role="navigation">
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <div className={`nav-content ${isMenuOpen ? 'nav-open' : ''}`}>
            {/* Language Switcher */}
            <div className="nav-item">
              <LanguageSwitcher 
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>

            {/* Points Display */}
            <div className="nav-item">
              <PointsDisplay points={userPoints} isCompact={true} />
            </div>

            {/* Emergency Button */}
            <div className="nav-item">
              <button 
                className="emergency-button"
                onClick={onEmergencyClick}
                aria-label="Emergency contact - Call for immediate medical help"
              >
                <span className="emergency-icon">🚨</span>
                <span className="emergency-text">Emergency</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
    </header>
  );
};

export default Header;

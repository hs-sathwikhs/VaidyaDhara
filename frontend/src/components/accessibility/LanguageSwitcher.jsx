import React, { useState } from 'react';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ 
  currentLanguage = 'en', 
  onLanguageChange,
  isCompact = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🇬🇧'
    },
    { 
      code: 'hi', 
      name: 'Hindi', 
      nativeName: 'हिन्दी',
      flag: '🇮🇳'
    },
    { 
      code: 'or', 
      name: 'Odia', 
      nativeName: 'ଓଡ଼ିଆ',
      flag: '🇮🇳'
    },
    { 
      code: 'bn', 
      name: 'Bengali', 
      nativeName: 'বাংলা',
      flag: '🇮🇳'
    },
    { 
      code: 'ta', 
      name: 'Tamil', 
      nativeName: 'தமிழ்',
      flag: '🇮🇳'
    },
    { 
      code: 'te', 
      name: 'Telugu', 
      nativeName: 'తెలుగు',
      flag: '🇮🇳'
    },
    { 
      code: 'kn', 
      name: 'Kannada', 
      nativeName: 'ಕನ್ನಡ',
      flag: '🇮🇳'
    },
    { 
      code: 'ml', 
      name: 'Malayalam', 
      nativeName: 'മലയാളം',
      flag: '🇮🇳'
    },
    { 
      code: 'gu', 
      name: 'Gujarati', 
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳'
    },
    { 
      code: 'mr', 
      name: 'Marathi', 
      nativeName: 'मराठी',
      flag: '🇮🇳'
    },
    { 
      code: 'pa', 
      name: 'Punjabi', 
      nativeName: 'ਪੰਜਾਬੀ',
      flag: '🇮🇳'
    }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e, langCode = null) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (langCode) {
        handleLanguageSelect(langCode);
      } else {
        toggleDropdown();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (isCompact) {
    return (
      <div className="language-switcher compact">
        <button
          className="language-trigger compact"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          aria-label={`Current language: ${currentLang.name}. Click to change language`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="current-flag">{currentLang.flag}</span>
          <span className="current-code">{currentLang.code.toUpperCase()}</span>
          <span className="dropdown-arrow">▼</span>
        </button>

        {isOpen && (
          <div className="language-dropdown compact" role="listbox">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${lang.code === currentLanguage ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
                onKeyDown={(e) => handleKeyDown(e, lang.code)}
                role="option"
                aria-selected={lang.code === currentLanguage}
              >
                <span className="option-flag">{lang.flag}</span>
                <span className="option-code">{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="language-switcher">
      <label className="switcher-label">
        🌐 Select Language / भाषा चुनें / ଭାଷା ବାଛନ୍ତୁ
      </label>
      
      <div className="language-selector">
        <button
          className="language-trigger"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          aria-label={`Current language: ${currentLang.name}. Click to change language`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="current-language">
            <span className="current-flag">{currentLang.flag}</span>
            <div className="current-text">
              <span className="current-name">{currentLang.name}</span>
              <span className="current-native">{currentLang.nativeName}</span>
            </div>
          </div>
          <span className="dropdown-arrow">▼</span>
        </button>

        {isOpen && (
          <>
            <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
            <div className="language-dropdown" role="listbox">
              <div className="dropdown-header">
                <span>Select your preferred language</span>
              </div>
              
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-option ${lang.code === currentLanguage ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  onKeyDown={(e) => handleKeyDown(e, lang.code)}
                  role="option"
                  aria-selected={lang.code === currentLanguage}
                >
                  <span className="option-flag">{lang.flag}</span>
                  <div className="option-text">
                    <span className="option-name">{lang.name}</span>
                    <span className="option-native">{lang.nativeName}</span>
                  </div>
                  {lang.code === currentLanguage && (
                    <span className="selected-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;

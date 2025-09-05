import React, { useState, useEffect } from 'react';
import './QuickReplies.css';

const QuickReplies = ({ 
  onReplySelect, 
  currentLanguage = 'en',
  isVisible = true,
  customReplies = []
}) => {
  const [selectedReply, setSelectedReply] = useState(null);

  // Default quick replies with multilingual support
  const defaultReplies = {
    en: [
      { id: 'fever', text: '🌡️ I have fever', emoji: '🌡️' },
      { id: 'headache', text: '🤕 Headache', emoji: '🤕' },
      { id: 'cough', text: '😷 Cough or cold', emoji: '😷' },
      { id: 'stomach', text: '🤢 Stomach pain', emoji: '🤢' },
      { id: 'emergency', text: '🚨 Emergency help', emoji: '🚨' },
      { id: 'tips', text: '💡 Health tips', emoji: '💡' },
      { id: 'medicine', text: '💊 About medicines', emoji: '💊' },
      { id: 'hospital', text: '🏥 Find hospital', emoji: '🏥' }
    ],
    hi: [
      { id: 'fever', text: '🌡️ मुझे बुखार है', emoji: '🌡️' },
      { id: 'headache', text: '🤕 सिर दर्द', emoji: '🤕' },
      { id: 'cough', text: '😷 खांसी या जुकाम', emoji: '😷' },
      { id: 'stomach', text: '🤢 पेट दर्द', emoji: '🤢' },
      { id: 'emergency', text: '🚨 आपातकालीन सहायता', emoji: '🚨' },
      { id: 'tips', text: '💡 स्वास्थ्य सुझाव', emoji: '💡' },
      { id: 'medicine', text: '💊 दवाओं के बारे में', emoji: '💊' },
      { id: 'hospital', text: '🏥 अस्पताल खोजें', emoji: '🏥' }
    ],
    or: [
      { id: 'fever', text: '🌡️ ମୋର ଜ୍ୱର ଅଛି', emoji: '🌡️' },
      { id: 'headache', text: '🤕 ମୁଣ୍ଡ ବ୍ୟଥା', emoji: '🤕' },
      { id: 'cough', text: '😷 କାଶ ବା ଥଣ୍ଡା', emoji: '😷' },
      { id: 'stomach', text: '🤢 ପେଟ ବ୍ୟଥା', emoji: '🤢' },
      { id: 'emergency', text: '🚨 ଜରୁରୀ ସହାୟତା', emoji: '🚨' },
      { id: 'tips', text: '💡 ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ', emoji: '💡' },
      { id: 'medicine', text: '💊 ଔଷଧ ବିଷୟରେ', emoji: '💊' },
      { id: 'hospital', text: '🏥 ଡାକ୍ତରଖାନା ଖୋଜ', emoji: '🏥' }
    ]
  };

  // Get current language replies or fallback to English
  const currentReplies = customReplies.length > 0 ? customReplies : 
    defaultReplies[currentLanguage] || defaultReplies.en;

  // Handle reply selection
  const handleReplyClick = (reply) => {
    setSelectedReply(reply.id);
    
    // Add small delay for visual feedback
    setTimeout(() => {
      onReplySelect(reply.text);
      setSelectedReply(null);
    }, 150);
  };

  // Reset selected reply when language changes
  useEffect(() => {
    setSelectedReply(null);
  }, [currentLanguage]);

  if (!isVisible || currentReplies.length === 0) {
    return null;
  }

  return (
    <div 
      className="quick-replies-container"
      role="region"
      aria-label="Quick reply suggestions"
    >
      <div className="quick-replies-header">
        <span className="replies-title">Quick suggestions:</span>
        <span className="replies-hint">Tap to send</span>
      </div>
      
      <div className="quick-replies-scroll">
        <div className="quick-replies-list">
          {currentReplies.map((reply) => (
            <button
              key={reply.id}
              className={`quick-reply-btn ${selectedReply === reply.id ? 'selected' : ''}`}
              onClick={() => handleReplyClick(reply)}
              aria-label={`Send message: ${reply.text}`}
              title={reply.text}
            >
              <span className="reply-emoji" aria-hidden="true">
                {reply.emoji}
              </span>
              <span className="reply-text">
                {reply.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicators */}
      <div className="scroll-indicator scroll-left" aria-hidden="true">
        ◀
      </div>
      <div className="scroll-indicator scroll-right" aria-hidden="true">
        ▶
      </div>
    </div>
  );
};

export default QuickReplies;

import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = ({ 
  botName = 'Vaidya Dhara',
  variant = 'dots', // 'dots' or 'text'
  showAvatar = true 
}) => {
  return (
    <div className="typing-indicator" role="status" aria-live="polite">
      <div className="typing-container">
        {/* Bot Avatar */}
        {showAvatar && (
          <div className="typing-avatar">
            <img 
              src="/assets/bot-avatar.png" 
              alt={`${botName} AI`}
              className="avatar-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="avatar-fallback" style={{ display: 'none' }}>
              🩺
            </div>
          </div>
        )}

        {/* Typing Content */}
        <div className="typing-content">
          {variant === 'dots' ? (
            <div className="typing-bubble">
              <div className="typing-dots" aria-label={`${botName} is typing`}>
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
              </div>
            </div>
          ) : (
            <div className="typing-text-bubble">
              <div className="typing-text">
                <span className="typing-icon">⌨️</span>
                <span className="typing-message">
                  {botName} is analyzing your message...
                </span>
                <div className="thinking-spinner"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        {botName} is currently typing a response to your message. Please wait.
      </span>
    </div>
  );
};

export default TypingIndicator;

import React, { useState, useEffect, useRef } from 'react';
import './ChatContainer.css';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';

const ChatContainer = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false, 
  error = null,
  onRetry,
  currentLanguage = 'en',
  userProfile = {}
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end' 
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle message sending
  const handleSendMessage = async (message, type = 'text') => {
    if (!message.trim() && type === 'text') return;

    try {
      setIsTyping(true);
      await onSendMessage(message, type);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle quick reply selection
  const handleQuickReply = (replyText) => {
    handleSendMessage(replyText, 'quick-reply');
  };

  // Error state
  if (error) {
    return (
      <div className="chat-container chat-error-state" role="main" aria-label="Chat interface">
        <div className="error-content">
          <div className="error-icon" aria-hidden="true">⚠️</div>
          <h2 className="error-title">Connection Error</h2>
          <p className="error-message">
            {error.message || 'Unable to connect to Vaidya Dhara. Please check your internet connection.'}
          </p>
          <button 
            className="retry-button"
            onClick={onRetry}
            aria-label="Retry connection"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state for initial load
  if (isLoading && messages.length === 0) {
    return (
      <div className="chat-container chat-loading-state" role="main" aria-label="Chat interface">
        <div className="loading-content">
          <div className="loading-avatar">
            <img src="/assets/bot-avatar.png" alt="Vaidya Dhara" className="bot-avatar" />
          </div>
          <div className="loading-text">
            <h2>Connecting to Vaidya Dhara...</h2>
            <p>Your AI health companion is starting up</p>
          </div>
          <div className="loading-spinner" aria-label="Loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container" role="main" aria-label="Chat interface">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="bot-info">
            <img 
              src="/assets/bot-avatar.png" 
              alt="Vaidya Dhara AI" 
              className="bot-header-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="bot-avatar-fallback" style={{ display: 'none' }}>🩺</div>
            <div className="bot-details">
              <h2 className="bot-name">Vaidya Dhara</h2>
              <span className="bot-status">
                <span className="status-indicator online" aria-label="Online"></span>
                Ready to help with your health questions
              </span>
            </div>
          </div>
          
          <div className="chat-actions">
            <button 
              className="clear-chat-btn"
              onClick={() => {/* Handle clear chat */}}
              aria-label="Clear chat history"
              title="Clear chat history"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="messages-container"
        ref={containerRef}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-content">
              <div className="welcome-avatar">🩺</div>
              <h3 className="welcome-title">Welcome to Vaidya Dhara!</h3>
              <p className="welcome-text">
                I'm your AI health companion. I can help you with:
              </p>
              <ul className="welcome-features">
                <li>🔍 Symptom checking and health guidance</li>
                <li>💊 Medication information</li>
                <li>🏥 Finding nearby healthcare facilities</li>
                <li>📚 Health education and tips</li>
                <li>🚨 Emergency assistance</li>
              </ul>
              <p className="welcome-disclaimer">
                <strong>Note:</strong> I provide information only. For medical emergencies, 
                please call 108 or visit the nearest hospital.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                isUser={message.sender === 'user'}
                userProfile={userProfile}
                currentLanguage={currentLanguage}
              />
            ))}
          </>
        )}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <QuickReplies 
        onReplySelect={handleQuickReply}
        currentLanguage={currentLanguage}
        isVisible={!isTyping && messages.length >= 0}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        currentLanguage={currentLanguage}
        placeholder={
          currentLanguage === 'hi' ? 'अपने लक्षण यहाँ लिखें...' :
          currentLanguage === 'or' ? 'ଆପଣଙ୍କର ଲକ୍ଷଣ ଏଠାରେ ଲେଖନ୍ତୁ...' :
          'Type your symptoms here...'
        }
      />
    </div>
  );
};

export default ChatContainer;

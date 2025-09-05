import React, { useState } from 'react';
import './MessageBubble.css';

const MessageBubble = ({ 
  message, 
  isUser = false, 
  userProfile = {},
  currentLanguage = 'en',
  onReaction,
  onCopy
}) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '👁️';
      case 'error': return '❌';
      default: return '';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy && onCopy(message.text);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleReaction = (emoji) => {
    onReaction && onReaction(message.id, emoji);
  };

  const renderMessageContent = () => {
    if (message.type === 'image') {
      return (
        <div className="message-image">
          <img 
            src={message.imageUrl} 
            alt={message.altText || 'Shared image'}
            className="bubble-image"
            loading="lazy"
          />
          {message.text && <p className="image-caption">{message.text}</p>}
        </div>
      );
    }

    if (message.type === 'audio') {
      return (
        <div className="message-audio">
          <audio controls className="audio-player">
            <source src={message.audioUrl} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
          {message.text && <p className="audio-caption">{message.text}</p>}
        </div>
      );
    }

    if (message.type === 'health-card') {
      return (
        <div className="health-card">
          <div className="health-card-header">
            <span className="health-icon">{message.icon || '🩺'}</span>
            <h4 className="health-title">{message.title}</h4>
          </div>
          <div className="health-content">
            <p className="health-description">{message.description}</p>
            {message.symptoms && (
              <ul className="symptoms-list">
                {message.symptoms.map((symptom, index) => (
                  <li key={index} className="symptom-item">
                    <span className="symptom-indicator">•</span>
                    {symptom}
                  </li>
                ))}
              </ul>
            )}
            {message.action && (
              <button 
                className="health-action-btn"
                onClick={message.action.onClick}
              >
                {message.action.text}
              </button>
            )}
          </div>
        </div>
      );
    }

    // Default text message
    return <p className="message-text">{message.text}</p>;
  };

  return (
    <div 
      className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="article"
      aria-label={`${isUser ? 'Your' : 'Vaidya Dhara'} message`}
    >
      <div className="bubble-container">
        {/* Bot Avatar */}
        {!isUser && (
          <div className="message-avatar">
            <img 
              src="/assets/bot-avatar.png" 
              alt="Vaidya Dhara AI"
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

        {/* Message Content */}
        <div className="bubble-content">
          <div className="bubble-wrapper">
            {/* Message Header (for bot messages) */}
            {!isUser && (
              <div className="message-header">
                <span className="sender-name">Vaidya Dhara</span>
                <span className="message-role">AI Health Assistant</span>
              </div>
            )}

            {/* Message Body */}
            <div className="message-body">
              {renderMessageContent()}
            </div>

            {/* Message Footer */}
            <div className="message-footer">
              <span className="message-time">
                {formatTimestamp(message.timestamp)}
              </span>
              
              {isUser && (
                <span 
                  className="message-status"
                  aria-label={`Message status: ${message.status || 'sent'}`}
                >
                  {getStatusIcon(message.status)}
                </span>
              )}
            </div>

            {/* Message Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="message-reactions">
                {message.reactions.map((reaction, index) => (
                  <span key={index} className="reaction-item">
                    {reaction.emoji} {reaction.count > 1 && reaction.count}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Message Actions */}
          {showActions && (
            <div className="message-actions" role="toolbar">
              <button 
                className="action-btn copy-btn"
                onClick={handleCopy}
                aria-label="Copy message"
                title={copied ? 'Copied!' : 'Copy message'}
              >
                {copied ? '✓' : '📋'}
              </button>
              
              {!isUser && (
                <>
                  <button 
                    className="action-btn reaction-btn"
                    onClick={() => handleReaction('👍')}
                    aria-label="Like message"
                    title="Helpful"
                  >
                    👍
                  </button>
                  <button 
                    className="action-btn reaction-btn"
                    onClick={() => handleReaction('👎')}
                    aria-label="Dislike message"
                    title="Not helpful"
                  >
                    👎
                  </button>
                </>
              )}
              
              <button 
                className="action-btn report-btn"
                onClick={() => {/* Handle report */}}
                aria-label="Report message"
                title="Report issue"
              >
                ⚠️
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="message-avatar user-avatar">
            {userProfile.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt={`${userProfile.name || 'User'}'s avatar`}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-fallback user-avatar-fallback">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '👤'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

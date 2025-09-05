import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import PointsDisplay from '../gamification/PointsDisplay';
import AchievementBadges from '../gamification/AchievementBadges';

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  chatHistory = [], 
  userPoints = 0,
  achievements = [],
  onNavigate,
  currentPage = 'chat'
}) => {
  const [healthTip, setHealthTip] = useState('');

  useEffect(() => {
    const healthTips = [
      "💧 Drink at least 8 glasses of water daily for optimal health.",
      "🥗 Include 5 servings of fruits and vegetables in your daily diet.",
      "🚶‍♂️ Take a 30-minute walk daily to boost your cardiovascular health.",
      "😴 Get 7-9 hours of quality sleep each night for better immunity.",
      "🧘‍♀️ Practice deep breathing for 5 minutes to reduce stress.",
      "🧼 Wash your hands frequently to prevent infections.",
      "🌞 Get some sunlight daily for natural Vitamin D.",
      "🍎 An apple a day keeps the doctor away - it's true!"
    ];
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setHealthTip(randomTip);
  }, []);

  const navigationItems = [
    { id: 'chat', icon: '💬', label: 'Chat', ariaLabel: 'Go to chat interface' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard', ariaLabel: 'View health dashboard' },
    { id: 'symptoms', icon: '🩺', label: 'Symptom Checker', ariaLabel: 'Check your symptoms' },
    { id: 'tips', icon: '💡', label: 'Health Tips', ariaLabel: 'Browse health tips' },
    { id: 'quiz', icon: '🎯', label: 'Health Quiz', ariaLabel: 'Take health quiz' },
    { id: 'settings', icon: '⚙️', label: 'Settings', ariaLabel: 'App settings' }
  ];

  const formatChatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
      
      <aside 
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        aria-label="Navigation and chat history"
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">Navigation</h2>
          <button 
            className="sidebar-close"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav" role="navigation">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${currentPage === item.id ? 'nav-link-active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  aria-label={item.ariaLabel}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Points and Progress Section */}
        <div className="sidebar-section">
          <h3 className="section-title">Your Progress</h3>
          <div className="points-container">
            <PointsDisplay points={userPoints} />
          </div>
          
          {achievements.length > 0 && (
            <div className="achievements-preview">
              <h4 className="achievements-title">Recent Badges</h4>
              <AchievementBadges 
                badges={achievements.slice(0, 3)} 
                isCompact={true}
              />
            </div>
          )}
        </div>

        {/* Health Tip Section */}
        <div className="sidebar-section">
          <h3 className="section-title">💡 Daily Health Tip</h3>
          <div className="health-tip-card">
            <p className="health-tip-text">{healthTip}</p>
            <button 
              className="tip-more-btn"
              onClick={() => onNavigate('tips')}
              aria-label="View more health tips"
            >
              More Tips →
            </button>
          </div>
        </div>

        {/* Recent Chat History */}
        <div className="sidebar-section chat-history-section">
          <h3 className="section-title">Recent Chats</h3>
          <div className="chat-history">
            {chatHistory.length === 0 ? (
              <p className="no-history">No recent conversations</p>
            ) : (
              <ul className="history-list">
                {chatHistory.slice(0, 5).map((chat, index) => (
                  <li key={chat.id || index} className="history-item">
                    <button 
                      className="history-link"
                      onClick={() => onNavigate('chat', chat.id)}
                      aria-label={`Resume chat: ${truncateMessage(chat.lastMessage)}`}
                    >
                      <div className="history-content">
                        <span className="history-message">
                          {truncateMessage(chat.lastMessage || 'New conversation')}
                        </span>
                        <span className="history-time">
                          {formatChatTime(chat.timestamp)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            {chatHistory.length > 5 && (
              <button 
                className="view-all-btn"
                onClick={() => onNavigate('chat-history')}
                aria-label="View all chat history"
              >
                View All Chats
              </button>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="sidebar-section emergency-section">
          <button 
            className="emergency-sidebar-btn"
            onClick={() => onNavigate('emergency')}
            aria-label="Emergency contact information"
          >
            <span className="emergency-icon">🚨</span>
            <span>Emergency Help</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

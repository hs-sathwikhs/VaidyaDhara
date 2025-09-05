import React, { useState, useEffect } from 'react';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Chat Components
import ChatContainer from './components/chat/ChatContainer';

// Healthcare Components
import SymptomChecker from './components/healthcare/SymptomChecker';

// Gamification Components
import PointsDisplay from './components/gamification/PointsDisplay';

// Accessibility Components
import LanguageSwitcher from './components/accessibility/LanguageSwitcher';

function App() {
  // State Management
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    points: 150,
    level: 3,
    achievements: []
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize app
  useEffect(() => {
    // Load user data from localStorage
    const savedLanguage = localStorage.getItem('vaidya-language');
    const savedProfile = localStorage.getItem('vaidya-profile');
    
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Add welcome message
    const welcomeMessage = {
      id: 'welcome-1',
      text: 'Hello! I\'m Vaidya Dhara, your AI health companion. How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setChatMessages([welcomeMessage]);
  }, []);

  // Save user data
  useEffect(() => {
    localStorage.setItem('vaidya-language', currentLanguage);
    localStorage.setItem('vaidya-profile', JSON.stringify(userProfile));
  }, [currentLanguage, userProfile]);

  // Handle language change
  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  // Handle navigation
  const handleNavigation = (page, params = {}) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
    
    // Handle specific navigation logic
    switch (page) {
      case 'emergency':
        handleEmergencyClick();
        break;
      case 'chat':
        if (params.chatId) {
          // Load specific chat
          loadChatHistory(params.chatId);
        }
        break;
      default:
        break;
    }
  };

  // Handle emergency
  const handleEmergencyClick = (number = '108') => {
    const confirmCall = window.confirm(
      `Are you sure you want to call emergency services (${number})? This will open your phone's dialer.`
    );
    
    if (confirmCall) {
      window.location.href = `tel:${number}`;
    }
  };

  // Handle message sending
  const handleSendMessage = async (message, type = 'text') => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = {
        id: `user-${Date.now()}`,
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type,
        status: 'sent'
      };

      setChatMessages(prev => [...prev, userMessage]);

      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const botResponse = {
          id: `bot-${Date.now()}`,
          text: `I understand you're experiencing ${message}. Let me help you with that. Based on your symptoms, I recommend consulting with a healthcare professional. In the meantime, here are some general suggestions...`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          type: 'text'
        };

        setChatMessages(prev => [...prev, botResponse]);
        
        // Award points for interaction
        setUserProfile(prev => ({
          ...prev,
          points: prev.points + 5
        }));
        
        setIsLoading(false);
      }, 2000);

    } catch (err) {
      setError({ message: 'Failed to send message. Please try again.' });
      setIsLoading(false);
    }
  };

  // Handle symptom submission
  const handleSymptomSubmit = (symptomData) => {
    const symptomMessage = `I'm experiencing ${symptomData.symptoms.join(', ')} in my ${symptomData.bodyPart}. Severity: ${symptomData.severity}/10, Duration: ${symptomData.duration}. ${symptomData.additionalInfo ? 'Additional info: ' + symptomData.additionalInfo : ''}`;
    
    handleSendMessage(symptomMessage, 'symptom-analysis');
    setCurrentPage('chat');
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(false);
  };

  // Load chat history
  const loadChatHistory = (chatId) => {
    // Implement chat history loading
    console.log('Loading chat:', chatId);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 'chat':
        return (
          <ChatContainer
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            currentLanguage={currentLanguage}
            userProfile={userProfile}
          />
        );
      
      case 'symptoms':
        return (
          <SymptomChecker
            onSymptomSubmit={handleSymptomSubmit}
            currentLanguage={currentLanguage}
            isLoading={isLoading}
          />
        );
      
      case 'dashboard':
        return (
          <div className="dashboard-placeholder">
            <h2>🏥 Health Dashboard</h2>
            <p>Your health analytics and insights will appear here.</p>
            <PointsDisplay points={userProfile.points} />
          </div>
        );
      
      case 'tips':
        return (
          <div className="tips-placeholder">
            <h2>💡 Health Tips</h2>
            <p>Helpful health tips and educational content.</p>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="quiz-placeholder">
            <h2>🎯 Health Quiz</h2>
            <p>Test your health knowledge and earn points!</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="settings-placeholder">
            <h2>⚙️ Settings</h2>
            <LanguageSwitcher 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        );
      
      default:
        return (
          <div className="page-not-found">
            <h2>🔍 Page Not Found</h2>
            <p>The requested page could not be found.</p>
            <button onClick={() => handleNavigation('chat')}>
              Go to Chat
            </button>
          </div>
        );
    }
  };

  return (
    <div className="app" data-language={currentLanguage}>
      {/* Header */}
      <Header
        userPoints={userProfile.points}
        onEmergencyClick={handleEmergencyClick}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Area */}
      <div className="app-content">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          chatHistory={chatMessages}
          userPoints={userProfile.points}
          achievements={userProfile.achievements}
          onNavigate={handleNavigation}
          currentPage={currentPage}
        />

        {/* Main Content */}
        <main className="main-content" id="main-content">
          {renderPageContent()}
        </main>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      {/* Footer */}
      <Footer
        onEmergencyClick={handleEmergencyClick}
        onPrivacyClick={() => console.log('Privacy policy')}
        onDisclaimerClick={() => console.log('Medical disclaimer')}
      />
    </div>
  );
}

export default App;

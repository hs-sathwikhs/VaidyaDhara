import React, { useState, useEffect, useRef } from 'react';
import vaidyaDharaAPI from '../api';

// Language content moved outside component to avoid dependency issues
const content = {
  en: {
    welcome: "Hello! I'm VaidyaDhara, your AI health assistant. How can I help you today?",
    placeholder: "Type your health question here...",
    send: "Send",
    connecting: "Connecting to health assistant...",
    connected: "✅ Connected to VaidyaDhara AI",
    disconnected: "❌ Connection failed - using offline mode",
    typing: "VaidyaDhara is typing...",
    error: "Sorry, I couldn't process your request. Please try again.",
    emergency: "🚨 For medical emergencies, call 108 immediately"
  },
  hi: {
    welcome: "नमस्ते! मैं वैद्यधारा हूं, आपका AI स्वास्थ्य सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?",
    placeholder: "यहाँ अपना स्वास्थ्य प्रश्न लिखें...",
    send: "भेजें",
    connecting: "स्वास्थ्य सहायक से जुड़ रहे हैं...",
    connected: "✅ वैद्यधारा AI से जुड़ाव हो गया",
    disconnected: "❌ कनेक्शन असफल - ऑफलाइन मोड का उपयोग",
    typing: "वैद्यधारा टाइप कर रहा है...",
    error: "माफ़ करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।",
    emergency: "🚨 चिकित्सा आपातकाल के लिए तुरंत 108 पर कॉल करें"
  }
};

const ChatComponent = ({ language = 'en' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const t = content[language];

  // Check backend connection on component mount
  useEffect(() => {
    checkConnection();
    // Add welcome message
    setMessages([{
      id: 1,
      type: 'bot',
      content: content[language].welcome,
      timestamp: new Date(),
      isSystem: true
    }]);
  }, [language]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkConnection = async () => {
    try {
      await vaidyaDharaAPI.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.warn('Backend not available, using offline mode');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      if (isConnected) {
        // Try to get response from backend
        response = await vaidyaDharaAPI.sendChatMessage(inputMessage, language);
      } else {
        // Fallback offline response
        response = getOfflineResponse(inputMessage);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer || response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: t.error,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback responses when backend is not available
  const getOfflineResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार')) {
      return language === 'hi' 
        ? 'बुखार के लिए आराम करें, तरल पदार्थ पिएं और यदि बुखार बना रहे तो डॉक्टर से सलाह लें।'
        : 'For fever, rest well, drink fluids, and consult a doctor if fever persists.';
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('सिरदर्द')) {
      return language === 'hi'
        ? 'सिरदर्द के लिए आराम करें, पानी पिएं और तनाव कम करें। यदि दर्द बना रहे तो चिकित्सक से सलाह लें।'
        : 'For headache, rest, drink water, and reduce stress. Consult a doctor if pain persists.';
    }
    
    return language === 'hi'
      ? 'मैं आपकी मदद करने की कोशिश कर रहा हूं। कृपया अधिक विस्तार से बताएं।'
      : 'I\'m here to help you. Please provide more details about your health concern.';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e1e5e9',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px 12px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '2rem' }}>🏥</div>
          <div>
            <h3 style={{ margin: 0, color: '#2c5aa0' }}>VaidyaDhara AI</h3>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem', 
              color: isConnected ? '#22c55e' : '#ef4444' 
            }}>
              {isConnected ? t.connected : t.disconnected}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: message.type === 'user' 
                ? '#2c5aa0' 
                : message.isError 
                  ? '#fee2e2' 
                  : '#f1f5f9',
              color: message.type === 'user' 
                ? 'white' 
                : message.isError 
                  ? '#dc2626' 
                  : '#334155',
              border: message.isError ? '1px solid #fca5a5' : 'none'
            }}>
              <div>{message.content}</div>
              <div style={{
                fontSize: '0.75rem',
                opacity: 0.7,
                marginTop: '4px',
                textAlign: message.type === 'user' ? 'right' : 'left'
              }}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              fontStyle: 'italic'
            }}>
              {t.typing}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emergency Notice */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#fef3c7',
        color: '#92400e',
        fontSize: '0.85rem',
        textAlign: 'center',
        borderTop: '1px solid #fbbf24'
      }}>
        {t.emergency}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e1e5e9',
        backgroundColor: '#f8f9fa',
        borderRadius: '0 0 12px 12px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              resize: 'none',
              minHeight: '50px',
              maxHeight: '100px',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading || !inputMessage.trim() ? '#9ca3af' : '#2c5aa0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {t.send}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

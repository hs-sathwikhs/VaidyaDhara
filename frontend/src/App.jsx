import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: "VaidyaDhara - AI Healthcare Assistant",
      subtitle: "Your AI-powered health companion",
      welcome: "Welcome to VaidyaDhara",
      description: "Get instant health guidance with our AI assistant",
      nav: {
        home: "🏠 Home",
        chat: "💬 Chat",
        tips: "💡 Tips",
        emergency: "🚨 Emergency"
      }
    },
    hi: {
      title: "वैद्यधारा - AI स्वास्थ्य सहायक",
      subtitle: "आपका AI-संचालित स्वास्थ्य साथी",
      welcome: "वैद्यधारा में आपका स्वागत है",
      description: "हमारे AI सहायक से तुरंत स्वास्थ्य मार्गदर्शन प्राप्त करें",
      nav: {
        home: "🏠 होम",
        chat: "💬 चैट",
        tips: "💡 सुझाव",
        emergency: "🚨 आपातकाल"
      }
    }
  };

  const t = content[language];

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#4a90e2',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>🏥 {t.title}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>{t.subtitle}</p>
          </div>
          
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'white',
              color: '#4a90e2',
              fontWeight: '500'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {Object.entries(t.nav).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCurrentPage(key)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: currentPage === key ? '#4a90e2' : 'transparent',
                color: currentPage === key ? 'white' : '#4a90e2',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '40px 20px', minHeight: '60vh' }}>
        {currentPage === 'home' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#334155', marginBottom: '20px' }}>{t.welcome}</h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '40px' }}>
              {t.description}
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '40px'
            }}>
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '2px solid #e1e5e9'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💬</div>
                <h3 style={{ color: '#4a90e2', margin: '0 0 10px 0' }}>AI Chat</h3>
                <p style={{ color: '#64748b', margin: 0 }}>
                  {language === 'hi' ? 'AI के साथ स्वास्थ्य चर्चा' : 'Health consultations with AI'}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '2px solid #e1e5e9'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
                <h3 style={{ color: '#4a90e2', margin: '0 0 10px 0' }}>Symptom Check</h3>
                <p style={{ color: '#64748b', margin: 0 }}>
                  {language === 'hi' ? 'लक्षणों का विश्लेषण' : 'Analyze your symptoms'}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '2px solid #e1e5e9'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌐</div>
                <h3 style={{ color: '#4a90e2', margin: '0 0 10px 0' }}>Multilingual</h3>
                <p style={{ color: '#64748b', margin: 0 }}>
                  {language === 'hi' ? 'कई भाषाओं में सहायता' : 'Support in multiple languages'}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'chat' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#334155' }}>
              {language === 'hi' ? 'AI चैट असिस्टेंट' : 'AI Chat Assistant'}
            </h2>
            <div style={{
              backgroundColor: '#f0f7ff',
              padding: '40px',
              borderRadius: '12px',
              border: '2px solid #4a90e2',
              marginTop: '30px'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤖</div>
              <h3>{language === 'hi' ? 'चैट जल्द आ रहा है!' : 'Chat Coming Soon!'}</h3>
              <p style={{ color: '#64748b' }}>
                {language === 'hi' 
                  ? 'हम आपके लिए एक बेहतरीन AI चैट अनुभव तैयार कर रहे हैं।'
                  : 'We\'re preparing an amazing AI chat experience for you.'
                }
              </p>
            </div>
          </div>
        )}

        {currentPage === 'tips' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#334155', marginBottom: '30px' }}>
              {language === 'hi' ? 'स्वास्थ्य सुझाव' : 'Health Tips'}
            </h2>
            <div style={{ 
              display: 'grid', 
              gap: '20px', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
            }}>
              {[
                { 
                  icon: '💧', 
                  title: language === 'hi' ? 'पानी पिएं' : 'Stay Hydrated', 
                  tip: language === 'hi' ? 'दिन में 8-10 गिलास पानी पिएं' : 'Drink 8-10 glasses of water daily' 
                },
                { 
                  icon: '🏃', 
                  title: language === 'hi' ? 'व्यायाम करें' : 'Exercise Regularly', 
                  tip: language === 'hi' ? 'रोज़ाना 30 मिनट व्यायाम करें' : 'Exercise for 30 minutes daily' 
                },
                { 
                  icon: '😴', 
                  title: language === 'hi' ? 'अच्छी नींद' : 'Good Sleep', 
                  tip: language === 'hi' ? '7-8 घंटे की नींद लें' : 'Get 7-8 hours of sleep' 
                },
                { 
                  icon: '🥗', 
                  title: language === 'hi' ? 'संतुलित आहार' : 'Balanced Diet', 
                  tip: language === 'hi' ? 'फल और सब्जियां खाएं' : 'Eat fruits and vegetables' 
                }
              ].map((item, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{item.icon}</div>
                  <h3 style={{ color: '#4a90e2', margin: '0 0 10px 0' }}>{item.title}</h3>
                  <p style={{ color: '#64748b', margin: 0 }}>{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'emergency' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#dc2626' }}>
              {language === 'hi' ? '🚨 आपातकालीन संपर्क' : '🚨 Emergency Contacts'}
            </h2>
            <div style={{
              backgroundColor: '#fee2e2',
              padding: '30px',
              borderRadius: '12px',
              border: '2px solid #dc2626',
              marginTop: '30px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📞</div>
              <h3 style={{ color: '#dc2626' }}>
                {language === 'hi' ? 'चिकित्सा आपातकाल: 108' : 'Medical Emergency: 108'}
              </h3>
              <p style={{ color: '#7f1d1d' }}>
                {language === 'hi' ? 'तत्काल चिकित्सा सहायता के लिए' : 'For immediate medical assistance'}
              </p>
              <div style={{ 
                marginTop: '20px', 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <a href="tel:108" style={{
                  padding: '12px 24px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  {language === 'hi' ? '108 पर कॉल करें' : 'Call 108'}
                </a>
                <a href="tel:100" style={{
                  padding: '12px 24px',
                  backgroundColor: '#1f2937',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  {language === 'hi' ? 'पुलिस 100' : 'Police 100'}
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid #e1e5e9',
        marginTop: '40px'
      }}>
        <p style={{ margin: 0, color: '#64748b' }}>
          &copy; 2024 VaidyaDhara - {language === 'hi' ? 'आपका स्वास्थ्य साथी' : 'Your Health Companion'}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', margin: '5px 0 0 0' }}>
          🚨 {language === 'hi' ? 'आपातकाल: 108 पर कॉल करें' : 'Emergency: Call 108'} | 
          {language === 'hi' 
            ? ' यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है'
            : ' This is not a substitute for professional medical advice'
          }
        </p>
      </footer>
    </div>
  );
}

export default App;

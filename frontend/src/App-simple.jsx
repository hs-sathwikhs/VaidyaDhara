import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header style={{
        backgroundColor: '#4a90e2',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🏥 Vaidya Dhara - AI Healthcare Assistant</h1>
        <p>Your AI-powered health companion supporting multiple Indian languages</p>
      </header>
      
      <main style={{ padding: '20px', minHeight: '500px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#334155', marginBottom: '20px' }}>Welcome to Vaidya Dhara</h2>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#4a90e2' }}>🩺 What we offer:</h3>
            <ul style={{ lineHeight: '1.8', color: '#64748b' }}>
              <li>AI-powered health consultations in 11 Indian languages</li>
              <li>Symptom checker with personalized recommendations</li>
              <li>24/7 emergency medical guidance</li>
              <li>Health tips and preventive care advice</li>
              <li>Gamified health tracking and rewards</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#f0f7ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #4a90e2',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#4a90e2', margin: '0 0 10px 0' }}>🚀 Quick Start</h4>
            <p style={{ margin: 0, color: '#334155' }}>
              Click on any feature below to get started with your health journey!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <button style={{
              padding: '20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              💬 Start Chat
            </button>
            
            <button style={{
              padding: '20px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              🩺 Check Symptoms
            </button>
            
            <button style={{
              padding: '20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              💡 Health Tips
            </button>
            
            <button style={{
              padding: '20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              🚨 Emergency
            </button>
          </div>

          <div style={{
            backgroundColor: '#fffbeb',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #f59e0b',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
              ⚠️ <strong>Medical Disclaimer:</strong> This chatbot provides general health information only. 
              For medical emergencies, call 102 or visit your nearest hospital immediately.
            </p>
          </div>
        </div>
      </main>

      <footer style={{
        backgroundColor: '#334155',
        color: '#f8fafc',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>
          © 2025 Vaidya Dhara - Empowering health through AI technology
        </p>
      </footer>
    </div>
  );
}

export default App;

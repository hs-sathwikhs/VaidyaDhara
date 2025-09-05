import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring for healthcare app
reportWebVitals((metric) => {
  // Log performance metrics for healthcare app optimization
  console.log('Performance metric:', metric);
  
  // You can send to analytics service here
  // analytics.track('web-vital', metric);
});

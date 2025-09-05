// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import your page components (we will create these next)
import ChatPage from './pages/ChatPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HealthTipsPage from './pages/HealthTipsPage.jsx';
import EmergencyPage from './pages/EmergencyPage.jsx';
import SymptomCheckerPage from './pages/SymptomCheckerPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The App component is our main layout with the sidebar
    children: [
      {
        index: true, // This makes ChatPage the default child route for "/"
        element: <ChatPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'symptoms',
        element: <SymptomCheckerPage />,
      },
      {
        path: 'tips',
        element: <HealthTipsPage />,
      },
      {
        path: 'emergency',
        element: <EmergencyPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
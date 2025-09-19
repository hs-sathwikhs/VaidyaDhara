// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import your page components
import ChatPage from './pages/ChatPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SymptomCheckerPage from './pages/SymptomCheckerPage.jsx';
import HealthTipsPage from './pages/HealthTipsPage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';

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
        path: 'health-tips',
        element: <HealthTipsPage />,
      },
      {
        path: 'rewards',
        element: <RewardsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
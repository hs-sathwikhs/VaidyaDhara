// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import NotFound from './components/NotFound.jsx';
import './index.css';

// Import your page components
import HomePage from './pages/HomePage.jsx';
import SimpleHomePage from './pages/SimpleHomePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import DocumentAnalyzerPage from './pages/DocumentAnalyzerPage.jsx';
import VoiceAnalyzerPage from './pages/VoiceAnalyzerPage.jsx';
import SymptomCheckerPage from './pages/SymptomCheckerPage.jsx';
import HealthTipsPage from './pages/HealthTipsPage.jsx';
import HealthGamePage from './pages/HealthGamePage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import TestPage from './pages/TestPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The App component is our main layout with the sidebar
    errorElement: <NotFound />, // Handle 404 errors
    children: [
      {
        index: true, // This makes HomePage the default child route for "/"
        element: <HomePage />,
      },
      {
        path: 'chat',
        element: <VoiceAnalyzerPage />, // Redirect chat to voice analyzer
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'admin-dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'prescription-analyzer',
        element: <DocumentAnalyzerPage />,
      },
      {
        path: 'voice-analyzer',
        element: <VoiceAnalyzerPage />,
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
        path: 'health-games',
        element: <HealthGamePage />,
      },
      {
        path: 'rewards',
        element: <RewardsPage />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: '*', // Catch-all route for unmatched paths
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
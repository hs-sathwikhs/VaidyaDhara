// src/App.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="flex h-screen bg-gray-900 text-white font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 min-h-0 overflow-auto">
            {/* Outlet is a placeholder where React Router will render the current page */}
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
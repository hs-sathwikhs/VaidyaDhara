// src/App.jsx
import { Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { useUIStore, useLocalizationStore } from './store';
import { useState } from 'react';

function App() {
  const { currentLanguage } = useLocalizationStore();
  // Sidebar toggle state (mobile/tablet)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Set this to true when you want to show the header, false to hide it
  const showHeader = true;
  const headerHeight = showHeader ? 'h-12' : 'h-0';
  const contentOffset = showHeader ? 'mt-12' : 'mt-0';
  const sidebarTop = showHeader ? 'top-12' : 'top-0';
  const sidebarHeight = showHeader ? 'h-[calc(100vh-3rem)]' : 'h-screen';

  return (
    <div key={currentLanguage} className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {showHeader && <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
      {/* Main content wrapper - offset based on header presence */}
      <div className={`flex flex-1 min-h-0 ${contentOffset}`}>
        {/* Sidebar: hidden unless toggled */}
        <div className={`fixed inset-0 z-20 bg-black/30 transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`fixed ${sidebarTop} left-0 ${sidebarHeight} z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:h-auto md:translate-x-0 md:flex md:mt-0 bg-white shadow-xl md:shadow-none`} style={{ width: '18rem', minWidth: 220, maxWidth: 320 }}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} hideLogoTitleOnDesktop={true} />
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden md:ml-0">
          {/* Outlet is a placeholder where React Router will render the current page */}
          <Outlet />
          {/* Footer always at the bottom */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
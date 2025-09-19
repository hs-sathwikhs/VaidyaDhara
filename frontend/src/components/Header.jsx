

import { useLocalizationStore } from '../store';
import { translations } from '../translations';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

function Header({ onMenuClick }) {
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => translations[currentLanguage]?.[key] || fallback;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full h-12 flex items-center justify-between px-3 md:px-6 bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 border-b border-white/10 shadow fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
        
        <img
          src="/logo.png"
          alt="Odisha Government Logo"
          className="h-7 w-7 md:h-8 md:w-8 rounded-full border border-white/80 bg-white object-contain"
          style={{ background: '#fff' }}
        />
        <div className="flex items-baseline gap-1 md:gap-2">
          <h1 className="text-sm md:text-lg font-semibold text-white tracking-wide leading-none">
            {t('header.title', 'Government Of Odisha')}
          </h1>
          <span className="hidden md:inline text-xs md:text-sm text-blue-100 font-medium leading-none">
            {t('header.subtitle', 'ଓଡିଶା ସರକାར')}
          </span>
        </div>
      </div>
      <div className="text-right text-white font-mono leading-none">
        {/* Mobile: Stack date and time */}
        <div className="md:hidden">
          <div className="text-[10px]">{now.toLocaleDateString()}</div>
          <div className="text-[10px]">{now.toLocaleTimeString()}</div>
        </div>
        {/* Desktop: Single line with bullet separator */}
        <div className="hidden md:block text-xs">
          {now.toLocaleDateString()} • {now.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}

export default Header;

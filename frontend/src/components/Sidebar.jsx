// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Heart, Activity, Shield, Award } from 'lucide-react';
import { useLocalizationStore } from '../store';
import { translations } from '../translations';


function Sidebar({ hideLogoTitleOnDesktop }) {
  const { currentLanguage } = useLocalizationStore();

  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'sidebar-nav-active'
        : 'sidebar-nav-inactive'
    }`;

  return (
    <div className="flex flex-col h-full w-72 bg-white/95 backdrop-blur-sm border-r border-slate-200 overflow-y-auto">
      {/* Header - Always show on mobile, hide on desktop if prop is set */}
      <div className={`flex items-center gap-3 p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-teal-50 ${hideLogoTitleOnDesktop ? 'md:hidden' : ''}`}>
        <div className="relative">
          <Heart className="w-10 h-10 text-blue-500" />
          <Activity className="w-4 h-4 text-teal-500 absolute -bottom-1 -right-1" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            {t('app.name', 'Vaidya Dhara')}
          </h1>
          <p className="text-sm text-slate-500 font-medium">{t('app.subtitle', 'Your AI Health Companion')}</p>
        </div>
      </div>

      {/* Main content wrapper with flex-1 to push disclaimer to bottom */}
      <div className="flex-1 flex flex-col p-6">
        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {t('nav.menu', 'Menu')}
          </h3>
          <NavLink to="/" className={navLinkClasses}>
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{t('nav.chat', 'Health Chat')}</span>
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClasses}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">{t('nav.dashboard', 'Analytics Dashboard')}</span>
          </NavLink>
          <NavLink to="/symptoms" className={navLinkClasses}>
            <Activity className="w-5 h-5" />
            <span className="font-medium">{t('nav.symptoms', 'Symptom Checker')}</span>
          </NavLink>
          <NavLink to="/health-tips" className={navLinkClasses}>
            <Shield className="w-5 h-5" />
            <span className="font-medium">{t('nav.tips', 'Health Tips')}</span>
          </NavLink>
          <NavLink to="/rewards" className={navLinkClasses}>
            <Award className="w-5 h-5" />
            <span className="font-medium">{t('nav.rewards', 'Rewards & Points')}</span>
          </NavLink>
        </nav>

        {/* Spacer to push disclaimer to bottom */}
        <div className="flex-1" />

        {/* Health Disclaimer */}
        <div className="medical-card p-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm text-slate-700">{t('medical.disclaimer', 'Medical Disclaimer')}</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('disclaimer.short', 'This AI assistant provides general health information only. Always consult with qualified healthcare professionals for medical advice.')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
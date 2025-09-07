// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, FileText, GraduationCap, Gamepad2, 
  Heart, Activity, Sparkles, ArrowRight, Mic, Globe 
} from 'lucide-react';
import { useLocalizationStore, useUserStore } from '../store';
import { translations } from '../translations/index.js';
import AdminLogin from '../components/AdminLogin';

function HomePage() {
  const navigate = useNavigate();
  const { currentLanguage, availableLanguages, setLanguage } = useLocalizationStore();
  const { profile, setAdminStatus } = useUserStore();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Translation function
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  // Handle admin login
  const handleAdminLogin = (isSuccess) => {
    if (isSuccess) {
      setAdminStatus(true);
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setAdminStatus(false);
  };

  const mainActions = [
    {
      icon: Mic,
      title: t('voice_analyzer.title', 'RISHI Voice Health Assistant'),
      description: t('voice_analyzer.subtitle', 'Complete health support with voice, chat, and prescription analysis'),
      path: '/voice-analyzer',
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-700'
    },
    {
      icon: FileText,
      title: t('home.analyze_document', 'Analyse your document'),
      description: t('home.analyze_desc', 'Upload prescriptions for AI analysis'),
      path: '/prescription-analyzer',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      icon: GraduationCap,
      title: t('home.health_education', 'Health Education'),
      description: t('home.education_desc', 'Learn about health through interactive content'),
      path: '/health-tips',
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'hover:from-orange-600 hover:to-red-600'
    },
    {
      icon: Gamepad2,
      title: t('home.explore_games', 'Explore Games'),
      description: t('home.games_desc', 'Learn health through interactive scenarios'),
      path: '/health-games',
      gradient: 'from-blue-500 to-teal-500',
      hoverGradient: 'hover:from-blue-600 hover:to-teal-600'
    }
  ];

  const ActionButton = ({ icon: Icon, title, description, path, gradient, hoverGradient }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full p-6 rounded-2xl bg-gradient-to-r ${gradient} ${hoverGradient} text-white text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl group`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6" />
        <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90 leading-relaxed">{description}</p>
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Language Selector */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
            <Globe className="w-4 h-4 text-white/70" />
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-800 text-white">
                  {lang.native}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
              {t('home.meet_ai', 'Meet RISHI - Your AI-Powered Health Companion!')}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t('home.master_health', 'Master Your Health, ')}
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              {t('home.secure_future', "Secure India's Future")}
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('home.description', 'Accessible health guidance for everyone in India. Learn, plan, and grow your health knowledge with personalized guidance and AI-driven insights.')}
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {mainActions.map((action, index) => (
            <ActionButton key={index} {...action} />
          ))}
        </div>

        {/* Features Highlight */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full">
                <Heart className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{t('home.ai_powered', 'AI-Powered Health Assistant')}</h3>
              <p className="text-slate-300 text-sm">{t('home.ai_desc', 'Get instant, personalized health advice 24/7')}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{t('home.multi_language', 'Multi-Language Support')}</h3>
              <p className="text-slate-300 text-sm">{t('home.language_desc', 'Available in Hindi, English, and Kannada')}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
                <GraduationCap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{t('home.gamified_learning', 'Gamified Learning')}</h3>
              <p className="text-slate-300 text-sm">{t('home.gamified_desc', 'Learn through interactive health scenarios')}</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <MessageSquare className="w-5 h-5" />
            {t('home.start_journey', 'Start Your Health Journey')}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-slate-400 text-sm mt-4">
            {t('home.free_service', 'Free service • No registration required • Secure & Private')}
          </p>
        </div>

        {/* Admin Toggle for Demo */}
        <div className="mt-8 text-center">
          {profile.isAdmin ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full text-green-800 text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Admin Mode Active
              </div>
              <div>
                <button
                  onClick={handleAdminLogout}
                  className="px-4 py-2 bg-slate-600 text-white hover:bg-slate-700 rounded-full text-sm font-medium transition-all duration-200"
                >
                  Logout from Admin
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Admin Login
            </button>
          )}
          <p className="text-slate-400 text-xs mt-2">
            {profile.isAdmin 
              ? 'Admin dashboard available in sidebar' 
              : 'Access admin features with proper authentication'}
          </p>
        </div>

        {/* Admin Login Modal */}
        <AdminLogin
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          onLogin={handleAdminLogin}
        />
      </div>
    </div>
  );
}

export default HomePage;

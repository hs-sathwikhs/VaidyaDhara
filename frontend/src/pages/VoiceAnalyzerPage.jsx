// src/pages/VoiceAnalyzerPage.jsx
import React from 'react';
import VoicePrescriptionAnalyzer from '../components/VoicePrescriptionAnalyzer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalizationStore } from '../store';
import { translations } from '../translations/index.js';

function VoiceAnalyzerPage() {
  const navigate = useNavigate();
  const { currentLanguage } = useLocalizationStore();
  
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {t('voice_analyzer.title', 'Voice Prescription Assistant')}
            </h1>
            <p className="text-slate-400 mt-1">
              {t('voice_analyzer.subtitle', 'Speak or upload prescriptions for instant AI analysis')}
            </p>
          </div>
        </div>
      </div>

      {/* Voice Analyzer Component */}
      <div className="flex-1 overflow-hidden">
        <VoicePrescriptionAnalyzer />
      </div>
    </div>
  );
}

export default VoiceAnalyzerPage;

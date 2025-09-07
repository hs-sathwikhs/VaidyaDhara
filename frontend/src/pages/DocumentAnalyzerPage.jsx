// src/pages/DocumentAnalyzerPage.jsx
import React from 'react';
import PrescriptionAnalyzerStandalone from '../components/PrescriptionAnalyzerStandalone';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalizationStore } from '../store';
import { translations } from '../translations/index.js';

function DocumentAnalyzerPage() {
  const navigate = useNavigate();
  const { currentLanguage } = useLocalizationStore();
  
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t('prescription_analyzer.title', 'Prescription Analyzer')}
            </h1>
            <p className="text-slate-600 mt-1">
              {t('prescription_analyzer.subtitle', 'Upload and analyze your prescription documents with AI')}
            </p>
          </div>
        </div>
      </div>

      {/* Prescription Analyzer Component */}
      <div className="p-6">
        <PrescriptionAnalyzerStandalone />
      </div>
    </div>
  );
}

export default DocumentAnalyzerPage;

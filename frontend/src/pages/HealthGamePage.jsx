// src/pages/HealthGamePage.jsx
import React, { useState } from 'react';
import HealthGameEngine from '../components/HealthGameEngine';
import { ArrowLeft, Brain, Trophy, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalizationStore, useUserStore } from '../store';
import { translations } from '../translations/index.js';

function HealthGamePage() {
  const navigate = useNavigate();
  const { currentLanguage } = useLocalizationStore();
  const { profile } = useUserStore();
  const [isGameOpen, setIsGameOpen] = useState(false);
  
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {t('health_game.title', 'Daily Health Quiz')}
            </h1>
            <p className="text-slate-600 mt-1">
              {t('health_game.subtitle', 'Test your health knowledge with daily MCQ challenges')}
            </p>
          </div>
        </div>
      </div>

      {/* Game Overview */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('game.welcome_title', 'Welcome to Daily Health Quiz')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('game.welcome_desc', 'Answer 10 health questions daily and earn points while learning!')}
              </p>
            </div>

            {/* Game Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 mb-2">
                  {t('game.earn_points', 'Earn Points')}
                </h3>
                <p className="text-blue-700 text-sm">
                  {t('game.points_desc', '1 point for each correct answer')}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Brain className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 mb-2">
                  {t('game.learn_daily', 'Learn Daily')}
                </h3>
                <p className="text-green-700 text-sm">
                  {t('game.daily_desc', '10 new questions every day')}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Flame className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-900 mb-2">
                  {t('game.build_streak', 'Build Streaks')}
                </h3>
                <p className="text-purple-700 text-sm">
                  {t('game.streak_desc', 'Play daily to maintain your streak')}
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={() => setIsGameOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t('game.start_quiz', 'Start Daily Quiz')}
              </button>
            </div>
          </div>

          {/* User Stats (if available) */}
          {profile && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('game.your_progress', 'Your Progress')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg">
                  <div className="text-2xl font-bold">{profile.totalPoints || 0}</div>
                  <div className="text-sm opacity-90">{t('game.total_points', 'Total Points')}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg">
                  <div className="text-2xl font-bold">{profile.badges?.length || 0}</div>
                  <div className="text-sm opacity-90">{t('game.badges', 'Badges')}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg">
                  <div className="text-2xl font-bold">
                    {(() => {
                      const today = new Date().toDateString();
                      const progress = localStorage.getItem(`healthGameProgress_${today}`);
                      return progress ? JSON.parse(progress).streak : 1;
                    })()}
                  </div>
                  <div className="text-sm opacity-90">{t('game.current_streak', 'Current Streak')}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg">
                  <div className="text-2xl font-bold">
                    {(() => {
                      const today = new Date().toDateString();
                      const progress = localStorage.getItem(`healthGameProgress_${today}`);
                      return progress ? JSON.parse(progress).questionsAnswered : 0;
                    })()}
                  </div>
                  <div className="text-sm opacity-90">{t('game.today_completed', 'Today Completed')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MCQ Game Component */}
      <HealthGameEngine 
        isOpen={isGameOpen} 
        onClose={() => setIsGameOpen(false)} 
      />
    </div>
  );
}

export default HealthGamePage;

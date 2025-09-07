// src/components/HealthGameEngine.jsx
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Trophy, Target, Brain, Heart, Zap, Star, ChevronRight, 
  CheckCircle, XCircle, Clock, Award, Flame, Calendar
} from 'lucide-react';
import { useUserStore, useLocalizationStore } from '../store';
import { translations } from '../translations/index.js';
import { getDailyMCQs } from '../data/mcqQuestions';

const HealthGameEngine = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [dailyProgress, setDailyProgress] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 1,
    pointsEarned: 0
  });

  const { profile, addPoints, unlockBadge } = useUserStore();
  const { currentLanguage } = useLocalizationStore();

  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  useEffect(() => {
    if (isOpen) {
      loadDailyQuestions();
      loadDailyProgress();
    }
  }, [isOpen, currentLanguage]);

  const loadDailyQuestions = () => {
    const questions = getDailyMCQs(currentLanguage);
    setDailyQuestions(questions);
  };

  const loadDailyProgress = () => {
    const today = new Date().toDateString();
    const savedProgress = localStorage.getItem(`healthGameProgress_${today}`);
    
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setDailyProgress(progress);
      
      if (progress.questionsAnswered >= 10) {
        setGameCompleted(true);
      }
    } else {
      // Reset progress for new day
      setDailyProgress({
        questionsAnswered: 0,
        correctAnswers: 0,
        streak: getDailyStreak(),
        pointsEarned: 0
      });
    }
  };

  const getDailyStreak = () => {
    // Check if user played yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `healthGameProgress_${yesterday.toDateString()}`;
    const yesterdayProgress = localStorage.getItem(yesterdayKey);
    
    if (yesterdayProgress) {
      const progress = JSON.parse(yesterdayProgress);
      return progress.streak + 1;
    }
    return 1;
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResult(true);
    
    const currentQ = dailyQuestions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      addPoints(1, 'Daily Health Quiz');
      
      // Check for badges
      if (score + 1 === 5) {
        unlockBadge('Quiz Novice - 5 Correct Answers');
      } else if (score + 1 === 10) {
        unlockBadge('Quiz Expert - Perfect Daily Score');
      }
    }
    
    // Update daily progress
    const updatedProgress = {
      ...dailyProgress,
      questionsAnswered: dailyProgress.questionsAnswered + 1,
      correctAnswers: dailyProgress.correctAnswers + (isCorrect ? 1 : 0),
      pointsEarned: dailyProgress.pointsEarned + (isCorrect ? 1 : 0)
    };
    
    setDailyProgress(updatedProgress);
    
    // Save progress
    const today = new Date().toDateString();
    localStorage.setItem(`healthGameProgress_${today}`, JSON.stringify(updatedProgress));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < dailyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowResult(false);
    } else {
      setGameCompleted(true);
      
      // Award bonus points for completion
      if (score >= 8) {
        addPoints(2, 'Daily Quiz Bonus - High Score');
        unlockBadge('Daily Health Champion');
      }
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsAnswered(false);
    setScore(0);
    setGameCompleted(false);
  };

  if (!isOpen) return null;

  // Show loading state if questions are not loaded yet
  if (dailyQuestions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t('game.loading', 'Loading Quiz Questions...')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('game.preparing', 'Preparing your daily health quiz')}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('common.close', 'Close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = dailyQuestions[currentQuestion];
  const progress = ((currentQuestion + (isAnswered ? 1 : 0)) / dailyQuestions.length) * 100;

  if (gameCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('game.completed', 'Daily Quiz Completed!')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('game.final_score', `Your Score: ${score}/10`)}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">{t('game.points_earned', 'Points Earned')}</span>
                <span className="font-bold text-green-700">+{dailyProgress.pointsEarned}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">{t('game.daily_streak', 'Daily Streak')}</span>
                <span className="font-bold text-blue-700 flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {dailyProgress.streak}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                {t('common.close', 'Close')}
              </button>
              <button
                onClick={resetGame}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
              >
                {t('game.review', 'Review')}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              {t('game.come_back_tomorrow', 'Come back tomorrow for new questions!')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              {t('game.daily_health_quiz', 'Daily Health Quiz')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t('game.question', 'Question')} {currentQuestion + 1}/10</span>
              <span>{t('game.score', 'Score')}: {score}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Daily Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{dailyProgress.streak}</div>
              <div className="text-sm text-blue-700 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" />
                {t('game.streak', 'Streak')}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{dailyProgress.pointsEarned}</div>
              <div className="text-sm text-green-700">{t('game.points', 'Points')}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{dailyProgress.correctAnswers}</div>
              <div className="text-sm text-purple-700">{t('game.correct', 'Correct')}</div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                {currentQ.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full capitalize">
                {currentQ.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
              
              if (!isAnswered) {
                buttonClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
              } else if (index === currentQ.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && index === currentQ.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {isAnswered && index === selectedAnswer && index !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                {t('game.explanation', 'Explanation')}
              </h4>
              <p className="text-blue-800">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
              >
                {currentQuestion < dailyQuestions.length - 1 ? t('game.next', 'Next Question') : t('game.finish', 'Finish Quiz')}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthGameEngine;

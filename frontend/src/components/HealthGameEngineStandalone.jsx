// src/components/HealthGameEngineStandalone.jsx
import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Target, Brain, Heart, Zap, Star, ChevronRight, RotateCcw } from 'lucide-react';
import { useUserStore, useLocalizationStore } from '../store';
import { translations } from '../translations/index.js';

const HealthGameEngineStandalone = () => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalPoints: 0,
    scenariosCompleted: 0,
    correctAnswers: 0,
    streakDays: 0
  });

  const { profile, addPoints } = useUserStore();
  const { currentLanguage } = useLocalizationStore();

  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  // Category icons and colors
  const categoryConfig = {
    nutrition: { icon: Heart, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    exercise: { icon: Zap, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    mental_health: { icon: Brain, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
    preventive: { icon: Shield, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' }
  };

  // Demo scenarios
  const demoScenarios = [
    {
      id: 1,
      category: 'nutrition',
      title: 'Healthy Breakfast Choice',
      description: 'You are rushing to work and need to grab a quick breakfast. Which option would be the healthiest choice for sustained energy throughout the morning?',
      difficulty: 'easy',
      points: 10,
      options: [
        {
          id: 'a',
          text: 'A sugary donut and coffee',
          points: 0,
          feedback: 'This choice provides quick energy but leads to a sugar crash later.'
        },
        {
          id: 'b',
          text: 'Oatmeal with fruits and nuts',
          points: 10,
          feedback: 'Excellent choice! This provides sustained energy, fiber, and essential nutrients.',
          isCorrect: true
        },
        {
          id: 'c',
          text: 'Energy drink and protein bar',
          points: 5,
          feedback: 'Better than a donut, but still contains processed ingredients and excess caffeine.'
        },
        {
          id: 'd',
          text: 'Skip breakfast entirely',
          points: 0,
          feedback: 'Skipping breakfast can lead to overeating later and decreased concentration.'
        }
      ]
    },
    {
      id: 2,
      category: 'exercise',
      title: 'Office Worker Exercise',
      description: 'You work at a desk job for 8 hours a day. What\'s the best way to incorporate physical activity into your routine?',
      difficulty: 'medium',
      points: 15,
      options: [
        {
          id: 'a',
          text: 'Exercise for 2 hours on weekends only',
          points: 5,
          feedback: 'Weekend warrior approach has some benefits but daily movement is more effective.'
        },
        {
          id: 'b',
          text: 'Take a 30-minute walk during lunch break daily',
          points: 15,
          feedback: 'Perfect! Regular daily movement improves circulation, mood, and overall health.',
          isCorrect: true
        },
        {
          id: 'c',
          text: 'Do desk stretches every few hours',
          points: 10,
          feedback: 'Good start, but adding cardiovascular exercise would be even better.'
        },
        {
          id: 'd',
          text: 'Wait until after work to exercise',
          points: 8,
          feedback: 'Exercise is great, but breaking up sitting time during the day is also important.'
        }
      ]
    },
    {
      id: 3,
      category: 'mental_health',
      title: 'Stress Management',
      description: 'You\'re feeling overwhelmed with work and personal responsibilities. What\'s the most effective immediate stress relief technique?',
      difficulty: 'medium',
      points: 15,
      options: [
        {
          id: 'a',
          text: 'Binge-watch TV shows to distract yourself',
          points: 2,
          feedback: 'Temporary distraction but doesn\'t address the root cause of stress.'
        },
        {
          id: 'b',
          text: 'Practice deep breathing exercises for 5 minutes',
          points: 15,
          feedback: 'Excellent! Deep breathing activates the parasympathetic nervous system and reduces stress hormones.',
          isCorrect: true
        },
        {
          id: 'c',
          text: 'Have a few drinks to relax',
          points: 0,
          feedback: 'Alcohol may temporarily numb stress but can worsen anxiety and create dependency.'
        },
        {
          id: 'd',
          text: 'Ignore the stress and push through',
          points: 1,
          feedback: 'Ignoring stress can lead to burnout and physical health problems.'
        }
      ]
    },
    {
      id: 4,
      category: 'preventive',
      title: 'Sleep Hygiene',
      description: 'You want to improve your sleep quality. Which habit would have the most positive impact on your sleep?',
      difficulty: 'easy',
      points: 10,
      options: [
        {
          id: 'a',
          text: 'Use electronic devices right before bed',
          points: 0,
          feedback: 'Blue light from screens can interfere with melatonin production and disrupt sleep.'
        },
        {
          id: 'b',
          text: 'Drink coffee late in the evening',
          points: 0,
          feedback: 'Caffeine can stay in your system for 6-8 hours and disrupt sleep patterns.'
        },
        {
          id: 'c',
          text: 'Create a consistent bedtime routine',
          points: 10,
          feedback: 'Perfect! A consistent routine signals your body that it\'s time to wind down and sleep.',
          isCorrect: true
        },
        {
          id: 'd',
          text: 'Exercise vigorously right before bed',
          points: 3,
          feedback: 'Vigorous exercise close to bedtime can be stimulating and delay sleep onset.'
        }
      ]
    }
  ];

  useEffect(() => {
    // Load initial scenario
    if (!currentScenario) {
      loadNewScenario();
    }
  }, []);

  const loadNewScenario = async () => {
    setIsLoading(true);
    setShowResult(false);
    setSelectedOption(null);
    setScenarioResult(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const randomScenario = demoScenarios[Math.floor(Math.random() * demoScenarios.length)];
      setCurrentScenario(randomScenario);
      setIsLoading(false);
    }, 1000);
  };

  const submitAnswer = () => {
    if (!selectedOption || !currentScenario) return;
    
    const selectedAnswerOption = currentScenario.options.find(opt => opt.id === selectedOption);
    const pointsEarned = selectedAnswerOption.points;
    
    // Update game stats
    setGameStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + pointsEarned,
      scenariosCompleted: prev.scenariosCompleted + 1,
      correctAnswers: prev.correctAnswers + (selectedAnswerOption.isCorrect ? 1 : 0)
    }));
    
    // Add points to user profile
    addPoints(pointsEarned, 'health_game');
    
    setScenarioResult({
      selectedAnswer: selectedAnswerOption,
      pointsEarned,
      isCorrect: selectedAnswerOption.isCorrect
    });
    
    setShowResult(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('health_game_loading', 'Loading new health scenario...')}</p>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <Gamepad2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {t('health_game_welcome', 'Welcome to Health Decision Game!')}
          </h2>
          <p className="text-slate-600 mb-6">
            {t('health_game_description', 'Test your health knowledge through interactive scenarios and earn points!')}
          </p>
          <button
            onClick={loadNewScenario}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('health_game_start', 'Start Playing')}
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = categoryConfig[currentScenario.category] || categoryConfig.nutrition;
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-slate-600">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{gameStats.totalPoints}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-slate-600">Completed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{gameStats.scenariosCompleted}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-slate-600">Correct</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{gameStats.correctAnswers}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-slate-600">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {gameStats.scenariosCompleted > 0 ? Math.round((gameStats.correctAnswers / gameStats.scenariosCompleted) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Current Scenario */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${categoryInfo.color}`}>
            <CategoryIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.bgColor} ${categoryInfo.textColor}`}>
                {currentScenario.category.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {currentScenario.difficulty.toUpperCase()}
              </span>
              <span className="text-sm text-slate-500">+{currentScenario.points} points</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{currentScenario.title}</h2>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 text-lg leading-relaxed">{currentScenario.description}</p>
        </div>

        {!showResult ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Choose your answer:</h3>
            <div className="space-y-3">
              {currentScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {selectedOption === option.id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{option.text}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={submitAnswer}
              disabled={!selectedOption}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              {t('health_game_submit', 'Submit Answer')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result Display */}
            <div className={`p-6 rounded-lg ${
              scenarioResult.isCorrect 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {scenarioResult.isCorrect ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${
                    scenarioResult.isCorrect ? 'text-green-800' : 'text-orange-800'
                  }`}>
                    {scenarioResult.isCorrect 
                      ? t('health_game_correct', 'Correct!') 
                      : t('health_game_incorrect', 'Not quite right, but you learned something!')}
                  </h3>
                  <p className={`text-sm ${
                    scenarioResult.isCorrect ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    You earned {scenarioResult.pointsEarned} points
                  </p>
                </div>
              </div>
              
              <p className={`${
                scenarioResult.isCorrect ? 'text-green-700' : 'text-orange-700'
              }`}>
                {scenarioResult.selectedAnswer.feedback}
              </p>
            </div>

            {/* Show correct answer if wrong */}
            {!scenarioResult.isCorrect && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Correct Answer:</h4>
                <p className="text-blue-700">
                  {currentScenario.options.find(opt => opt.isCorrect)?.text}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  {currentScenario.options.find(opt => opt.isCorrect)?.feedback}
                </p>
              </div>
            )}

            <button
              onClick={loadNewScenario}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t('health_game_next', 'Next Scenario')}
            </button>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {t('health_game_tips', 'Health Gaming Tips')}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <span>Each scenario teaches real health concepts you can apply daily</span>
          </div>
          <div className="flex items-start gap-2">
            <Trophy className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <span>Earn points and compete with friends for motivation</span>
          </div>
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Focus on understanding the reasoning behind each answer</span>
          </div>
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>Apply these learnings to improve your actual health habits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthGameEngineStandalone;

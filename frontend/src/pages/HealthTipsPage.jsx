// src/pages/HealthTipsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Heart, Star, BookOpen, Share, Search, Filter, 
  Droplets, Apple, Dumbbell, Moon, Shield, Sun,
  Award, Clock, User, TrendingUp
} from 'lucide-react';
import { healthTipsAPI } from '../api';
import { useHealthStore, useUserStore, useLocalizationStore } from '../store';
import { translations } from '../translations';

function HealthTipsPage() {
  const [healthTips, setHealthTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Translation function
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };
  const [loading, setLoading] = useState(true);

  const { addHealthTip, getFavoriteHealthTips } = useHealthStore();
  const { addPoints, unlockBadge } = useUserStore();

  const categories = [
    { id: 'all', name: t('tips.all', 'All Tips'), icon: BookOpen, color: 'text-slate-600' },
    { id: 'nutrition', name: t('tips.nutrition', 'Nutrition'), icon: Apple, color: 'text-green-600' },
    { id: 'exercise', name: t('tips.exercise', 'Exercise'), icon: Dumbbell, color: 'text-blue-600' },
    { id: 'hydration', name: t('tips.hydration', 'Hydration'), icon: Droplets, color: 'text-cyan-600' },
    { id: 'sleep', name: t('tips.sleep', 'Sleep'), icon: Moon, color: 'text-purple-600' },
    { id: 'mental-health', name: t('tips.mental.health', 'Mental Health'), icon: Heart, color: 'text-pink-600' },
    { id: 'prevention', name: t('tips.prevention', 'Prevention'), icon: Shield, color: 'text-orange-600' },
    { id: 'daily-habits', name: t('tips.daily.habits', 'Daily Habits'), icon: Sun, color: 'text-yellow-600' },
  ];

  const sampleTips = [
    {
      id: 1,
      title: "Stay Hydrated Throughout the Day",
      description: "Drink at least 8-10 glasses of water daily to maintain proper hydration. Water helps regulate body temperature, lubricates joints, and aids in digestion.",
      category: "hydration",
      difficulty: "easy",
      points: 5,
      readTime: "2 min",
      author: "Dr. Vaidya Dhara",
      likes: 124,
      isFavorite: false,
      tips: [
        "Start your day with a glass of warm water",
        "Keep a water bottle with you at all times",
        "Add lemon or cucumber for flavor",
        "Monitor your urine color - pale yellow is ideal"
      ]
    },
    {
      id: 2,
      title: "The Power of 30-Minute Daily Walking",
      description: "Regular walking for just 30 minutes can significantly improve cardiovascular health, strengthen bones, and boost mental well-being.",
      category: "exercise",
      difficulty: "easy",
      points: 10,
      readTime: "3 min",
      author: "Dr. Fitness Expert",
      likes: 89,
      isFavorite: false,
      tips: [
        "Walk briskly for better cardiovascular benefits",
        "Choose stairs over elevators when possible",
        "Walk with friends or family for motivation",
        "Track your steps using a smartphone app"
      ]
    },
    {
      id: 3,
      title: "Balanced Nutrition: The 5-Color Rule",
      description: "Include fruits and vegetables of 5 different colors in your daily diet to ensure you get a wide variety of nutrients and antioxidants.",
      category: "nutrition",
      difficulty: "medium",
      points: 15,
      readTime: "4 min",
      author: "Nutritionist",
      likes: 156,
      isFavorite: false,
      tips: [
        "Red: Tomatoes, bell peppers, strawberries",
        "Orange: Carrots, oranges, sweet potatoes",
        "Yellow: Bananas, corn, yellow squash",
        "Green: Leafy greens, broccoli, peas",
        "Blue/Purple: Blueberries, eggplant, purple cabbage"
      ]
    },
    {
      id: 4,
      title: "Quality Sleep: The 3-2-1 Rule",
      description: "Follow the 3-2-1 rule for better sleep: Stop eating 3 hours before bed, stop drinking 2 hours before, and stop screens 1 hour before sleep.",
      category: "sleep",
      difficulty: "medium",
      points: 12,
      readTime: "3 min",
      author: "Sleep Specialist",
      likes: 203,
      isFavorite: false,
      tips: [
        "Create a consistent bedtime routine",
        "Keep your bedroom cool and dark",
        "Use comfortable pillows and mattress",
        "Practice deep breathing exercises before sleep"
      ]
    },
    {
      id: 5,
      title: "Mental Health: The 5-4-3-2-1 Grounding Technique",
      description: "When feeling anxious, use this grounding technique: Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      category: "mental-health",
      difficulty: "easy",
      points: 8,
      readTime: "2 min",
      author: "Mental Health Professional",
      likes: 267,
      isFavorite: false,
      tips: [
        "Practice this technique daily for better results",
        "Use it during stressful situations",
        "Teach it to family members",
        "Combine with deep breathing for enhanced effect"
      ]
    }
  ];

  useEffect(() => {
    const loadHealthTips = async () => {
      setLoading(true);
      try {
        const response = await healthTipsAPI.getDailyTips();
        if (response.tips && response.tips.length > 0) {
          setHealthTips(response.tips);
        } else {
          setHealthTips(sampleTips);
        }
      } catch (error) {
        setHealthTips(sampleTips);
      } finally {
        setLoading(false);
      }
    };

    loadHealthTips();
  }, []);

  useEffect(() => {
    let filtered = healthTips;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tip => tip.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(tip =>
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTips(filtered);
  }, [healthTips, selectedCategory, searchTerm]);

  const handleToggleFavorite = (tipId) => {
    setHealthTips(prev =>
      prev.map(tip =>
        tip.id === tipId
          ? { ...tip, isFavorite: !tip.isFavorite }
          : tip
      )
    );
    
    // Award points for favoriting tips
    addPoints(2, 'favorite_tip');
  };

  const handleReadTip = (tip) => {
    // Award points for reading tips
    addPoints(tip.points, 'read_tip');
    
    // Check for reading badges
    const totalTips = healthTips.filter(t => t.isRead).length + 1;
    if (totalTips === 5) {
      unlockBadge('Knowledge Seeker');
    }
    if (totalTips === 20) {
      unlockBadge('Health Expert');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'text-slate-600';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading health tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('tips.title', 'Health Tips & Wellness Guide')}</h1>
            <p className="text-slate-600 mt-1">
              {t('tips.description', 'Discover evidence-based health tips to improve your daily wellness')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('tips.search', 'Search tips...')}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="medical-card p-4 sticky top-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('tips.categories', 'Categories')}
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : category.color}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="ml-auto text-xs bg-slate-100 px-2 py-1 rounded-full">
                        {healthTips.filter(tip => category.id === 'all' || tip.category === category.id).length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tips Content */}
          <div className="flex-1">
            {filteredTips.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No tips found</h3>
                <p className="text-slate-600">
                  Try adjusting your search terms or category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredTips.map((tip) => {
                  const CategoryIcon = getCategoryIcon(tip.category);
                  return (
                    <div key={tip.id} className="medical-card p-6 hover:shadow-lg transition-all duration-200">
                      {/* Tip Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500`}>
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                              {tip.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tip.readTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {tip.author}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleToggleFavorite(tip.id)}
                          className={`p-2 rounded-full transition-colors ${
                            tip.isFavorite
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${tip.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Tip Content */}
                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {tip.description}
                      </p>

                      {/* Action Tips */}
                      {tip.tips && (
                        <div className="mb-4">
                          <h4 className="font-medium text-slate-900 mb-2">Quick Actions:</h4>
                          <ul className="space-y-1">
                            {tip.tips.slice(0, 3).map((actionTip, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                                {actionTip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tip Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(tip.difficulty)}`}>
                            {tip.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-slate-600">
                            <Award className="w-3 h-3" />
                            {tip.points} pts
                          </span>
                          <span className="flex items-center gap-1 text-sm text-slate-600">
                            <Heart className="w-3 h-3" />
                            {tip.likes}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <Share className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReadTip(tip)}
                            className="medical-button-secondary text-sm px-4 py-2"
                          >
                            {t('tips.read.more', 'Read More')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTipsPage;

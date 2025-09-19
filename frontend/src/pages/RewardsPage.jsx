// src/pages/RewardsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Award, Star, Gift, Trophy, Target, TrendingUp, 
  Calendar, Heart, MessageSquare, Activity, BookOpen,
  Crown, Zap, Shield, Users
} from 'lucide-react';
import { useUserStore, useChatStore, useHealthStore, useLocalizationStore } from '../store';
import { translations } from '../translations';

function RewardsPage() {
  const { profile, addPoints, unlockBadge, getLevel, getPointsToNextLevel } = useUserStore();
  const { messages } = useChatStore();
  const { symptoms, healthTips } = useHealthStore();
  
  // Translation function
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [pointsToNext, setPointsToNext] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  useEffect(() => {
    setCurrentLevel(getLevel());
    setPointsToNext(getPointsToNextLevel());
    
    // Generate weekly progress data
    const weekData = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        points: Math.floor(Math.random() * 30) + 10 // Random points for demo
      });
    }
    setWeeklyProgress(weekData);
  }, [profile.points, getLevel, getPointsToNextLevel]);

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Welcome to Vaidya Dhara! You've started your health journey.",
      icon: Heart,
      points: 10,
      unlocked: true,
      color: "from-pink-500 to-red-500"
    },
    {
      id: 2,
      title: "Chatty Helper",
      description: "Had 10 conversations with the AI assistant.",
      icon: MessageSquare,
      points: 50,
      unlocked: messages.length >= 10,
      color: "from-blue-500 to-teal-500",
      progress: Math.min(messages.length, 10),
      max: 10
    },
    {
      id: 3,
      title: "Symptom Detective",
      description: "Used the symptom checker 5 times.",
      icon: Activity,
      points: 30,
      unlocked: symptoms.length >= 5,
      color: "from-orange-500 to-red-500",
      progress: Math.min(symptoms.length, 5),
      max: 5
    },
    {
      id: 4,
      title: "Knowledge Seeker",
      description: "Read 15 health tips.",
      icon: BookOpen,
      points: 40,
      unlocked: false,
      color: "from-green-500 to-blue-500",
      progress: 8,
      max: 15
    },
    {
      id: 5,
      title: "Health Champion",
      description: "Reached 500 health points.",
      icon: Trophy,
      points: 100,
      unlocked: profile.points >= 500,
      color: "from-yellow-500 to-orange-500",
      progress: Math.min(profile.points, 500),
      max: 500
    },
    {
      id: 6,
      title: "Weekly Warrior",
      description: "Logged in 7 days in a row.",
      icon: Calendar,
      points: 75,
      unlocked: false,
      color: "from-purple-500 to-pink-500",
      progress: 4,
      max: 7
    }
  ];

  const dailyTasks = [
    {
      id: 1,
      title: t('rewards.ask.question', "Ask a Health Question"),
      description: t('rewards.ask.question.desc', "Have a conversation with the AI assistant"),
      icon: MessageSquare,
      points: 10,
      completed: messages.length > 0,
      color: "text-blue-600"
    },
    {
      id: 2,
      title: t('rewards.read.tip', "Read a Health Tip"),
      description: t('rewards.read.tip.desc', "Learn something new about wellness"),
      icon: BookOpen,
      points: 5,
      completed: false,
      color: "text-green-600"
    },
    {
      id: 3,
      title: t('rewards.check.symptoms', "Check Your Symptoms"),
      description: t('rewards.check.symptoms.desc', "Use the symptom checker tool"),
      icon: Activity,
      points: 15,
      completed: symptoms.length > 0,
      color: "text-orange-600"
    },
    {
      id: 4,
      title: t('rewards.share.knowledge', "Share Health Knowledge"),
      description: t('rewards.share.knowledge.desc', "Share a tip with family or friends"),
      icon: Users,
      points: 20,
      completed: false,
      color: "text-purple-600"
    }
  ];

  const rewards = [
    {
      id: 1,
      title: "Free Health Consultation",
      description: "30-minute consultation with a qualified healthcare professional",
      points: 500,
      icon: Shield,
      available: profile.points >= 500,
      color: "from-blue-500 to-teal-500"
    },
    {
      id: 2,
      title: "Premium Health Report",
      description: "Detailed personalized health analysis and recommendations",
      points: 300,
      icon: Award,
      available: profile.points >= 300,
      color: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "Wellness Kit",
      description: "Basic health monitoring tools and educational materials",
      points: 200,
      icon: Gift,
      available: profile.points >= 200,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "Health Badge",
      description: "Digital certificate of health awareness completion",
      points: 100,
      icon: Trophy,
      available: profile.points >= 100,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Expert': return Crown;
      case 'Advanced': return Trophy;
      case 'Intermediate': return Award;
      default: return Star;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'from-purple-600 to-pink-600';
      case 'Advanced': return 'from-yellow-500 to-orange-500';
      case 'Intermediate': return 'from-blue-500 to-teal-500';
      default: return 'from-green-500 to-blue-500';
    }
  };

  const handleClaimReward = (reward) => {
    if (profile.points >= reward.points) {
      addPoints(-reward.points, `claimed_${reward.title.toLowerCase().replace(' ', '_')}`);
      // In a real app, you'd also handle the reward fulfillment
      alert(`Congratulations! You've claimed: ${reward.title}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('rewards.title', 'Rewards & Achievements')}</h1>
            <p className="text-slate-600 mt-1">
              {t('rewards.description', 'Earn points and unlock rewards for staying healthy and engaged')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-600">{t('rewards.total.points', 'Total Points')}</p>
              <p className="text-2xl font-bold text-blue-600">{profile.points.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Level Progress */}
        <div className="medical-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getLevelColor(currentLevel)} flex items-center justify-center`}>
                {React.createElement(getLevelIcon(currentLevel), { className: "w-8 h-8 text-white" })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t(`rewards.level.${currentLevel.toLowerCase()}`, currentLevel)}</h2>
                <p className="text-slate-600">{t('rewards.level.current', 'Current Level')}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-slate-600">{t('rewards.points.next', 'Points to next level')}</p>
              <p className="text-lg font-semibold text-blue-600">
                {pointsToNext > 0 ? pointsToNext : t('rewards.max.level', 'Max Level!')}
              </p>
            </div>
          </div>
          
          {pointsToNext > 0 && (
            <div>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>{t('rewards.progress.next', 'Progress to next level')}</span>
                <span>{profile.points} / {profile.points + pointsToNext}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(profile.points / (profile.points + pointsToNext)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Daily Tasks */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            {t('rewards.daily.tasks', 'Daily Tasks')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyTasks.map((task) => {
              const Icon = task.icon;
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    task.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      task.completed 
                        ? 'bg-green-500' 
                        : 'bg-gradient-to-r from-blue-500 to-teal-500'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium text-blue-600">
                          +{task.points} {t('rewards.points', 'points')}
                        </span>
                        {task.completed ? (
                          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current" />
                            {t('rewards.completed', 'Completed')}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">{t('rewards.pending', 'Pending')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.unlocked
                      ? 'border-yellow-200 bg-yellow-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${achievement.color} mx-auto mb-3 flex items-center justify-center ${
                      !achievement.unlocked ? 'opacity-50 grayscale' : ''
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      {achievement.description}
                    </p>
                    
                    {achievement.progress !== undefined && (
                      <div className="mb-3">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(achievement.progress / achievement.max) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {achievement.progress} / {achievement.max}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium text-blue-600">
                        +{achievement.points} points
                      </span>
                      {achievement.unlocked && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-500" />
            Available Rewards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <div
                  key={reward.id}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    reward.available
                      ? 'border-purple-200 bg-purple-50 hover:border-purple-300'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${reward.color} flex items-center justify-center ${
                      !reward.available ? 'opacity-50 grayscale' : ''
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {reward.title}
                      </h4>
                      <p className="text-sm text-slate-600 mb-3">
                        {reward.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-600">
                          {reward.points} points
                        </span>
                        <button
                          onClick={() => handleClaimReward(reward)}
                          disabled={!reward.available}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            reward.available
                              ? 'medical-button-primary'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {reward.available ? 'Claim Reward' : 'Not Available'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Weekly Progress
          </h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-slate-200 rounded-t-lg relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-teal-500 rounded-t-lg transition-all duration-500 flex items-end justify-center min-h-[20px]"
                    style={{ height: `${(day.points / 40) * 120}px` }}
                  >
                    <span className="text-white text-xs font-medium mb-1">
                      {day.points}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-600 mt-2 font-medium">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;

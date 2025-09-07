// src/components/KnowledgeRadar.jsx
import React, { useState, useEffect } from 'react';
import { Radar, TrendingUp, BookOpen, Target, Award, ChevronRight, ExternalLink, Play, Clock } from 'lucide-react';
import { useUserStore, useChatStore, useLocalizationStore } from '../store';
import { translations } from '../translations';

const KnowledgeRadar = ({ isOpen, onClose }) => {
  const [knowledgeProfile, setKnowledgeProfile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [recommendations, setRecommendations] = useState([]);
  
  const { profile } = useUserStore();
  const { messages } = useChatStore();
  const { currentLanguage } = useLocalizationStore();

  // Translation function
  const t = (key, fallback = key) => {
    const translation = translations[currentLanguage]?.[key];
    return translation || fallback;
  };

  // Category colors and names
  const categoryConfig = {
    nutrition: { 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      name: 'Nutrition & Diet',
      icon: '🥗'
    },
    exercise_fitness: { 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      name: 'Exercise & Fitness',
      icon: '💪'
    },
    mental_health: { 
      color: 'text-purple-600', 
      bg: 'bg-purple-100', 
      name: 'Mental Health',
      icon: '🧠'
    },
    preventive_care: { 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      name: 'Preventive Care',
      icon: '🏥'
    },
    chronic_diseases: { 
      color: 'text-orange-600', 
      bg: 'bg-orange-100', 
      name: 'Chronic Diseases',
      icon: '💊'
    },
    emergency_care: { 
      color: 'text-pink-600', 
      bg: 'bg-pink-100', 
      name: 'Emergency Care',
      icon: '🚑'
    },
    reproductive_health: { 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100', 
      name: 'Reproductive Health',
      icon: '👶'
    },
    substance_use: { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      name: 'Substance Use',
      icon: '🚭'
    }
  };

  const analyzeKnowledge = async () => {
    if (!profile?.id || messages.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
        timestamp: msg.timestamp
      }));

      const response = await fetch('http://localhost:8000/api/analyze-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: profile.id,
          conversation_history: conversationHistory
        })
      });

      const data = await response.json();
      setKnowledgeProfile(data.user_knowledge_profile);

      // Get learning recommendations
      const recResponse = await fetch('http://localhost:8000/api/learning-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: profile.id,
          conversation_history: conversationHistory
        })
      });

      const recData = await recResponse.json();
      setRecommendations(recData.recommendations || []);

    } catch (error) {
      console.error('Knowledge analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      analyzeKnowledge();
    }
  }, [isOpen]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Moderate';
    return 'Needs Focus';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <Radar className="w-6 h-6" />
              <h2 className="text-xl font-semibold">
                {t('knowledge_radar_title', 'Health Knowledge Radar')}
              </h2>
            </div>
            
            {knowledgeProfile && (
              <div className="text-right">
                <div className="text-sm opacity-90">
                  {t('knowledge_radar_overall_score', 'Overall Health Literacy')}
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(knowledgeProfile.overall_health_literacy_score)}%
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'gaps', 'recommendations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'overview' && t('knowledge_radar_overview', 'Overview')}
                  {tab === 'gaps' && t('knowledge_radar_gaps', 'Knowledge Gaps')}
                  {tab === 'recommendations' && t('knowledge_radar_recommendations', 'Learning Resources')}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {isAnalyzing ? (
              // Loading State
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">
                  {t('knowledge_radar_analyzing', 'Analyzing your health knowledge...')}
                </span>
              </div>
            ) : !knowledgeProfile ? (
              // No Data State
              <div className="text-center py-12">
                <Radar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('knowledge_radar_no_data', 'Start Chatting to Analyze Knowledge')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('knowledge_radar_no_data_desc', 'Have a conversation with Vaidya Dhara to analyze your health knowledge.')}
                </p>
                <button
                  onClick={onClose}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('knowledge_radar_start_chat', 'Start Chatting')}
                </button>
              </div>
            ) : (
              // Content based on selected tab
              <div>
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Overall Score Card */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {t('knowledge_radar_health_literacy', 'Health Literacy Score')}
                        </h3>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getScoreBg(knowledgeProfile.overall_health_literacy_score)}`}>
                          {getScoreLabel(knowledgeProfile.overall_health_literacy_score)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-purple-600">
                          {Math.round(knowledgeProfile.overall_health_literacy_score)}%
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                              style={{ width: `${knowledgeProfile.overall_health_literacy_score}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {t('knowledge_radar_based_on_conversations', 'Based on your conversations and questions')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category Scores */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {t('knowledge_radar_category_breakdown', 'Knowledge by Health Category')}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(knowledgeProfile.category_scores || {}).map(([category, score]) => {
                          const config = categoryConfig[category] || categoryConfig.nutrition;
                          return (
                            <div key={category} className="bg-white border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{config.icon}</span>
                                  <span className="font-medium text-gray-900">
                                    {config.name}
                                  </span>
                                </div>
                                <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                                  {Math.round(score)}%
                                </span>
                              </div>
                              
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    score >= 80 ? 'bg-green-500' :
                                    score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {knowledgeProfile.conversation_analysis?.total_queries || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t('knowledge_radar_questions_asked', 'Questions Asked')}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {knowledgeProfile.identified_knowledge_gaps?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t('knowledge_radar_areas_to_improve', 'Areas to Improve')}
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">
                          {knowledgeProfile.learning_recommendations?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t('knowledge_radar_recommendations', 'Personalized Recommendations')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'gaps' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('knowledge_radar_identified_gaps', 'Identified Knowledge Gaps')}
                    </h3>
                    
                    {knowledgeProfile.identified_knowledge_gaps?.length > 0 ? (
                      <div className="space-y-4">
                        {knowledgeProfile.identified_knowledge_gaps.map((gap, index) => (
                          <div key={index} className="border rounded-lg p-5 bg-white">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{gap.topic}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-gray-600 capitalize">
                                    {gap.category?.replace('_', ' ')}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    gap.severity === 'high' ? 'bg-red-100 text-red-800' :
                                    gap.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {gap.severity?.toUpperCase()} PRIORITY
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                  {Math.round(gap.priority_score || 0)}
                                </div>
                                <div className="text-xs text-gray-500">Priority</div>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-4">{gap.description}</p>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">
                                {t('knowledge_radar_suggested_resources', 'Suggested Learning Resources')}:
                              </h5>
                              <ul className="space-y-1">
                                {gap.recommended_resources?.map((resource, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                    <ChevronRight className="w-3 h-3" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {t('knowledge_radar_no_gaps', 'No Major Knowledge Gaps Identified')}
                        </h4>
                        <p className="text-gray-600">
                          {t('knowledge_radar_keep_learning', 'Keep asking questions to get more personalized insights!')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'recommendations' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('knowledge_radar_personalized_learning', 'Personalized Learning Recommendations')}
                    </h3>
                    
                    {recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="border rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                rec.resource_type === 'video' ? 'bg-red-100' :
                                rec.resource_type === 'article' ? 'bg-blue-100' :
                                rec.resource_type === 'interactive' ? 'bg-green-100' :
                                'bg-purple-100'
                              }`}>
                                {rec.resource_type === 'video' && <Play className="w-6 h-6 text-red-600" />}
                                {rec.resource_type === 'article' && <BookOpen className="w-6 h-6 text-blue-600" />}
                                {rec.resource_type === 'interactive' && <Target className="w-6 h-6 text-green-600" />}
                                {rec.resource_type === 'quiz' && <Award className="w-6 h-6 text-purple-600" />}
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg mb-2">{rec.topic}</h4>
                                <p className="text-gray-700 mb-3">{rec.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {rec.estimated_time}
                                  </div>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    rec.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                                    rec.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {rec.difficulty_level}
                                  </div>
                                </div>
                                
                                {rec.resource_url && (
                                  <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                                    <ExternalLink className="w-4 h-4" />
                                    {t('knowledge_radar_start_learning', 'Start Learning')}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {t('knowledge_radar_no_recommendations', 'No Recommendations Yet')}
                        </h4>
                        <p className="text-gray-600">
                          {t('knowledge_radar_more_conversations', 'Have more conversations to get personalized learning suggestions!')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeRadar;

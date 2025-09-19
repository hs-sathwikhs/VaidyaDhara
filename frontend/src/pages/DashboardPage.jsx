// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Users, MessageSquare, Activity, TrendingUp, Heart, 
  Shield, AlertCircle, Calendar, MapPin, Clock
} from 'lucide-react';
import { analyticsAPI } from '../api';
import { useHealthStore, useLocalizationStore } from '../store';
import { translations } from '../translations';

function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  const { setAnalytics: setStoreAnalytics } = useHealthStore();
  
  // Translation function
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await analyticsAPI.getHealthMetrics();
        setAnalytics(data);
        setStoreAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, setStoreAnalytics]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading health analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const MetricCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
    <div className="medical-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-600`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title', 'Health Analytics Dashboard')}</h1>
            <p className="text-slate-600 mt-1">{t('dashboard.overview', 'Monitor public health trends and AI interactions')}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={MessageSquare}
            title="Total Health Queries"
            value={analytics?.totalQueries?.toLocaleString() || '0'}
            change={12}
            color="blue"
          />
          <MetricCard
            icon={Users}
            title="Active Users"
            value={analytics?.activeUsers?.toLocaleString() || '0'}
            change={8}
            color="green"
          />
          <MetricCard
            icon={Activity}
            title="Symptom Checks"
            value="326"
            change={15}
            color="orange"
          />
          <MetricCard
            icon={Heart}
            title="Health Tips Shared"
            value="1,247"
            change={23}
            color="pink"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Interactions Chart */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Daily Interactions</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Trend over time</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.dailyInteractions || []}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorInteractions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Symptoms Chart */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Most Common Symptoms</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <AlertCircle className="w-4 h-4" />
                <span>Query analysis</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topSymptoms || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regional Distribution */}
          <div className="medical-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-900">Regional Usage</h3>
            </div>
            <div className="space-y-3">
              {[
                { region: 'Odisha', users: 45, percentage: 35 },
                { region: 'West Bengal', users: 32, percentage: 25 },
                { region: 'Jharkhand', users: 28, percentage: 22 },
                { region: 'Bihar', users: 23, percentage: 18 },
              ].map((item) => (
                <div key={item.region} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.region}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-8">{item.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Categories */}
          <div className="medical-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-slate-900">Health Categories</h3>
            </div>
            <div className="space-y-3">
              {[
                { category: 'General Health', count: 156, color: 'bg-blue-500' },
                { category: 'Symptoms', count: 98, color: 'bg-red-500' },
                { category: 'Prevention', count: 87, color: 'bg-green-500' },
                { category: 'Mental Health', count: 65, color: 'bg-purple-500' },
                { category: 'Emergency', count: 23, color: 'bg-orange-500' },
              ].map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-slate-700">{item.category}</span>
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="medical-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-900">System Health</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">API Response Time</span>
                <span className="text-sm font-medium text-green-600">342ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Uptime</span>
                <span className="text-sm font-medium text-green-600">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">AI Accuracy</span>
                <span className="text-sm font-medium text-blue-600">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">User Satisfaction</span>
                <span className="text-sm font-medium text-blue-600">4.7/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="medical-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { time: '2 minutes ago', activity: 'New user registered from Bhubaneswar', type: 'user' },
              { time: '5 minutes ago', activity: 'Symptom check completed for fever symptoms', type: 'symptom' },
              { time: '12 minutes ago', activity: 'Health tip shared: "Importance of staying hydrated"', type: 'tip' },
              { time: '18 minutes ago', activity: 'Emergency contact requested for Cuttack', type: 'emergency' },
              { time: '25 minutes ago', activity: 'AI model updated with latest health guidelines', type: 'system' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'user' ? 'bg-green-500' :
                  item.type === 'symptom' ? 'bg-orange-500' :
                  item.type === 'tip' ? 'bg-blue-500' :
                  item.type === 'emergency' ? 'bg-red-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{item.activity}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
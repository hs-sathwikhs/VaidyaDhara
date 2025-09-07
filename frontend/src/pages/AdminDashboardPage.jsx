// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Users, MessageSquare, Activity, TrendingUp, Heart, 
  Shield, AlertCircle, Calendar, MapPin, Clock, 
  Database, Server, Cpu, HardDrive, Globe, UserCheck
} from 'lucide-react';
import { analyticsAPI } from '../api';
import { useHealthStore, useLocalizationStore, useUserStore } from '../store';
import { translations } from '../translations';
import { Navigate } from 'react-router-dom';

function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const { setAnalytics: setStoreAnalytics } = useHealthStore();
  const { profile } = useUserStore();
  
  // Translation function
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  // Check if user is admin
  const isAdmin = profile.role === 'admin' || profile.isAdmin || false;

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await analyticsAPI.getAdminAnalytics();
        setAnalytics(data);
        setStoreAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch admin analytics:', error);
        // Mock data for demo purposes
        setAnalytics({
          totalUsers: 15420,
          activeUsers: 8930,
          totalChats: 45890,
          avgSessionTime: '12:34',
          healthQueries: 23450,
          emergencyContacts: 89,
          documentsAnalyzed: 1240,
          gamesPlayed: 5670,
          systemHealth: {
            cpu: 68,
            memory: 72,
            disk: 45,
            network: 95
          },
          userGrowth: [
            { date: '2025-01-01', users: 1200 },
            { date: '2025-01-15', users: 2800 },
            { date: '2025-02-01', users: 5600 },
            { date: '2025-02-15', users: 8900 },
            { date: '2025-03-01', users: 12300 },
            { date: '2025-03-15', users: 15420 },
          ],
          queryCategories: [
            { name: 'General Health', value: 35, color: '#3B82F6' },
            { name: 'Symptoms', value: 28, color: '#10B981' },
            { name: 'Medications', value: 18, color: '#F59E0B' },
            { name: 'Emergency', value: 12, color: '#EF4444' },
            { name: 'Mental Health', value: 7, color: '#8B5CF6' }
          ],
          regionData: [
            { region: 'North India', users: 4200, queries: 12400 },
            { region: 'South India', users: 3800, queries: 11200 },
            { region: 'West India', users: 3600, queries: 10800 },
            { region: 'East India', users: 2400, queries: 7200 },
            { region: 'Northeast', users: 1420, queries: 4290 }
          ]
        });
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
          <p className="text-slate-600">Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const MetricCard = ({ icon: Icon, title, value, change, color = "blue", subtitle }) => (
    <div className="medical-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-600`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
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

  const SystemHealthCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-600">{title}</span>
        </div>
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'system', label: 'System', icon: Server },
    { id: 'regions', label: 'Regions', icon: Globe }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>
              <p className="opacity-90">System monitoring and user analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              Admin Access
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="24h" className="text-slate-900">Last 24 hours</option>
              <option value="7d" className="text-slate-900">Last 7 days</option>
              <option value="30d" className="text-slate-900">Last 30 days</option>
              <option value="90d" className="text-slate-900">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex space-x-8">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={Users}
                title="Total Users"
                value={analytics.totalUsers?.toLocaleString()}
                change={12}
                color="blue"
                subtitle="Registered accounts"
              />
              <MetricCard
                icon={MessageSquare}
                title="Total Chats"
                value={analytics.totalChats?.toLocaleString()}
                change={8}
                color="green"
                subtitle="AI conversations"
              />
              <MetricCard
                icon={UserCheck}
                title="Active Users"
                value={analytics.activeUsers?.toLocaleString()}
                change={15}
                color="purple"
                subtitle="Last 7 days"
              />
              <MetricCard
                icon={Clock}
                title="Avg Session"
                value={analytics.avgSessionTime}
                change={-3}
                color="orange"
                subtitle="Per user session"
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* User Growth Chart */}
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">User Growth Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3B82F6" 
                      fill="url(#userGrowthGradient)" 
                    />
                    <defs>
                      <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Query Categories */}
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Health Query Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.queryCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.queryCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {analytics.queryCategories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-slate-600">{category.name}</span>
                      <span className="text-xs text-slate-500 ml-auto">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <MetricCard
              icon={Users}
              title="Total Registered"
              value={analytics.totalUsers?.toLocaleString()}
              color="blue"
            />
            <MetricCard
              icon={Activity}
              title="Daily Active"
              value={analytics.activeUsers?.toLocaleString()}
              color="green"
            />
            <MetricCard
              icon={Heart}
              title="Health Queries"
              value={analytics.healthQueries?.toLocaleString()}
              color="red"
            />
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SystemHealthCard
                title="CPU Usage"
                value={analytics.systemHealth?.cpu}
                icon={Cpu}
                color="from-blue-500 to-blue-600"
              />
              <SystemHealthCard
                title="Memory"
                value={analytics.systemHealth?.memory}
                icon={Database}
                color="from-green-500 to-green-600"
              />
              <SystemHealthCard
                title="Disk Space"
                value={analytics.systemHealth?.disk}
                icon={HardDrive}
                color="from-orange-500 to-orange-600"
              />
              <SystemHealthCard
                title="Network"
                value={analytics.systemHealth?.network}
                icon={Globe}
                color="from-purple-500 to-purple-600"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <MetricCard
                icon={AlertCircle}
                title="Emergency Calls"
                value={analytics.emergencyContacts}
                color="red"
                subtitle="This month"
              />
              <MetricCard
                icon={Shield}
                title="Documents Analyzed"
                value={analytics.documentsAnalyzed?.toLocaleString()}
                color="purple"
                subtitle="Prescriptions analyzed"
              />
            </div>
          </>
        )}

        {/* Regions Tab */}
        {activeTab === 'regions' && (
          <div className="medical-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Regional Usage Statistics</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" name="Users" />
                <Bar dataKey="queries" fill="#10B981" name="Queries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;

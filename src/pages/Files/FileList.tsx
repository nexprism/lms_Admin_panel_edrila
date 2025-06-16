import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Users, 
  Clock, 
  TrendingUp, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  PlayCircle,
  Pause,
  SkipForward,
  SkipBack,
  Shield,
  RefreshCw,
  ExternalLink,
  User,
  Video,
  Globe,
  Smartphone,
  Monitor,
  Loader,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area , Pie} from 'recharts';

const VideoAnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    charts: true,
    videos: true,
    users: true,
    security: true
  });

  // Dynamic data states
  const [analytics, setAnalytics] = useState({
    overview: {},
    timeSeriesData: [],
    videoPerformance: [],
    userEngagement: [],
    platformStats: [],
    deviceStats: [],
    securityIncidents: [],
    courses: []
  });

  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  const metricOptions = [
    { value: 'views', label: 'Video Views' },
    { value: 'watch_time', label: 'Watch Time' },
    { value: 'completion', label: 'Completion Rate' },
    { value: 'engagement', label: 'Engagement Score' },
    { value: 'downloads', label: 'Downloads' }
  ];

  // Mock data generation function
  const generateMockData = () => {
    const courses = [
      { id: 'cs101', name: 'Computer Science 101', videos: 45 },
      { id: 'math201', name: 'Advanced Mathematics', videos: 32 },
      { id: 'phys101', name: 'Physics Fundamentals', videos: 28 },
      { id: 'chem101', name: 'Chemistry Basics', videos: 23 },
      { id: 'bio201', name: 'Biology Advanced', videos: 38 }
    ];

    const overview = {
      totalViews: 125840,
      totalWatchTime: 8926, // hours
      activeUsers: 3429,
      totalVideos: 166,
      avgCompletionRate: 73.2,
      avgEngagementScore: 8.4,
      totalDownloads: 12847,
      securityIncidents: 3
    };

    const timeSeriesData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 5000) + 2000,
      watchTime: Math.floor(Math.random() * 300) + 150,
      users: Math.floor(Math.random() * 200) + 100,
      completionRate: Math.random() * 30 + 60,
      downloads: Math.floor(Math.random() * 100) + 50
    }));

    const videoPerformance = Array.from({ length: 20 }, (_, i) => ({
      id: `vid_${i + 1}`,
      title: `Lecture ${i + 1}: ${['Introduction', 'Fundamentals', 'Advanced Topics', 'Case Studies', 'Applications'][Math.floor(Math.random() * 5)]}`,
      course: courses[Math.floor(Math.random() * courses.length)].name,
      views: Math.floor(Math.random() * 10000) + 1000,
      watchTime: Math.floor(Math.random() * 120) + 30,
      completionRate: Math.random() * 40 + 50,
      engagement: Math.random() * 5 + 5,
      downloads: Math.floor(Math.random() * 500) + 50,
      duration: Math.floor(Math.random() * 60) + 10,
      uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    const userEngagement = Array.from({ length: 15 }, (_, i) => ({
      userId: `user_${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      totalWatchTime: Math.floor(Math.random() * 500) + 50,
      videosWatched: Math.floor(Math.random() * 50) + 10,
      avgCompletionRate: Math.random() * 40 + 50,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      coursesEnrolled: Math.floor(Math.random() * 5) + 1,
      downloads: Math.floor(Math.random() * 20) + 1
    }));

    const platformStats = [
      { name: 'Web', value: 45, color: '#8884d8' },
      { name: 'Mobile App', value: 35, color: '#82ca9d' },
      { name: 'Tablet', value: 20, color: '#ffc658' }
    ];

    const deviceStats = [
      { name: 'Desktop', value: 40, color: '#8884d8' },
      { name: 'Mobile', value: 35, color: '#82ca9d' },
      { name: 'Tablet', value: 25, color: '#ffc658' }
    ];

    const securityIncidents = [
      {
        id: 1,
        type: 'Unauthorized Access Attempt',
        severity: 'Medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Multiple failed login attempts detected',
        status: 'Investigating'
      },
      {
        id: 2,
        type: 'Suspicious Download Pattern',
        severity: 'Low',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'User downloaded 50+ videos in short timeframe',
        status: 'Resolved'
      },
      {
        id: 3,
        type: 'API Rate Limit Exceeded',
        severity: 'High',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        description: 'Potential automated scraping attempt',
        status: 'Blocked'
      }
    ];

    return {
      overview,
      timeSeriesData,
      videoPerformance,
      userEngagement,
      platformStats,
      deviceStats,
      securityIncidents,
      courses
    };
  };

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAnalytics(generateMockData());
      setIsLoading(false);
    }, 1500);
  }, [selectedTimeRange, selectedCourse]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAnalytics(generateMockData());
      setRefreshing(false);
    }, 1000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredVideos = analytics.videoPerformance?.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.course.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const MetricCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 text-${color}-500`} />
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon, section, children }) => (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => toggleSection(section)}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {expandedSections[section] ? 
          <ChevronUp className="h-5 w-5 text-gray-500" /> : 
          <ChevronDown className="h-5 w-5 text-gray-500" />
        }
      </div>
      {expandedSections[section] && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading Analytics Dashboard...</p>
          <p className="text-sm text-gray-500">Fetching your video performance data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Video className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Video Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                {analytics.courses?.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Metric</label>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {metricOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Videos</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Metrics */}
        <SectionHeader title="Overview" icon={BarChart3} section="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Total Views" 
              value={analytics.overview?.totalViews?.toLocaleString() || '0'} 
              icon={Eye} 
              trend={12.5}
            />
            <MetricCard 
              title="Watch Time (Hours)" 
              value={analytics.overview?.totalWatchTime?.toLocaleString() || '0'} 
              icon={Clock} 
              trend={8.3}
            />
            <MetricCard 
              title="Active Users" 
              value={analytics.overview?.activeUsers?.toLocaleString() || '0'} 
              icon={Users} 
              trend={-2.1}
            />
            <MetricCard 
              title="Avg Completion Rate" 
              value={`${analytics.overview?.avgCompletionRate || 0}%`} 
              icon={CheckCircle} 
              trend={5.2}
            />
          </div>
        </SectionHeader>

        {/* Charts */}
        <SectionHeader title="Performance Charts" icon={Activity} section="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Series Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Distribution */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={analytics.platformStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.platformStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionHeader>

        {/* Video Performance Table */}
        <SectionHeader title="Video Performance" icon={Video} section="videos">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Watch Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.slice(0, 10).map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <PlayCircle className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{video.title}</div>
                          <div className="text-sm text-gray-500">{video.duration} min</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.views.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.watchTime} min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${video.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{video.completionRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionHeader>

        {/* User Engagement */}
        <SectionHeader title="Top Users" icon={Users} section="users">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.userEngagement?.slice(0, 6).map((user) => (
              <div key={user.userId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Watch Time:</span>
                    <span className="font-medium">{user.totalWatchTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Videos Watched:</span>
                    <span className="font-medium">{user.videosWatched}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium">{user.avgCompletionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionHeader>

        {/* Security Incidents */}
        <SectionHeader title="Security Monitoring" icon={Shield} section="security">
          <div className="space-y-4">
            {analytics.securityIncidents?.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`h-5 w-5 ${incident.severity === 'High' ? 'text-red-500' : incident.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                    <h4 className="font-medium text-gray-900">{incident.type}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${incident.severity === 'High' ? 'bg-red-100 text-red-800' : incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${incident.status === 'Resolved' ? 'bg-green-100 text-green-800' : incident.status === 'Blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(incident.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </SectionHeader>
      </div>
    </div>
  );
};

export default VideoAnalyticsDashboard;
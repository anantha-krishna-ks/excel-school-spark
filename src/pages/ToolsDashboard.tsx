import { BookOpen, Users, ClipboardList, UserCheck, Settings, LogOut, BarChart3, Home, ArrowLeft, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ToolsDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: BookOpen,
      value: '24',
      label: 'Active Lessons',
      trend: '+12% this week',
      trendColor: 'text-green-600',
      bgColor: 'bg-blue-500'
    },
    {
      icon: Users,
      value: '342',
      label: 'Students',
      trend: '+5% this month',
      trendColor: 'text-green-600',
      bgColor: 'bg-green-500'
    },
    {
      icon: ClipboardList,
      value: '12',
      label: 'Pending Grades',
      trend: 'Due today',
      trendColor: 'text-orange-600',
      bgColor: 'bg-purple-500'
    },
    {
      icon: BarChart3,
      value: '94%',
      label: 'Attendance',
      trend: 'Above average',
      trendColor: 'text-green-600',
      bgColor: 'bg-orange-500'
    }
  ];

  const tools = [
    {
      id: 'lesson-plan',
      title: 'Lesson Plan Assistant',
      description: 'Create comprehensive lesson plans with AI assistance',
      icon: BookOpen,
      color: 'bg-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      route: '/lesson-plan-assistant'
    },
    {
      id: 'exam-assist-prep',
      title: 'Exam Prep Assist',
      description: 'Smart retrieval of CBSE questions with AI generation',
      icon: GraduationCap,
      color: 'bg-indigo-500',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      route: '/exam-assist-prep'
    },
    {
      id: 'grade-assistant',
      title: 'Grade Assistant',
      description: 'Streamline grading with intelligent analytics',
      icon: BarChart3,
      color: 'bg-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      route: '/grade-assistant'
    },
    {
      id: 'quiz-generator',
      title: 'Quiz Generator',
      description: 'Generate interactive assessments automatically',
      icon: ClipboardList,
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/quiz-generator'
    },
    {
      id: 'attendance',
      title: 'Smart Attendance',
      description: 'Automated tracking with real-time insights',
      icon: UserCheck,
      color: 'bg-orange-500',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      route: '/attendance'
    }
  ];

  const quickActions = [
    {
      title: 'New Lesson',
      description: 'AI-assisted creation',
      icon: BookOpen,
      color: 'bg-blue-500',
      route: '/lesson-plan-assistant'
    },
    {
      title: 'Generate Report',
      description: 'Performance insights',
      icon: BarChart3,
      color: 'bg-green-500',
      route: '/reports'
    },
    {
      title: 'Schedule Quiz',
      description: 'Auto-generated',
      icon: ClipboardList,
      color: 'bg-purple-500',
      route: '/quiz-generator'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Breadcrumbs */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Teacher Tools</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Role Selection
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Excel School AI</h1>
                  <p className="text-sm text-gray-500">Teacher Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tools Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful AI-assisted tools designed to enhance your educational management experience
          </p>
          
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            All systems operational
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className={`text-xs ${stat.trendColor} flex items-center gap-1`}>
                    {stat.trend}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div key={tool.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm">{tool.description}</p>
                  </div>
                </div>
                <Button 
                  className={`w-full ${tool.buttonColor} text-white`}
                  onClick={() => navigate(tool.route)}
                >
                  Launch Tool
                </Button>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Ready to use
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div 
                  key={index}
                  onClick={() => navigate(action.route)}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsDashboard;
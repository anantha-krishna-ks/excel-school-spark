import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Brain, 
  UserCheck, 
  GraduationCap, 
  FileText, 
  UserSearch, 
  AlertTriangle,
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminTools = [
    {
      id: 'teacher-insight',
      title: 'Teacher Insight AI',
      description: 'Evaluates recorded classes to assess teaching clarity, pedagogy, and engagement — with growth suggestions.',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      route: '/teacher-insight'
    },
    {
      id: 'student-profiling',
      title: 'Student Profiling AI',
      description: 'Builds a longitudinal view of each student\'s academic, behavioral, and engagement trends to guide decisions.',
      icon: Users,
      color: 'from-green-500 to-green-600',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      route: '/student-profiling'
    },
    {
      id: 'parent-interview',
      title: 'Parent Interview Analyzer',
      description: 'Assesses recorded parent interviews to evaluate alignment with school culture and long-term commitment.',
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/parent-interview'
    },
    {
      id: 'alumni-feedback',
      title: 'Alumni Feedback Miner',
      description: 'Extracts insights from alumni stories to inform school improvement, branding, and outcome tracking.',
      icon: GraduationCap,
      color: 'from-orange-500 to-orange-600',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      route: '/alumni-feedback'
    },
    {
      id: 'teacher-hiring',
      title: 'Teacher Hiring Evaluator',
      description: 'Reviews demo class recordings with AI to support bias-free, evidence-based teacher recruitment.',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      route: '/teacher-hiring'
    },
    {
      id: 'admission-fit',
      title: 'Admission Fit Evaluator',
      description: 'Analyzes student and parent interviews to assess cultural fit, preparedness, and potential for success.',
      icon: UserSearch,
      color: 'from-teal-500 to-teal-600',
      buttonColor: 'bg-teal-500 hover:bg-teal-600',
      route: '/admission-fit'
    },
    {
      id: 'student-risk',
      title: 'Student Risk Radar',
      description: 'Flags students at risk of disengagement or exit using academic, behavioral, and parental signals — with early alerts.',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      route: '/student-risk'
    }
  ];

  const handleToolClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Role Selection
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">AI-powered tools for school administration</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer group"
                onClick={() => handleToolClick(tool.route)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-3">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className={`w-full ${tool.buttonColor} text-white hover:shadow-md transition-all duration-300`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToolClick(tool.route);
                    }}
                  >
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
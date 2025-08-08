import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Timer, 
  Brain, 
  Shuffle, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  FileText,
  FolderOpen,
  Megaphone,
  Calendar,
  Heart,
  Users,
  Target,
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentTools = [
    {
      id: 'focus-buddy',
      title: 'Focus Buddy',
      description: 'Helps students stay focused using timed study sessions with breaks — inspired by the Pomodoro technique.',
      icon: Timer,
      color: 'from-blue-500 to-blue-600',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      route: '/focus-buddy'
    },
    {
      id: 'smart-revision',
      title: 'Smart Revision Planner',
      description: 'Automatically schedules revisions using spaced repetition, so concepts stick long-term.',
      icon: Brain,
      color: 'from-green-500 to-green-600',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      route: '/smart-revision'
    },
    {
      id: 'mix-master',
      title: 'Mix & Master',
      description: 'Mixes questions from different chapters and subjects to strengthen retention and adaptability — based on interleaving.',
      icon: Shuffle,
      color: 'from-purple-500 to-purple-600',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      route: '/mix-master'
    },
    {
      id: 'quick-recall',
      title: 'Quick Recall AI',
      description: 'Offers short, daily quizzes to practice active recall and strengthen memory — not just passive review.',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      route: '/quick-recall'
    },
    {
      id: 'confidence-tracker',
      title: 'Confidence Tracker',
      description: 'Lets students rate their confidence after each topic or quiz to build self-awareness and guide study focus.',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      route: '/confidence-tracker'
    },
    {
      id: 'exam-prep',
      title: 'Exam Prep Room',
      description: 'Central hub for practice tests, past papers, and chapter-wise mock tests — personalized to the student\'s syllabus.',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      route: '/exam-prep'
    },
    {
      id: 'mock-test',
      title: 'Mock Test Generator',
      description: 'Generate full-length mock tests using past papers and AI-similar questions — with scoring and feedback.',
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
      buttonColor: 'bg-teal-500 hover:bg-teal-600',
      route: '/mock-test'
    },
    {
      id: 'resource-vault',
      title: 'Resource Vault',
      description: 'Access all school-approved study materials, notes, and video lessons in one place.',
      icon: FolderOpen,
      color: 'from-pink-500 to-pink-600',
      buttonColor: 'bg-pink-500 hover:bg-pink-600',
      route: '/resource-vault'
    },
    {
      id: 'announcements',
      title: 'School Announcements Hub',
      description: 'Stay informed about exams, events, holidays, and circulars — all in one dashboard.',
      icon: Megaphone,
      color: 'from-red-500 to-red-600',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      route: '/announcements'
    },
    {
      id: 'calendar',
      title: 'Calendar & Deadlines Tracker',
      description: 'See upcoming assignments, tests, holidays, and revision milestones — auto-linked with class tools.',
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
      route: '/calendar'
    },
    {
      id: 'mood-mirror',
      title: 'Mood Mirror',
      description: 'Daily check-ins and tips to manage stress, anxiety, and focus — promoting emotional self-awareness.',
      icon: Heart,
      color: 'from-rose-500 to-rose-600',
      buttonColor: 'bg-rose-500 hover:bg-rose-600',
      route: '/mood-mirror'
    },
    {
      id: 'study-buddy',
      title: 'Study Buddy Connect',
      description: 'Find classmates with similar topics or goals to study collaboratively and stay motivated.',
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
      route: '/study-buddy'
    },
    {
      id: 'goal-setter',
      title: 'Goal Setter',
      description: 'Set personal academic goals and track progress — encouraging ownership and accountability.',
      icon: Target,
      color: 'from-violet-500 to-violet-600',
      buttonColor: 'bg-violet-500 hover:bg-violet-600',
      route: '/goal-setter'
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Smart tools to enhance your learning journey</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentTools.map((tool) => {
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
                      <IconComponent className="text-white" size={20} />
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    size="sm"
                    className={`w-full ${tool.buttonColor} text-white hover:shadow-md transition-all duration-300`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToolClick(tool.route);
                    }}
                  >
                    Launch
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

export default StudentDashboard;
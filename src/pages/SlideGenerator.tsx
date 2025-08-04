import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, LayoutTemplate, Presentation, Sparkles, Image, Video, BarChart3, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SlideGenerator = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'lesson-plan' | 'template' | null>(null);

  const features = [
    {
      icon: FileText,
      title: 'Smart Conversion',
      description: 'AI converts lesson plans to slides'
    },
    {
      icon: LayoutTemplate,
      title: 'Professional Templates',
      description: 'Pre-designed layouts for education'
    },
    {
      icon: Image,
      title: 'Visual Elements',
      description: 'Images, diagrams, and media integration'
    },
    {
      icon: BarChart3,
      title: 'Data Visualization',
      description: 'Charts and interactive elements'
    }
  ];

  const stats = [
    { value: '2.5K+', label: 'Presentations Created', trend: '+25% this month' },
    { value: '15+', label: 'Template Categories', trend: 'Education focused' },
    { value: '98%', label: 'User Satisfaction', trend: 'AI-powered quality' },
    { value: '5min', label: 'Average Creation Time', trend: 'Lightning fast' }
  ];

  const handleOptionSelect = (option: 'lesson-plan' | 'template') => {
    setSelectedOption(option);
    if (option === 'lesson-plan') {
      navigate('/slide-generator/lesson-plan');
    } else {
      navigate('/slide-generator/templates');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Presentation className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Slide Generator</h1>
                  <p className="text-sm text-gray-500">AI-Powered Presentation Creator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Stunning Presentations in Minutes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your lesson plans into engaging slides or start fresh with professional templates. 
            Our AI-powered editor makes presentation creation effortless and beautiful.
          </p>
        </div>


        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Option 1: Create from Lesson Plan */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-rose-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Create PPT using Lesson Plan</CardTitle>
              <CardDescription className="text-base">
                Upload your lesson plan or session plan and let AI transform it into a professional presentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-sm text-gray-700">Upload your lesson plan document</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-sm text-gray-700">AI analyzes and converts to slides</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-sm text-gray-700">Edit and customize with powerful tools</span>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                onClick={() => handleOptionSelect('lesson-plan')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Start with Lesson Plan
              </Button>
            </CardContent>
          </Card>

          {/* Option 2: Create from Template */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-rose-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <LayoutTemplate className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Create PPT on Your Own</CardTitle>
              <CardDescription className="text-base">
                Choose from professionally designed templates and create your presentation from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-sm text-gray-700">Browse template gallery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-sm text-gray-700">Select your preferred design</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-sm text-gray-700">Customize with rich editing tools</span>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
                onClick={() => handleOptionSelect('template')}
              >
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional presentations that engage and educate
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideGenerator;
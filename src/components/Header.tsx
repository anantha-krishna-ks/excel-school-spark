
import React from 'react';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Home className="w-4 h-4" />
          <span className="mx-2">/</span>
          <span 
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/tools')}
          >
            Teacher Tools
          </span>
          <span className="mx-2">/</span>
          <span className="text-blue-600 font-medium">Lesson Plan Assistant</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tools')}
              className="text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/1ea2ca7f-c43c-4495-a861-38cfaec2e5b5.png" 
                alt="Excel School AI" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

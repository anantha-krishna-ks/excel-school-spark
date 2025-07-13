
import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ExcelSchool</h1>
            <p className="text-sm text-gray-500">Manage Lesson Plan</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

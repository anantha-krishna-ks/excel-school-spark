
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Sparkles, Edit3, Trash2 } from 'lucide-react';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
}

const CoreObjectives = ({ onGenerateCO }: CoreObjectivesProps) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([
    'Current happenings',
    'School values (dust out)'
  ]);
  
  const objectives = [
    { id: 'current', label: 'Current happenings', icon: '📰', color: 'blue' },
    { id: 'values', label: 'School values (dust out)', icon: '🏫', color: 'purple' },
    { id: 'ethics', label: 'Human, ethics & moral', icon: '🤝', color: 'green' },
    { id: 'timeless', label: 'Timeless values', icon: '⭐', color: 'yellow' },
    { id: 'career', label: 'College & career readiness', icon: '🎓', color: 'indigo' },
    { id: 'relevance', label: 'Relevance to life', icon: '🌱', color: 'emerald' },
    { id: 'lifeskill', label: 'Life skill', icon: '💪', color: 'red' }
  ];

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (checked) {
      setSelectedObjectives([...selectedObjectives, objective]);
    } else {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    }
  };

  const handleGenerateCO = () => {
    onGenerateCO(selectedObjectives);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
          <Target className="text-purple-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Core Objectives</h3>
          <p className="text-gray-600 text-sm">Select the learning objectives that align with your lesson goals</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {objectives.map((objective) => (
          <div 
            key={objective.id} 
            className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              selectedObjectives.includes(objective.label) 
                ? 'border-blue-200 bg-blue-50' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Checkbox
              id={objective.id}
              checked={selectedObjectives.includes(objective.label)}
              onCheckedChange={(checked) => handleObjectiveChange(objective.label, !!checked)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">{objective.icon}</span>
              <label 
                htmlFor={objective.id} 
                className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 flex-1"
              >
                {objective.label}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateCO}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={selectedObjectives.length === 0}
        >
          <Sparkles className="mr-2" size={18} />
          Generate Course Objectives
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {selectedObjectives.length} objective{selectedObjectives.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Edit3 size={12} className="text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900">Generated Course Objectives</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Your generated objectives will appear here. They will be fully editable and customizable.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs bg-white hover:bg-gray-50">
            <Edit3 size={12} className="mr-1" />
            Rephrase
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-white hover:bg-gray-50">
            <Trash2 size={12} className="mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoreObjectives;

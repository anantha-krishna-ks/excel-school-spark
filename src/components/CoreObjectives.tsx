
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Sparkles, Star, Heart, Trophy, CheckCircle2 } from 'lucide-react';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
}

const CoreObjectives = ({ onGenerateCO }: CoreObjectivesProps) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjective, setCustomObjective] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  const availableObjectives = [
    { 
      id: 'timeless', 
      label: 'Timeless values', 
      icon: '⭐', 
      description: 'Help students understand eternal principles and moral values',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'lifeskill', 
      label: 'Life skill', 
      icon: '💪', 
      description: 'Develop practical skills for personal and professional growth',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'relevance', 
      label: 'Relevance to life', 
      icon: '🌱', 
      description: 'Connect learning to real-world applications and daily life',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const handleObjectiveToggle = (objective: string) => {
    const isSelected = selectedObjectives.includes(objective);
    
    if (isSelected) {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
      // Add dopamine hit with celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
  };

  const handleGenerateCO = () => {
    const objectives = customObjective.trim() 
      ? [...selectedObjectives, customObjective.trim()] 
      : selectedObjectives;
    onGenerateCO(objectives);
  };

  const totalSelected = selectedObjectives.length + (customObjective.trim() ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
            <Sparkles className="text-yellow-400" size={32} />
          </div>
          <div className="absolute top-1/4 left-1/4 animate-bounce delay-100">
            <Star className="text-purple-500" size={16} />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-200">
            <Heart className="text-pink-500" size={14} />
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
          <Target className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">What's Your Teaching Goal?</h3>
          <p className="text-gray-600">Pick what matters most for your students ✨</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-yellow-500" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {totalSelected === 0 ? "Choose your objectives" : `${totalSelected} objective${totalSelected > 1 ? 's' : ''} selected! 🎉`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min((totalSelected / 3) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Main Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {availableObjectives.map((objective) => {
          const isSelected = selectedObjectives.includes(objective.label);
          return (
            <div
              key={objective.id}
              onClick={() => handleObjectiveToggle(objective.label)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                ${isSelected 
                  ? `border-transparent bg-gradient-to-br ${objective.color} text-white shadow-lg` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
              )}
              
              <div className="text-center">
                <div className="text-3xl mb-3">{objective.icon}</div>
                <h4 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {objective.label}
                </h4>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  {objective.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Objective */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-2xl">💡</div>
          <h4 className="font-semibold text-orange-900">Got Something Specific in Mind?</h4>
        </div>
        
        <Textarea
          placeholder="Type your own teaching objective here... (e.g., Students will learn to solve real-world problems creatively)"
          value={customObjective}
          onChange={(e) => setCustomObjective(e.target.value)}
          className="w-full min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
        />
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button 
          onClick={handleGenerateCO}
          disabled={totalSelected === 0}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform
            ${totalSelected > 0 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Sparkles className="mr-2" size={20} />
          {totalSelected === 0 ? 'Choose at least one objective' : `Create My Lesson Plan! 🚀`}
        </Button>
        
        {totalSelected > 0 && (
          <p className="text-sm text-gray-600 mt-3">
            Ready to create an amazing lesson with {totalSelected} objective{totalSelected > 1 ? 's' : ''}! 
          </p>
        )}
      </div>
    </div>
  );
};

export default CoreObjectives;

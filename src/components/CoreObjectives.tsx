import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Sparkles, CheckCircle2, Heart, Bot } from 'lucide-react';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
}

const CoreObjectives = ({ onGenerateCO }: CoreObjectivesProps) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
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

  // Auto-select all objectives in AI Assist mode
  React.useEffect(() => {
    if (activeTab === 'aiAssist') {
      setSelectedObjectives(availableObjectives.map(obj => obj.label));
    }
  }, [activeTab]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  const handleObjectiveToggle = (objective: string) => {
    if (activeTab === 'aiAssist') return; // Don't allow changes in AI mode
    
    const isSelected = selectedObjectives.includes(objective);
    
    if (isSelected) {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
      triggerCelebration();
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
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
          <Target className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Core Objectives</h3>
          <p className="text-gray-600">Choose what matters most for your students ✨</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
            activeTab === 'recommended'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart size={16} />
          <span className="font-medium">Recommended</span>
        </button>
        <button
          onClick={() => setActiveTab('aiAssist')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
            activeTab === 'aiAssist'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Bot size={16} />
          <span className="font-medium">AI Assist</span>
        </button>
      </div>

      {/* Objectives Grid - Consistent for both tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {availableObjectives.map((objective) => {
          const isSelected = selectedObjectives.includes(objective.label);
          return (
            <div
              key={objective.id}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                ${isSelected 
                  ? `border-transparent bg-gradient-to-br ${objective.color} text-white shadow-lg` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${activeTab === 'aiAssist' ? 'cursor-default' : ''}
              `}
              onClick={() => handleObjectiveToggle(objective.label)}
            >
              {/* Selection indicator */}
              <div className="absolute top-3 right-3">
                <CheckCircle2 className={isSelected ? "text-white" : "text-gray-400"} size={20} />
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">{objective.icon}</div>
                <h4 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {objective.label}
                </h4>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  {objective.description}
                </p>
              </div>
              
              {/* AI mode indicator */}
              {activeTab === 'aiAssist' && (
                <div className="absolute bottom-2 right-2">
                  <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    Always Selected
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Objective */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-2xl">💡</div>
          <h4 className="font-semibold text-orange-900">Add Your Special Touch (Optional)</h4>
        </div>
        
        <Textarea
          placeholder="Type your own teaching objective here... (e.g., Students will learn to solve real-world problems creatively)"
          value={customObjective}
          onChange={(e) => setCustomObjective(e.target.value)}
          className="w-full min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        {/* Validate Button for Recommended Tab */}
        {activeTab === 'recommended' && totalSelected > 0 && (
          <div className="flex justify-center">
            <Button 
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-6 py-2 rounded-lg font-medium shadow-sm"
            >
              <CheckCircle2 className="mr-2" size={18} />
              Validate Objectives
            </Button>
          </div>
        )}
        
        {/* Generate/Continue Button */}
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
          {totalSelected === 0 ? 'Choose at least one objective' : `Continue with ${totalSelected} objective${totalSelected > 1 ? 's' : ''}! 🚀`}
        </Button>
        
        {totalSelected > 0 && (
          <p className="text-sm text-gray-600 mt-3">
            Ready to proceed with {totalSelected} objective{totalSelected > 1 ? 's' : ''}! 
          </p>
        )}
      </div>
    </div>
  );
};

export default CoreObjectives;
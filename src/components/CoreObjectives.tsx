import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Sparkles, CheckCircle2, Heart, Bot } from 'lucide-react';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
  shortlistedObjectives?: string[];
  setShortlistedObjectives?: (objectives: string[]) => void;
}

const CoreObjectives = ({ 
  onGenerateCO, 
  shortlistedObjectives = [], 
  setShortlistedObjectives 
}: CoreObjectivesProps) => {
  const [activeTab, setActiveTab] = useState<'fullyAI' | 'partiallyAI'>('fullyAI');
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjectives, setCustomObjectives] = useState<string[]>(['']);
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

  // Auto-select all objectives in Fully AI-assisted mode
  React.useEffect(() => {
    if (activeTab === 'fullyAI') {
      setSelectedObjectives(availableObjectives.map(obj => obj.label));
    }
  }, [activeTab]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  const handleObjectiveToggle = (objective: string) => {
    if (activeTab === 'fullyAI') return; // Don't allow changes in fully AI mode
    
    const isSelected = selectedObjectives.includes(objective);
    
    if (isSelected) {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
      triggerCelebration();
    }
  };

  const addCustomObjective = () => {
    setCustomObjectives([...customObjectives, '']);
  };

  const removeCustomObjective = (index: number) => {
    if (customObjectives.length > 1) {
      setCustomObjectives(customObjectives.filter((_, i) => i !== index));
    }
  };

  const updateCustomObjective = (index: number, value: string) => {
    const newObjectives = [...customObjectives];
    newObjectives[index] = value;
    setCustomObjectives(newObjectives);
  };

  const handleGenerateCO = () => {
    const validCustomObjectives = customObjectives.filter(obj => obj.trim() !== '');
    const objectives = [...selectedObjectives, ...validCustomObjectives];
    onGenerateCO(objectives);
  };

  const handleShortlist = () => {
    const validCustomObjectives = customObjectives.filter(obj => obj.trim() !== '');
    const objectives = [...selectedObjectives, ...validCustomObjectives];
    if (setShortlistedObjectives) {
      setShortlistedObjectives(objectives);
    }
  };

  const validCustomObjectives = customObjectives.filter(obj => obj.trim() !== '');
  const totalSelected = selectedObjectives.length + validCustomObjectives.length;

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
          <h3 className="text-xl font-bold text-gray-900">Manage Objectives</h3>
          <p className="text-gray-600">Choose what matters most for your students ✨</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('partiallyAI')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
            activeTab === 'partiallyAI'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart size={16} />
          <span className="font-medium">Partially AI-assisted</span>
        </button>
        <button
          onClick={() => setActiveTab('fullyAI')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
            activeTab === 'fullyAI'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Bot size={16} />
          <span className="font-medium">Fully AI-assisted</span>
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
                ${activeTab === 'fullyAI' ? 'cursor-default' : ''}
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
              {activeTab === 'fullyAI' && (
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

      {/* Custom Objectives */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💡</div>
            <h4 className="font-semibold text-orange-900">Add Your Special Touch (Optional)</h4>
          </div>
          <Button
            onClick={addCustomObjective}
            variant="outline"
            size="sm"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            + Add More
          </Button>
        </div>
        
        <div className="space-y-3">
          {customObjectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                placeholder="Type your own teaching objective here... (e.g., Students will learn to solve real-world problems creatively)"
                value={objective}
                onChange={(e) => updateCustomObjective(index, e.target.value)}
                className="flex-1 min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
              />
              {customObjectives.length > 1 && (
                <Button
                  onClick={() => removeCustomObjective(index)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 self-start mt-2"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        {/* Validate and Shortlist Buttons for Partially AI-assisted Tab */}
        {activeTab === 'partiallyAI' && totalSelected > 0 && (
          <div className="flex justify-center gap-3">
            <Button 
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-4 py-2 rounded-lg font-medium shadow-sm"
            >
              <CheckCircle2 className="mr-2" size={16} />
              Validate
            </Button>
            <Button 
              variant="outline"
              onClick={handleShortlist}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-4 py-2 rounded-lg font-medium shadow-sm"
            >
              <Target className="mr-2" size={16} />
              Shortlist
            </Button>
          </div>
        )}
        
        {/* Generate/Continue Button */}
        <Button 
          onClick={handleGenerateCO}
          disabled={totalSelected === 0}
          className={`px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 ${
            totalSelected > 0 ? '' : 'opacity-50 cursor-not-allowed'
          }`}
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
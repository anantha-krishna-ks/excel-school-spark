
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Target, Sparkles, Lightbulb, Bot, CheckCircle, Star, StarOff } from 'lucide-react';
import CoreObjectivesShortlist from './CoreObjectivesShortlist';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
}

const CoreObjectives = ({ onGenerateCO }: CoreObjectivesProps) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([
    'Timeless values',
    'Relevance to life'
  ]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
  const [shortlistedObjectives, setShortlistedObjectives] = useState<string[]>([]);
  
  const availableObjectives = [
    { id: 'timeless', label: 'Timeless values', icon: '⭐', description: 'Help students understand eternal principles and moral values' },
    { id: 'relevance', label: 'Relevance to life', icon: '🌱', description: 'Connect learning to real-world applications and daily life' },
    { id: 'lifeskill', label: 'Life skill', icon: '💪', description: 'Develop practical skills for personal and professional growth' },
    { id: 'critical', label: 'Critical thinking', icon: '🧠', description: 'Enhance analytical and problem-solving abilities' },
    { id: 'creativity', label: 'Creativity & Innovation', icon: '🎨', description: 'Foster creative expression and innovative thinking' },
    { id: 'collaboration', label: 'Collaboration', icon: '🤝', description: 'Build teamwork and communication skills' }
  ];

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (checked) {
      setSelectedObjectives([...selectedObjectives, objective]);
    } else {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    }
  };

  const handleAddToShortlist = (objective: string) => {
    if (!shortlistedObjectives.includes(objective)) {
      setShortlistedObjectives([...shortlistedObjectives, objective]);
    }
  };

  const handleRemoveFromShortlist = (objective: string) => {
    setShortlistedObjectives(shortlistedObjectives.filter(obj => obj !== objective));
  };

  const handleVerify = () => {
    const writtenObjectives = customPrompt.toLowerCase().split(',').map(obj => obj.trim());
    const availableLabels = availableObjectives.map(obj => obj.label.toLowerCase());
    
    const matches = writtenObjectives.filter(obj => 
      availableLabels.some(label => label.includes(obj) || obj.includes(label))
    );
    
    console.log('Verification results:', {
      written: writtenObjectives,
      matches: matches,
      coverage: `${matches.length}/${writtenObjectives.length} objectives match`
    });
    
    alert(`Great! ${matches.length} out of ${writtenObjectives.length} objectives match our recommendations. This will help create a well-structured lesson plan.`);
  };

  const handleGenerateCO = () => {
    if (activeTab === 'recommended') {
      const objectives = customPrompt.trim() ? [customPrompt.trim()] : shortlistedObjectives;
      onGenerateCO(objectives);
    } else {
      onGenerateCO(selectedObjectives);
    }
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
          <p className="text-gray-600 text-sm">Choose what you want your students to achieve in this lesson</p>
        </div>
      </div>

      {/* Shortlist Section */}
      <div className="mb-6">
        <CoreObjectivesShortlist
          shortlistedObjectives={shortlistedObjectives}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onAddToShortlist={handleAddToShortlist}
          availableObjectives={availableObjectives.map(obj => obj.label)}
        />
      </div>

      {/* Recommended and AI Assist Toggle */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'recommended'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Lightbulb size={16} />
            <span className="font-medium">Pick & Choose</span>
          </button>
          <button
            onClick={() => setActiveTab('aiAssist')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'aiAssist'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Bot size={16} />
            <span className="font-medium">AI Suggestions</span>
          </button>
        </div>

        {/* Recommended Tab Content */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            {/* Available Core Objectives */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Choose from Popular Objectives</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableObjectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-lg flex-shrink-0">{objective.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-sm font-medium text-gray-800">{objective.label}</h5>
                        <button
                          onClick={() => handleAddToShortlist(objective.label)}
                          className={`p-1 rounded transition-colors ${
                            shortlistedObjectives.includes(objective.label)
                              ? 'text-orange-500'
                              : 'text-gray-400 hover:text-orange-500'
                          }`}
                        >
                          {shortlistedObjectives.includes(objective.label) ? (
                            <Star size={14} fill="currentColor" />
                          ) : (
                            <StarOff size={14} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">{objective.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Objective Input */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-orange-600" size={18} />
                <h4 className="font-medium text-orange-900">Write Your Own Objective</h4>
              </div>
              
              <Textarea
                placeholder="Example: Students will understand the importance of environmental conservation and apply it in their daily lives..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 mb-3"
              />
              
              <div className="flex justify-center">
                <Button
                  onClick={handleVerify}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  disabled={!customPrompt.trim()}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Check My Objective
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AI Assist Tab Content */}
        {activeTab === 'aiAssist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableObjectives.map((objective) => (
              <div 
                key={objective.id} 
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  selectedObjectives.includes(objective.label) 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Checkbox
                  id={objective.id}
                  checked={selectedObjectives.includes(objective.label)}
                  onCheckedChange={(checked) => handleObjectiveChange(objective.label, !!checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{objective.icon}</span>
                    <label 
                      htmlFor={objective.id} 
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                    >
                      {objective.label}
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">{objective.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateCO}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={
            (activeTab === 'recommended' && !customPrompt.trim() && shortlistedObjectives.length === 0) || 
            (activeTab === 'aiAssist' && selectedObjectives.length === 0)
          }
        >
          <Sparkles className="mr-2" size={18} />
          {activeTab === 'recommended' ? 'Create My Lesson Plan' : 'Generate with AI'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {activeTab === 'recommended' 
            ? `${shortlistedObjectives.length + (customPrompt.trim() ? 1 : 0)} objective${shortlistedObjectives.length + (customPrompt.trim() ? 1 : 0) !== 1 ? 's' : ''} ready to use`
            : `${selectedObjectives.length} objective${selectedObjectives.length !== 1 ? 's' : ''} selected for AI generation`
          }
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Target size={12} className="text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900">Your Course Objectives Preview</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Once generated, your course objectives will appear here. You can edit, rephrase, or remove any objective to perfectly match your teaching style.
        </p>
        <div className="bg-white p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-500 italic">Your personalized course objectives will be displayed here...</p>
        </div>
      </div>
    </div>
  );
};

export default CoreObjectives;

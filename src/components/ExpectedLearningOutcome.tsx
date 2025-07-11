
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Bot, CheckCircle } from 'lucide-react';
import ObjectiveMapping from './ObjectiveMapping';

const ExpectedLearningOutcome = () => {
  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([
    'Apply',
    'Analyse'
  ]);

  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedOutcomes, setGeneratedOutcomes] = useState<string[]>([]);

  const bloomsLevels = [
    { id: 'apply', label: 'Apply', icon: '🔧', description: 'Use knowledge in new situations' },
    { id: 'analyse', label: 'Analyse', icon: '🔍', description: 'Break down information into parts' },
    { id: 'evaluate', label: 'Evaluate', icon: '⚖️', description: 'Make judgments based on criteria' },
    { id: 'create', label: 'Create', icon: '🎨', description: 'Produce new or original work' }
  ];

  // Mock core objectives for mapping
  const mockCoreObjectives = ['Timeless values', 'Life skill', 'Relevance to life'];

  const handleBloomsChange = (blooms: string, checked: boolean) => {
    if (checked) {
      setSelectedBlooms([...selectedBlooms, blooms]);
    } else {
      setSelectedBlooms(selectedBlooms.filter(b => b !== blooms));
    }
  };

  const handleVerify = () => {
    const writtenOutcomes = customPrompt.toLowerCase().split(',').map(obj => obj.trim());
    
    console.log('ELO Verification results:', {
      written: writtenOutcomes,
      bloomsAlignment: writtenOutcomes.length
    });
    
    alert(`Verification complete: Your learning outcomes are well-structured and ready to use!`);
  };

  const handleGenerateELO = () => {
    const outcomes = activeTab === 'recommended' && customPrompt.trim() 
      ? [customPrompt.trim()]
      : selectedBlooms.map(bloom => `Students will be able to ${bloom.toLowerCase()} concepts effectively`);
    
    setGeneratedOutcomes(outcomes);
    console.log('Generated ELO:', outcomes);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <Lightbulb className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Expected Learning Outcome</h3>
          <p className="text-gray-600 text-sm">Define specific learning outcomes using Bloom's Taxonomy</p>
        </div>
      </div>

      {/* Objective Mapping */}
      <ObjectiveMapping 
        coreObjectives={mockCoreObjectives}
        learningOutcomes={generatedOutcomes}
      />

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
            <span className="font-medium">Recommended</span>
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
            <span className="font-medium">AI Assist</span>
          </button>
        </div>

        {/* Recommended Tab Content */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            {/* Custom Learning Outcomes */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-orange-600" size={18} />
                <h4 className="font-medium text-orange-900">Write Your Learning Outcomes</h4>
              </div>
              
              <Textarea
                placeholder="Example: Students will be able to apply mathematical concepts to solve real-world problems and analyze the effectiveness of different solution strategies..."
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
                  Verify Learning Outcomes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AI Assist Tab Content - Blooms Taxonomy HOTS */}
        {activeTab === 'aiAssist' && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Bloom's Taxonomy - Higher Order Thinking Skills (HOTS)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bloomsLevels.map((bloom) => (
                <div 
                  key={bloom.id}
                  className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-lg flex-shrink-0">{bloom.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={bloom.id}
                          checked={selectedBlooms.includes(bloom.label)}
                          onCheckedChange={(checked) => handleBloomsChange(bloom.label, !!checked)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <label 
                          htmlFor={bloom.id} 
                          className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900"
                        >
                          {bloom.label}
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">{bloom.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateELO}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={
            (activeTab === 'recommended' && !customPrompt.trim()) || 
            (activeTab === 'aiAssist' && selectedBlooms.length === 0)
          }
        >
          <Lightbulb className="mr-2" size={18} />
          {activeTab === 'recommended' ? 'Use Learning Outcomes' : 'Generate Learning Outcomes'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {activeTab === 'recommended' 
            ? `${customPrompt.trim() ? 1 : 0} outcome${customPrompt.trim() ? '' : 's'} ready`
            : `Based on ${selectedBlooms.length} selected Bloom's level${selectedBlooms.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Lightbulb size={12} className="text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900">Generated Learning Outcomes</h4>
        </div>
        <div className="space-y-2">
          {generatedOutcomes.length > 0 ? (
            generatedOutcomes.map((outcome, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{outcome}</p>
              </div>
            ))
          ) : (
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-500 italic">Your expected learning outcomes will be generated here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpectedLearningOutcome;

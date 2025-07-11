
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Bot, CheckCircle, GripVertical, Star, StarOff } from 'lucide-react';

const ExpectedLearningOutcome = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Different levels of students',
    'Core Objectives',
    'Blooms/DoK',
    'MI theory based'
  ]);

  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
  const [customPrompt, setCustomPrompt] = useState('');
  const [draggedObjectives, setDraggedObjectives] = useState<string[]>([]);
  const [shortlistedObjectives, setShortlistedObjectives] = useState<string[]>([]);

  const features = [
    { id: 'levels', label: 'Different levels of students', icon: '👥', description: 'Accommodate diverse learning abilities' },
    { id: 'objectives', label: 'Core Objectives', icon: '🎯', description: 'Align with selected core objectives' },
    { id: 'blooms', label: 'Blooms/DoK', icon: '🧠', description: 'Depth of Knowledge taxonomy' },
    { id: 'mi', label: 'MI theory based', icon: '🌟', description: 'Multiple Intelligence theory' }
  ];

  const availableLearningObjectives = [
    { id: 'timeless', label: 'Timeless values', icon: '⭐', color: 'yellow' },
    { id: 'relevance', label: 'Relevance to life', icon: '🌱', color: 'emerald' },
    { id: 'lifeskill', label: 'Life skill', icon: '💪', color: 'red' }
  ];

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const handleDragStart = (e: React.DragEvent, objective: string) => {
    e.dataTransfer.setData('text/plain', objective);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const objective = e.dataTransfer.getData('text/plain');
    if (objective && !draggedObjectives.includes(objective)) {
      setDraggedObjectives([...draggedObjectives, objective]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeDraggedObjective = (objective: string) => {
    setDraggedObjectives(draggedObjectives.filter(obj => obj !== objective));
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
    const availableLabels = availableLearningObjectives.map(obj => obj.label.toLowerCase());
    
    const matches = writtenObjectives.filter(obj => 
      availableLabels.some(label => label.includes(obj) || obj.includes(label))
    );
    
    console.log('ELO Verification results:', {
      written: writtenObjectives,
      matches: matches,
      coverage: `${matches.length}/${writtenObjectives.length} objectives match`
    });
    
    alert(`Verification complete: ${matches.length}/${writtenObjectives.length} learning outcomes match our recommendations`);
  };

  const handleGenerateELO = () => {
    console.log('Generating ELO with:', {
      selectedFeatures,
      activeTab,
      customPrompt: activeTab === 'recommended' ? customPrompt : null,
      draggedObjectives: activeTab === 'recommended' ? draggedObjectives : null
    });
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
          <p className="text-gray-600 text-sm">Define specific learning outcomes and frameworks</p>
        </div>
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
            {/* Available Learning Objectives for Drag & Drop */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Available Learning Objectives</h4>
              <div className="flex flex-wrap gap-2">
                {availableLearningObjectives.map((objective) => (
                  <div
                    key={objective.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, objective.label)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-all duration-200"
                  >
                    <GripVertical size={14} className="text-gray-400" />
                    <span className="text-lg">{objective.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{objective.label}</span>
                    <button
                      onClick={() => handleAddToShortlist(objective.label)}
                      className={`p-1 rounded transition-colors ${
                        shortlistedObjectives.includes(objective.label)
                          ? 'text-orange-500'
                          : 'text-gray-400 hover:text-orange-500'
                      }`}
                    >
                      {shortlistedObjectives.includes(objective.label) ? (
                        <Star size={12} fill="currentColor" />
                      ) : (
                        <StarOff size={12} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">Drag objectives to the text area below</p>
            </div>

            {/* Custom Prompt Area with Drag & Drop */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-orange-600" size={18} />
                <h4 className="font-medium text-orange-900">Write Your Learning Outcomes</h4>
              </div>
              
              {/* Dragged Objectives Display */}
              {draggedObjectives.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-orange-600 mb-2">Dragged objectives:</p>
                  <div className="flex flex-wrap gap-2">
                    {draggedObjectives.map((obj, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{obj}</span>
                        <button
                          onClick={() => removeDraggedObjective(obj)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative"
              >
                <Textarea
                  placeholder="Describe your specific learning outcomes... You can also drag objectives from above."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <p className="text-xs text-orange-600 mt-2">
                Write your own learning outcomes and drag from available options above
              </p>
            </div>

            {/* Verify Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleVerify}
                variant="outline"
                className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                disabled={!customPrompt.trim() && draggedObjectives.length === 0}
              >
                <CheckCircle size={16} />
                Verify Learning Outcomes
              </Button>
            </div>
          </div>
        )}

        {/* AI Assist Tab Content - Learning Framework Features */}
        {activeTab === 'aiAssist' && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Learning Framework Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-lg flex-shrink-0">{feature.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={feature.id}
                          checked={selectedFeatures.includes(feature.label)}
                          onCheckedChange={(checked) => handleFeatureChange(feature.label, !!checked)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <label 
                          htmlFor={feature.id} 
                          className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900"
                        >
                          {feature.label}
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">{feature.description}</p>
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
        >
          <Lightbulb className="mr-2" size={18} />
          {activeTab === 'recommended' ? 'Use Learning Outcomes' : 'Generate Learning Outcomes'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {activeTab === 'recommended' 
            ? `${draggedObjectives.length + (customPrompt.trim() ? 1 : 0)} outcome${draggedObjectives.length + (customPrompt.trim() ? 1 : 0) !== 1 ? 's' : ''} ready`
            : `Based on ${selectedFeatures.length} selected framework${selectedFeatures.length !== 1 ? 's' : ''}`
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
        <p className="text-sm text-gray-600">
          Your expected learning outcomes will be generated here and will be fully editable to match your specific needs.
        </p>
      </div>
    </div>
  );
};

export default ExpectedLearningOutcome;

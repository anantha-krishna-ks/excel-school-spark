import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Bot, 
  Edit3, 
  Split, 
  Merge, 
  Star,
  StarOff,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
  shortlistedObjectives?: string[];
  setShortlistedObjectives?: (objectives: string[]) => void;
}

// Types for the enhanced functionality
interface SavedObjective {
  id: string;
  text: string;
  categories: string[];
  isValidated: boolean;
  validationResult?: {
    isCorrect: boolean;
    feedback: string;
    suggestions?: string[];
  };
}

interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  suggestions?: string[];
}

const CoreObjectives = ({ 
  onGenerateCO, 
  shortlistedObjectives = [], 
  setShortlistedObjectives 
}: CoreObjectivesProps) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjectives, setCustomObjectives] = useState<string[]>(['']);
  const [showCelebration, setShowCelebration] = useState(false);
  const [savedObjectives, setSavedObjectives] = useState<SavedObjective[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [validationResults, setValidationResults] = useState<{[key: string]: ValidationResult}>({});
  const [suggestedObjectives, setSuggestedObjectives] = useState<string[]>([]);
  
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

  // Auto-generate suggested objectives on component mount
  React.useEffect(() => {
    const suggestions = [
      "Long lasting values: Students develop gratitude towards farmers for their hard work and their role in ensuring food security.",
      "Life skills: Students acquire the ability to analyze complex problems and develop sustainable solutions.",
      "Relevance to life: Students gain a holistic understanding of food production and its socio-economic impact in the country."
    ];
    setSuggestedObjectives(suggestions);
    
    // Auto-save suggested objectives
    const autoSavedObjectives = suggestions.map(text => ({
      id: `auto_${Date.now()}_${Math.random()}`,
      text,
      categories: categorizeObjective(text),
      isValidated: false
    }));
    setSavedObjectives(autoSavedObjectives);
  }, []);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  // Enhanced functions for the new features
  const categorizeObjective = (text: string): string[] => {
    const categories = [];
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based categorization
    if (lowerText.includes('value') || lowerText.includes('moral') || lowerText.includes('character') || lowerText.includes('ethics')) {
      categories.push('Timeless values');
    }
    if (lowerText.includes('skill') || lowerText.includes('ability') || lowerText.includes('competency') || lowerText.includes('proficiency')) {
      categories.push('Life skill');
    }
    if (lowerText.includes('daily life') || lowerText.includes('real') || lowerText.includes('practical') || lowerText.includes('relevance') || lowerText.includes('socio-economic')) {
      categories.push('Relevance to life');
    }
    
    return categories.length > 0 ? categories : ['General'];
  };

  const saveObjective = (text: string) => {
    if (text.trim()) {
      const newObjective: SavedObjective = {
        id: Date.now().toString(),
        text: text.trim(),
        categories: categorizeObjective(text.trim()),
        isValidated: false
      };
      setSavedObjectives([...savedObjectives, newObjective]);
      triggerCelebration();
    }
  };

  const removeObjective = (id: string) => {
    setSavedObjectives(savedObjectives.filter(obj => obj.id !== id));
  };

  const toggleShortlist = (objective: SavedObjective) => {
    const isShortlisted = shortlistedObjectives.includes(objective.text);
    if (setShortlistedObjectives) {
      if (isShortlisted) {
        setShortlistedObjectives(shortlistedObjectives.filter(obj => obj !== objective.text));
      } else {
        setShortlistedObjectives([...shortlistedObjectives, objective.text]);
        triggerCelebration();
      }
    }
  };

  const rephraseObjective = (objective: SavedObjective) => {
    // Simple rephrasing examples - in real app this would use AI
    const rephrasedText = `Enhanced version: ${objective.text}`;
    const updatedObjective = { ...objective, text: rephrasedText };
    setSavedObjectives(savedObjectives.map(obj => obj.id === objective.id ? updatedObjective : obj));
  };

  const splitObjective = (objective: SavedObjective) => {
    // Simple split logic - in real app this would be more sophisticated
    const parts = objective.text.split(':');
    if (parts.length > 1) {
      const firstPart = parts[0].trim();
      const secondPart = parts.slice(1).join(':').trim();
      
      const newObjective1: SavedObjective = {
        id: Date.now().toString() + '_1',
        text: firstPart,
        categories: categorizeObjective(firstPart),
        isValidated: false
      };
      
      const newObjective2: SavedObjective = {
        id: Date.now().toString() + '_2',
        text: secondPart,
        categories: categorizeObjective(secondPart),
        isValidated: false
      };
      
      setSavedObjectives([
        ...savedObjectives.filter(obj => obj.id !== objective.id),
        newObjective1,
        newObjective2
      ]);
    }
  };

  const validateObjective = (objective: SavedObjective) => {
    // Mock validation logic - in real app this would use AI
    const isCorrect = Math.random() > 0.3; // 70% chance of being correct
    
    const result: ValidationResult = {
      isCorrect,
      feedback: isCorrect 
        ? "This objective is well-structured and appropriate for the learning context."
        : "This objective could be improved for better clarity and measurability.",
      suggestions: isCorrect ? [] : [
        "Students will demonstrate understanding of climate change impacts through practical examples",
        "Students will analyze the relationship between human activities and environmental changes",
        "Students will evaluate solutions for sustainable living practices"
      ]
    };
    
    setValidationResults({ ...validationResults, [objective.id]: result });
    
    const updatedObjective = {
      ...objective,
      isValidated: true,
      validationResult: result
    };
    
    setSavedObjectives(savedObjectives.map(obj => obj.id === objective.id ? updatedObjective : obj));
  };

  const addSuggestedObjective = (suggestion: string) => {
    const newObjective: SavedObjective = {
      id: Date.now().toString(),
      text: suggestion,
      categories: categorizeObjective(suggestion),
      isValidated: true,
      validationResult: {
        isCorrect: true,
        feedback: "This is an AI-suggested objective that follows best practices."
      }
    };
    setSavedObjectives([...savedObjectives, newObjective]);
    triggerCelebration();
  };

  const handleObjectiveToggle = (objective: string) => {
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
    const allObjectives = [...selectedObjectives, ...validCustomObjectives, ...savedObjectives.map(obj => obj.text)];
    onGenerateCO(allObjectives);
  };

  const handleShortlist = () => {
    const validCustomObjectives = customObjectives.filter(obj => obj.trim() !== '');
    const allObjectives = [...selectedObjectives, ...validCustomObjectives, ...savedObjectives.map(obj => obj.text)];
    if (setShortlistedObjectives) {
      setShortlistedObjectives([...shortlistedObjectives, ...allObjectives]);
      triggerCelebration();
    }
  };

  const validCustomObjectives = customObjectives.filter(obj => obj.trim() !== '');
  const totalSelected = selectedObjectives.length + validCustomObjectives.length + savedObjectives.length;

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

      {/* AI-Suggested Objectives */}
      {suggestedObjectives.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-blue-600" size={20} />
            <h4 className="font-semibold text-blue-900">AI-Suggested Core Objectives</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {availableObjectives.map((objective) => (
              <div
                key={objective.id}
                className="relative p-4 rounded-lg border border-blue-200 bg-white/80 hover:bg-white transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{objective.icon}</div>
                  <h5 className="font-medium text-gray-800 mb-1">{objective.label}</h5>
                  <p className="text-xs text-gray-600">{objective.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-700 bg-blue-100/50 p-3 rounded-lg">
            ✨ These objectives are automatically generated and categorized based on best practices. Each saved objective will be dynamically categorized.
          </p>
        </div>
      )}

      {/* Enhanced Custom Objectives with Save Feature */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💡</div>
            <h4 className="font-semibold text-orange-900">Write & Save Objectives</h4>
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
                placeholder="Type your objective here (e.g., 'Relevance to daily life: Students gain a holistic understanding of food production and its socio-economic impact in the country.')"
                value={objective}
                onChange={(e) => updateCustomObjective(index, e.target.value)}
                className="flex-1 min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
              />
              <div className="flex flex-col gap-2">
                {objective.trim() && (
                  <Button
                    onClick={() => saveObjective(objective)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    💾 Save
                  </Button>
                )}
                {customObjectives.length > 1 && (
                  <Button
                    onClick={() => removeCustomObjective(index)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Objectives Management */}
      {savedObjectives.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-blue-600" size={20} />
            <h4 className="font-semibold text-gray-900">Saved Objectives ({savedObjectives.length})</h4>
          </div>
          
          <div className="space-y-4">
            {savedObjectives.map((objective) => (
              <Card key={objective.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium mb-2">{objective.text}</p>
                      
                      {/* Categories */}
                      <div className="flex gap-2 mb-2">
                        {objective.categories.map((category, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className={`
                              ${category === 'Timeless values' ? 'bg-purple-100 text-purple-700' : ''}
                              ${category === 'Life skill' ? 'bg-blue-100 text-blue-700' : ''}
                              ${category === 'Relevance to life' ? 'bg-green-100 text-green-700' : ''}
                              ${category === 'General' ? 'bg-gray-100 text-gray-700' : ''}
                            `}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Validation Result */}
                      {objective.validationResult && (
                        <Alert className={`mt-2 ${objective.validationResult.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                          <AlertCircle className={`h-4 w-4 ${objective.validationResult.isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                          <AlertDescription className={objective.validationResult.isCorrect ? 'text-green-800' : 'text-red-800'}>
                            <div className="flex items-center gap-2 mb-2">
                              {objective.validationResult.isCorrect ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              <span className="font-medium">
                                {objective.validationResult.isCorrect ? 'Validated ✓' : 'Needs Improvement'}
                              </span>
                            </div>
                            <p className="text-sm">{objective.validationResult.feedback}</p>
                            
                            {/* Suggestions */}
                            {objective.validationResult.suggestions && objective.validationResult.suggestions.length > 0 && (
                              <div className="mt-3">
                                <p className="font-medium text-sm mb-2">Suggested improvements:</p>
                                <div className="space-y-2">
                                  {objective.validationResult.suggestions.map((suggestion, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded border">
                                      <p className="text-sm text-gray-700 flex-1">{suggestion}</p>
                                      <Button
                                        onClick={() => addSuggestedObjective(suggestion)}
                                        size="sm"
                                        variant="outline"
                                        className="border-green-300 text-green-700 hover:bg-green-50"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {/* Shortlist Toggle */}
                      <Button
                        onClick={() => toggleShortlist(objective)}
                        variant="outline"
                        size="sm"
                        className={`
                          ${shortlistedObjectives.includes(objective.text) 
                            ? 'border-yellow-400 bg-yellow-50 text-yellow-700' 
                            : 'border-gray-300 text-gray-600 hover:border-yellow-400'
                          }
                        `}
                      >
                        {shortlistedObjectives.includes(objective.text) ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {/* Edit Actions */}
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => rephraseObjective(objective)}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          title="Rephrase"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => splitObjective(objective)}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                          title="Split"
                        >
                          <Split className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => validateObjective(objective)}
                          variant="outline"
                          size="sm"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          title="Validate"
                          disabled={objective.isValidated}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => removeObjective(objective.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Shortlisted Objectives Display */}
      {shortlistedObjectives.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="text-orange-600 fill-current" size={18} />
            <h4 className="font-medium text-orange-900">Shortlisted Objectives</h4>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {shortlistedObjectives.length}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {shortlistedObjectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-orange-200 shadow-sm"
              >
                <Star className="text-orange-500 fill-current" size={14} />
                <span className="text-sm text-gray-700">{objective}</span>
                <button
                  onClick={() => setShortlistedObjectives && setShortlistedObjectives(shortlistedObjectives.filter(obj => obj !== objective))}
                  className="text-orange-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        {/* Validate All and Shortlist All Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <Button 
            variant="outline"
            onClick={() => savedObjectives.forEach(obj => !obj.isValidated && validateObjective(obj))}
            disabled={savedObjectives.every(obj => obj.isValidated)}
            className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-4 py-2 rounded-lg font-medium shadow-sm"
          >
            <CheckCircle2 className="mr-2" size={16} />
            Validate All
          </Button>
          <Button 
            variant="outline"
            onClick={handleShortlist}
            disabled={totalSelected === 0}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-4 py-2 rounded-lg font-medium shadow-sm"
          >
            <Target className="mr-2" size={16} />
            Shortlist All
          </Button>
        </div>
        
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
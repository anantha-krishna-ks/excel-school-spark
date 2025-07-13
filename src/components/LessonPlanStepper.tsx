import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Target, 
  Sparkles, 
  Bot, 
  Lightbulb,
  Heart,
  Star,
  Trophy,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface LessonPlanStepperProps {
  onGenerateCO: (objectives: string[]) => void;
}

const LessonPlanStepper = ({ onGenerateCO }: LessonPlanStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjective, setCustomObjective] = useState('');
  const [mode, setMode] = useState<'recommended' | 'aiAssist'>('recommended');
  const [validationStep, setValidationStep] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const coreObjectives = [
    {
      id: 'timeless',
      label: 'Timeless values',
      icon: '⭐',
      description: 'Help students understand eternal principles and moral values'
    },
    {
      id: 'lifeskill',
      label: 'Life skill',
      icon: '💪',
      description: 'Develop practical skills for personal and professional growth'
    },
    {
      id: 'relevance',
      label: 'Relevance to life',
      icon: '🌱',
      description: 'Connect learning to real-world applications and daily life'
    }
  ];

  // Auto-select all objectives in AI Assist mode
  React.useEffect(() => {
    if (mode === 'aiAssist') {
      setSelectedObjectives(coreObjectives.map(obj => obj.label));
    }
  }, [mode]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
  };

  const handleObjectiveToggle = (objective: string) => {
    if (mode === 'aiAssist') return; // Don't allow deselection in AI mode
    
    const isSelected = selectedObjectives.includes(objective);
    if (isSelected) {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
      triggerCelebration();
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedObjectives.length === 0) return;
    setCurrentStep(currentStep + 1);
  };

  const handleValidateAndContinue = () => {
    setValidationStep(true);
    setTimeout(() => {
      const objectives = customObjective.trim() 
        ? [...selectedObjectives, customObjective.trim()] 
        : selectedObjectives;
      onGenerateCO(objectives);
    }, 800);
  };

  const getNudgeMessage = () => {
    if (currentStep === 1 && selectedObjectives.length === 0) {
      return "👋 Start by selecting what matters most for your students!";
    }
    if (currentStep === 2 && !customObjective.trim() && selectedObjectives.length < 2) {
      return "💡 Consider adding a specific objective to make your lesson unique!";
    }
    return null;
  };

  const steps = [
    { number: 1, title: 'Core Objectives', completed: selectedObjectives.length > 0 },
    { number: 2, title: 'Customize', completed: customObjective.trim() || selectedObjectives.length >= 2 },
    { number: 3, title: 'Generate', completed: false }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="animate-ping">
            <Sparkles className="text-yellow-400" size={48} />
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
          <p className="text-gray-600">Let's create something amazing together ✨</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
              ${currentStep >= step.number 
                ? (step.completed ? 'bg-green-500 text-white' : 'bg-purple-500 text-white')
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {step.completed ? <CheckCircle2 size={20} /> : step.number}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="mx-4 text-gray-300" size={16} />
            )}
          </div>
        ))}
      </div>

      {/* Nudge Message */}
      {getNudgeMessage() && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-blue-600" size={16} />
            <span className="text-sm text-blue-800">{getNudgeMessage()}</span>
          </div>
        </div>
      )}

      {/* Step 1: Core Objectives */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('recommended')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                mode === 'recommended'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Heart size={16} />
              <span className="font-medium">Recommended</span>
            </button>
            <button
              onClick={() => setMode('aiAssist')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                mode === 'aiAssist'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Bot size={16} />
              <span className="font-medium">AI Assist</span>
            </button>
          </div>

          {/* Objectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreObjectives.map((objective) => {
              const isSelected = selectedObjectives.includes(objective.label);
              const isDisabled = mode === 'aiAssist';
              
              return (
                <Card
                  key={objective.id}
                  className={`
                    relative p-6 cursor-pointer transition-all duration-300 
                    ${isSelected 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg border-transparent' 
                      : 'hover:shadow-md hover:border-purple-200'
                    }
                    ${isDisabled ? 'cursor-default' : 'hover:scale-105'}
                  `}
                  onClick={() => !isDisabled && handleObjectiveToggle(objective.label)}
                >
                  {/* Selection indicator */}
                  <div className="absolute top-4 right-4">
                    {isSelected ? (
                      <CheckCircle2 className="text-white" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-4">{objective.icon}</div>
                    <h4 className={`font-semibold mb-2 text-lg ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {objective.label}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                      {objective.description}
                    </p>
                  </div>
                  
                  {mode === 'aiAssist' && (
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        AI Selected
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="text-yellow-500" size={20} />
              <span className="font-medium text-gray-700">
                {selectedObjectives.length} objectives selected
              </span>
            </div>
            
            <Button
              onClick={handleNextStep}
              disabled={selectedObjectives.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue to Customize
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Customize */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Selected objectives summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={16} />
              Your Selected Objectives
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedObjectives.map((obj, index) => (
                <span key={index} className="bg-white text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                  {obj}
                </span>
              ))}
            </div>
          </div>

          {/* Custom objective */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">💡</div>
              <h4 className="font-semibold text-orange-900">Add Your Special Touch (Optional)</h4>
            </div>
            
            <Textarea
              placeholder="Want to add something specific? Type it here... (e.g., Students will learn to solve real-world environmental problems)"
              value={customObjective}
              onChange={(e) => setCustomObjective(e.target.value)}
              className="w-full min-h-[100px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2"
            >
              Back
            </Button>
            
            <Button
              onClick={handleNextStep}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Ready to Generate
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Validate & Generate */}
      {currentStep === 3 && (
        <div className="space-y-6 text-center">
          {!validationStep ? (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-4 text-xl">Let's Review Your Lesson Plan</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">Core Objectives ({selectedObjectives.length})</h5>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedObjectives.map((obj, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {customObjective.trim() && (
                    <div>
                      <h5 className="font-medium text-purple-800 mb-2">Your Custom Objective</h5>
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-gray-700">{customObjective.trim()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2"
                >
                  Back to Edit
                </Button>
                
                <Button
                  onClick={handleValidateAndContinue}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="mr-2" size={20} />
                  Generate My Lesson Plan! 🚀
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8">
              <div className="animate-spin w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
              <h4 className="font-semibold text-purple-900 text-xl mb-2">Validating & Creating...</h4>
              <p className="text-purple-700">We're crafting your perfect lesson plan ✨</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonPlanStepper;
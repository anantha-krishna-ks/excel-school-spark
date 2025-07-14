import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import SelectionPanel from './SelectionPanel';
import CoreObjectives from './CoreObjectives';
import ExpectedLearningOutcome from './ExpectedLearningOutcome';

interface MainStepperProps {
  board: string;
  setBoard: (board: string) => void;
  grade: string;
  setGrade: (grade: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  onGenerateCO: (objectives: string[]) => void;
}

const MainStepper = ({ 
  board, 
  setBoard, 
  grade, 
  setGrade, 
  subject, 
  setSubject, 
  onGenerateCO 
}: MainStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      number: 1,
      title: 'Manage Lesson Plan',
      description: 'Set up your teaching context',
      icon: '🎯'
    },
    {
      number: 2,
      title: 'Core Objectives',
      description: 'Define your teaching goals',
      icon: '🎪'
    },
    {
      number: 3,
      title: 'Expected Learning Outcome',
      description: 'Create specific learning outcomes',
      icon: '🎓'
    }
  ];

  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isStepActive = (stepNumber: number) => currentStep === stepNumber;
  const isStepAccessible = (stepNumber: number) => stepNumber <= currentStep;

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (isStepAccessible(stepNumber) || isStepCompleted(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const canProceedFromStep1 = board && grade && subject;
  const canProceedFromStep2 = true; // Will be updated based on Core Objectives selection

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectionPanel
            board={board}
            setBoard={setBoard}
            grade={grade}
            setGrade={setGrade}
            subject={subject}
            setSubject={setSubject}
          />
        );
      case 2:
        return <CoreObjectives onGenerateCO={onGenerateCO} />;
      case 3:
        return <ExpectedLearningOutcome />;
      default:
        return null;
    }
  };

  const getNudgeMessage = () => {
    if (currentStep === 1 && !canProceedFromStep1) {
      return "👋 Complete your lesson setup to continue to the next step!";
    }
    if (currentStep === 2) {
      return "🎯 Choose your core objectives to proceed to learning outcomes!";
    }
    if (currentStep === 3) {
      return "🎓 Define your learning outcomes with Blooms taxonomy, skills, and attitudes!";
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Modern Step Navigation */}
      <div className="relative">
        {/* Progress Background */}
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 rounded-full"></div>
        
        {/* Active Progress */}
        <div 
          className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-green-500 rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handleStepClick(step.number)}
            >
              {/* Step Circle */}
              <div className={`
                relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ease-out transform
                ${isStepCompleted(step.number)
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl scale-110 ring-4 ring-green-200'
                  : isStepActive(step.number)
                  ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-2xl scale-125 ring-4 ring-primary/30'
                  : isStepAccessible(step.number)
                  ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 hover:from-gray-200 hover:to-gray-300 hover:scale-110 shadow-lg'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300 shadow-sm'
                }
                group-hover:shadow-2xl
              `}>
                {isStepCompleted(step.number) ? (
                  <CheckCircle2 size={28} className="animate-pulse" />
                ) : (
                  <span className="filter drop-shadow-sm">{step.icon}</span>
                )}
                
                {/* Pulse Effect for Active Step */}
                {isStepActive(step.number) && (
                  <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping"></div>
                )}
              </div>

              {/* Step Info */}
              <div className="mt-4 text-center max-w-32">
                <h4 className={`font-bold text-sm mb-1 transition-colors duration-300 ${
                  isStepActive(step.number) 
                    ? 'text-primary' 
                    : isStepCompleted(step.number)
                    ? 'text-green-600'
                    : isStepAccessible(step.number)
                    ? 'text-gray-700 group-hover:text-gray-900'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-xs leading-tight transition-colors duration-300 ${
                  isStepActive(step.number) 
                    ? 'text-primary/70' 
                    : isStepCompleted(step.number)
                    ? 'text-green-500'
                    : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Nudge Message */}
      {getNudgeMessage() && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-5 border border-blue-200/50 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 animate-pulse"></div>
          <div className="relative flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl animate-bounce">💡</span>
            </div>
            <div className="flex-1">
              <span className="text-sm text-blue-900 font-semibold">{getNudgeMessage()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Enhanced Navigation Buttons */}
      <div className="flex justify-between items-center bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Previous</span>
        </Button>

        <div className="text-center px-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={
            currentStep === steps.length ||
            (currentStep === 1 && !canProceedFromStep1)
          }
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-lg"
        >
          <span className="font-medium">Next</span>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MainStepper;
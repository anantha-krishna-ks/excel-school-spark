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
      {/* Step Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div 
                className={`
                  relative flex items-center cursor-pointer group
                  ${isStepAccessible(step.number) ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
                onClick={() => handleStepClick(step.number)}
              >
                {/* Step Circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300
                  ${isStepCompleted(step.number)
                    ? 'bg-green-500 text-white shadow-lg'
                    : isStepActive(step.number)
                    ? 'bg-primary text-white shadow-lg scale-110'
                    : isStepAccessible(step.number)
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {isStepCompleted(step.number) ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="ml-4 hidden md:block">
                  <h4 className={`font-semibold text-sm ${
                    isStepActive(step.number) 
                      ? 'text-primary' 
                      : isStepCompleted(step.number)
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-all duration-300
                  ${isStepCompleted(step.number) 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                  }
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Step {currentStep}: {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600 text-sm">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Nudge Message */}
      {getNudgeMessage() && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            <span className="text-sm text-blue-800 font-medium">{getNudgeMessage()}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={
            currentStep === steps.length ||
            (currentStep === 1 && !canProceedFromStep1)
          }
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default MainStepper;
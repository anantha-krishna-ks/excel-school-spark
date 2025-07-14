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
      title: 'Manage Objectives',
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
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-muted rounded-full"></div>
        
        {/* Active Progress */}
        <div 
          className="absolute top-10 left-0 h-0.5 bg-primary rounded-full transition-all duration-500 ease-out"
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
                relative w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-out
                ${isStepCompleted(step.number)
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : isStepActive(step.number)
                  ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20'
                  : isStepAccessible(step.number)
                  ? 'bg-muted text-muted-foreground hover:bg-muted/80 shadow-sm'
                  : 'bg-muted/50 text-muted-foreground/50 shadow-sm'
                }
              `}>
                {isStepCompleted(step.number) ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <span>{step.icon}</span>
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
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
            <div className="flex-1">
              <span className="text-sm text-foreground font-medium">{getNudgeMessage()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center bg-card rounded-lg border border-border p-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </Button>

        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx < currentStep ? 'bg-primary' : 'bg-muted'
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
          className="flex items-center gap-2"
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default MainStepper;
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, Upload, Target, FileCheck } from 'lucide-react';
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
  const [shortlistedObjectives, setShortlistedObjectives] = useState<string[]>([]);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const steps = [
    {
      number: 1,
      title: 'Basic Setup & Content',
      description: 'Configure your lesson basics and upload materials',
      icon: BookOpen
    },
    {
      number: 2,
      title: 'Manage Objectives',
      description: 'Select learning objectives',
      icon: Target
    },
    {
      number: 3,
      title: 'Expected Learning Outcomes',
      description: 'Define learning outcomes',
      icon: FileCheck
    },
    {
      number: 4,
      title: 'Review & Create',
      description: 'Finalize your lesson plan',
      icon: CheckCircle2
    }
  ];

  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isStepActive = (stepNumber: number) => currentStep === stepNumber;
  const isStepAccessible = (stepNumber: number) => stepNumber <= currentStep;

  const scrollToSection = (stepNumber: number) => {
    const section = sectionRefs.current[stepNumber - 1];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentStep(stepNumber);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    scrollToSection(stepNumber);
  };

  const canProceedFromStep1 = board && grade && subject;

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div className="w-full bg-background">
      {/* Modern Horizontal Stepper */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div 
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => handleStepClick(step.number)}
                  >
                    {/* Modern Step Circle with Icon */}
                    <div className={`
                      relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-3
                      ${isStepActive(step.number)
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : isStepCompleted(step.number)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 group-hover:scale-105'
                      }
                    `}>
                      {isStepCompleted(step.number) ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <StepIcon size={20} />
                      )}
                    </div>

                    {/* Step Title and Description */}
                    <div className="text-center max-w-32">
                      <div className={`text-sm font-medium transition-colors duration-200 ${
                        isStepActive(step.number)
                          ? 'text-blue-600'
                          : isStepCompleted(step.number)
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-6 mb-8 transition-colors duration-300 ${
                      isStepCompleted(step.number) ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sections Container with Visual Separation */}
      <div className="bg-muted/30">
        {/* Section 1: Basic Setup & Content */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[0] = el; }}
          className="bg-background py-12"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Basic Setup & Content</h1>
              <p className="text-muted-foreground max-w-md mx-auto">Configure your lesson basics and upload materials</p>
            </div>
            
            <SelectionPanel
              board={board}
              setBoard={setBoard}
              grade={grade}
              setGrade={setGrade}
              subject={subject}
              setSubject={setSubject}
            />
          </div>
        </section>

        {/* Section 2: Manage Objectives */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[1] = el; }}
          className="bg-muted/20 py-12"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Manage Objectives</h1>
              <p className="text-muted-foreground max-w-md mx-auto">Choose learning objectives for your lesson</p>
            </div>
            
            <CoreObjectives 
              onGenerateCO={onGenerateCO}
              shortlistedObjectives={shortlistedObjectives}
              setShortlistedObjectives={setShortlistedObjectives}
            />
          </div>
        </section>

        {/* Section 3: Expected Learning Outcomes */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[2] = el; }}
          className="bg-background py-12"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Expected Learning Outcomes</h1>
              <p className="text-muted-foreground max-w-md mx-auto">Define what students will achieve</p>
            </div>
            
            <ExpectedLearningOutcome />
          </div>
        </section>

        {/* Section 4: Review & Create */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[3] = el; }}
          className="bg-muted/20 py-12"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Review & Create Your Lesson Plan</h1>
              <p className="text-muted-foreground max-w-md mx-auto">Everything looks perfect! Review and finalize your lesson plan.</p>
            </div>
            
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <h3 className="text-lg font-semibold">Lesson Summary</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Board:</div>
                  <div className="font-medium">{board || 'Not selected'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Grade:</div>
                  <div className="font-medium">{grade || 'Not selected'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Subject:</div>
                  <div className="font-medium">{subject || 'Not selected'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Duration:</div>
                  <div className="font-medium">0h 30min</div>
                </div>
              </div>
              
              {shortlistedObjectives.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Selected Objectives:</div>
                  <div className="space-y-2">
                    {shortlistedObjectives.map((objective, index) => (
                      <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="text-primary font-medium">{objective}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => markStepComplete(4)}
                className="px-8 py-3"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Create My Lesson Plan!
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainStepper;
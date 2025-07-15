import React, { useState, useRef } from 'react';
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
  const [shortlistedObjectives, setShortlistedObjectives] = useState<string[]>([]);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const steps = [
    {
      number: 1,
      title: 'Basic Setup',
      description: 'Configure your lesson basics',
      icon: '📚'
    },
    {
      number: 2,
      title: 'Upload Content',
      description: 'Add your lesson materials',
      icon: '📁'
    },
    {
      number: 3,
      title: 'Select Objectives',
      description: 'Choose learning objectives',
      icon: '🎯'
    },
    {
      number: 4,
      title: 'Review & Create',
      description: 'Finalize your lesson plan',
      icon: '✅'
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
    <div className="w-full">
      {/* Horizontal Stepper */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div 
                  className={`flex items-center cursor-pointer transition-all duration-200 ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                  onClick={() => handleStepClick(step.number)}
                >
                  {/* Step Circle */}
                  <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${isStepCompleted(step.number)
                      ? 'bg-green-500 border-green-500 text-white'
                      : isStepActive(step.number)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isStepAccessible(step.number)
                      ? 'border-muted-foreground text-muted-foreground hover:border-primary'
                      : 'border-muted text-muted-foreground'
                    }
                  `}>
                    {isStepCompleted(step.number) ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      isStepActive(step.number)
                        ? 'text-primary'
                        : isStepCompleted(step.number)
                        ? 'text-green-600'
                        : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-0.5 mx-4 transition-colors duration-200 ${
                    isStepCompleted(step.number) ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Container */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Section 1: Basic Setup & Content */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[0] = el; }}
          className="min-h-screen py-8 space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl">📚</span>
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
          
          {canProceedFromStep1 && (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  markStepComplete(1);
                  scrollToSection(2);
                }}
                className="px-8 py-3"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Section 2: Upload Content */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[1] = el; }}
          className="min-h-screen py-8 space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl">📁</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Upload Content</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Add your lesson materials</p>
          </div>
          
          <div className="bg-card rounded-lg border p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center mx-auto">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Upload Your Materials</h3>
            <p className="text-muted-foreground">PDFs, documents, or presentations</p>
            <Button className="mt-4">
              <ArrowRight className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Perfect! Your content is uploaded and ready.</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => {
                markStepComplete(2);
                scrollToSection(3);
              }}
              className="px-8 py-3"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Section 3: Select Objectives */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[2] = el; }}
          className="min-h-screen py-8 space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Select Objectives</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Choose learning objectives</p>
          </div>
          
          <CoreObjectives 
            onGenerateCO={onGenerateCO}
            shortlistedObjectives={shortlistedObjectives}
            setShortlistedObjectives={setShortlistedObjectives}
          />
          
          <div className="flex justify-center">
            <Button
              onClick={() => {
                markStepComplete(3);
                scrollToSection(4);
              }}
              className="px-8 py-3"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Section 4: Review & Create */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[3] = el; }}
          className="min-h-screen py-8 space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Review & Create Your Lesson Plan</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Everything looks perfect! Review and finalize your lesson plan.</p>
          </div>
          
          <ExpectedLearningOutcome />
          
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
                <div className="text-sm text-muted-foreground">Selected Core Objectives:</div>
                <div className="space-y-2">
                  {shortlistedObjectives.map((objective, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-purple-800 font-medium">{objective}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => markStepComplete(4)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create My Lesson Plan!
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainStepper;
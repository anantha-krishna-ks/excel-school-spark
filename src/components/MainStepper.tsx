import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, Target, FileCheck, Sparkles, Award, Clock, Users } from 'lucide-react';
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
  const [isSticky, setIsSticky] = useState(false);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const stepperRef = useRef<HTMLDivElement>(null);
  const canProceedFromStep1 = board && grade && subject;

  // Auto-detect current step based on scroll position and sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionRefs.current;
      const stepperElement = stepperRef.current;
      const scrollPosition = window.scrollY;
      const headerOffset = 120; // Offset for header + sticky positioning
      
      // Check if stepper should be sticky
      if (stepperElement) {
        const stepperTop = stepperElement.offsetTop;
        setIsSticky(scrollPosition > stepperTop - headerOffset);
      }
      
      // Update current step based on scroll position
      const adjustedScrollPosition = scrollPosition + headerOffset + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= adjustedScrollPosition) {
          setCurrentStep(i + 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-complete step 1 when basic setup is done
  useEffect(() => {
    if (canProceedFromStep1 && !completedSteps.includes(1)) {
      setCompletedSteps(prev => [...prev, 1]);
    }
  }, [board, grade, subject, canProceedFromStep1, completedSteps]);

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

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  // Check section completion status
  const isSectionCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return board && grade && subject;
      case 2:
        return shortlistedObjectives.length > 0;
      case 3:
        return false; // Add logic based on your ExpectedLearningOutcome component
      case 4:
        return board && grade && subject && shortlistedObjectives.length > 0;
      default:
        return false;
    }
  };

  // Update completed steps based on section completion
  useEffect(() => {
    const newCompletedSteps: number[] = [];
    for (let i = 1; i <= 4; i++) {
      if (isSectionCompleted(i)) {
        newCompletedSteps.push(i);
      }
    }
    setCompletedSteps(newCompletedSteps);
  }, [board, grade, subject, shortlistedObjectives]);

  return (
    <div className="w-full bg-background">
      {/* Sticky Stepper */}
      <div 
        ref={stepperRef}
        className={`${
          isSticky 
            ? 'fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/30 shadow-sm' 
            : 'bg-white border-b border-gray-200'
        } py-3 transition-all duration-300`}
      >
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
                    {/* Enhanced Step Circle with Icon */}
                    <div className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                      ${isStepActive(step.number)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-100'
                        : isStepCompleted(step.number)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 hover:from-gray-200 hover:to-gray-300 group-hover:scale-105'
                      }
                    `}>
                      {isStepCompleted(step.number) ? (
                        <CheckCircle2 size={20} className="drop-shadow-sm" />
                      ) : (
                        <StepIcon size={20} className={isStepActive(step.number) ? 'drop-shadow-sm' : ''} />
                      )}
                      
                      {/* Active Pulse */}
                      {isStepActive(step.number) && (
                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
                      )}
                    </div>

                    {/* Step Title and Description */}
                    <div className={`text-center transition-all duration-200 ${isSticky ? 'max-w-24' : 'max-w-32'}`}>
                      <div className={`text-sm font-medium transition-colors duration-200 ${
                        isStepActive(step.number)
                          ? 'text-blue-600'
                          : isStepCompleted(step.number)
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}>
                        {isSticky ? step.title.split(' ')[0] : step.title}
                      </div>
                      {!isSticky && (
                        <div className="text-xs text-gray-400 mt-1">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`${isSticky ? 'w-12 mx-4 mb-6' : 'w-16 mx-6 mb-8'} h-0.5 transition-all duration-300 ${
                      isStepCompleted(step.number) 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : isStepActive(step.number)
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer for sticky stepper */}
      {isSticky && <div className="h-[76px]"></div>}

      {/* Sections Container with Enhanced Visual Separation */}
      <div className="relative">
        {/* Section 1: Basic Setup & Content */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[0] = el; }}
          className="relative bg-gradient-to-br from-blue-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <BookOpen className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Basic Setup & Content
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Configure your lesson basics and upload materials to get started
                </p>
              </div>
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
          className="relative bg-gradient-to-br from-purple-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
                <Target className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Manage Objectives
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Choose and customize learning objectives for your lesson
                </p>
              </div>
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
          className="relative bg-gradient-to-br from-emerald-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <FileCheck className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Expected Learning Outcomes
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Define measurable outcomes and success criteria
                </p>
              </div>
            </div>
            
            <ExpectedLearningOutcome />
          </div>
        </section>

        {/* Section 4: Review & Create - Enhanced */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[3] = el; }}
          className="relative bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          
          {/* Celebration Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-20 animate-bounce [animation-delay:0s]"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-amber-400 rounded-full opacity-30 animate-bounce [animation-delay:0.5s]"></div>
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-orange-300 rounded-full opacity-25 animate-bounce [animation-delay:1s]"></div>
            <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-20 animate-bounce [animation-delay:1.5s]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 relative">
                <CheckCircle2 className="h-10 w-10 text-white drop-shadow-sm" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
                  🎉 Review & Create Your Lesson Plan
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Everything looks perfect! You're ready to create an amazing lesson plan.
                </p>
              </div>
            </div>
            
            {/* Enhanced Summary Card */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl border-2 border-amber-200/50 p-8 space-y-8 shadow-xl shadow-amber-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Lesson Summary</h3>
              </div>
              
              {/* Enhanced Grid with Icons */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Board</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{board || 'Not selected'}</div>
                </div>
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Grade</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{grade || 'Not selected'}</div>
                </div>
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Subject</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{subject || 'Not selected'}</div>
                </div>
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">30 minutes</div>
                </div>
              </div>
              
              {shortlistedObjectives.length > 0 && (
                <div className="space-y-4 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Selected Objectives ({shortlistedObjectives.length})</span>
                  </div>
                  <div className="space-y-3">
                    {shortlistedObjectives.map((objective, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <div className="text-amber-800 font-medium leading-relaxed">{objective}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Prominent CTA Button */}
            <div className="flex justify-center mt-12">
              <Button
                onClick={() => markStepComplete(4)}
                size="lg"
                className="px-12 py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-2xl shadow-amber-500/30 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-amber-500/40 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
                <span className="relative z-10">🚀 Create My Amazing Lesson Plan!</span>
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
              </Button>
            </div>
            
            {/* Success Message */}
            <div className="text-center mt-6">
              <p className="text-amber-600 font-medium animate-pulse">
                ✨ Your lesson plan will be ready in seconds!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainStepper;
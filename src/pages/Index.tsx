
import React, { useState } from 'react';
import Header from '@/components/Header';
import SelectionPanel from '@/components/SelectionPanel';
import CoreObjectives from '@/components/CoreObjectives';
import ExpectedLearningOutcome from '@/components/ExpectedLearningOutcome';

const Index = () => {
  const [board, setBoard] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [generatedCOs, setGeneratedCOs] = useState<string[]>([]);

  const handleGenerateCO = (objectives: string[]) => {
    // Simulate generating course objectives based on selected core objectives
    const cos = objectives.map(obj => `Learning Objective: Students will ${obj.toLowerCase()} through engaging activities and real-world applications`);
    setGeneratedCOs(cos);
    
    console.log('Generated Course Objectives:', cos);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <SelectionPanel 
            board={board}
            setBoard={setBoard}
            grade={grade}
            setGrade={setGrade}
            subject={subject}
            setSubject={setSubject}
          />
          
          <CoreObjectives onGenerateCO={handleGenerateCO} />
          
          <ExpectedLearningOutcome />
        </div>
      </div>
    </div>
  );
};

export default Index;


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
    const cos = objectives.map(obj => `CO: ${obj} - Students will demonstrate understanding of ${obj.toLowerCase()}`);
    setGeneratedCOs(cos);
    
    // You could add a toast notification here
    console.log('Generated COs:', cos);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

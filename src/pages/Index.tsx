
import React, { useState } from 'react';
import Header from '@/components/Header';
import MainStepper from '@/components/MainStepper';

const Index = () => {
  const [board, setBoard] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState<string>('');
  const [generatedCOs, setGeneratedCOs] = useState<string[]>([]);

  const handleGenerateCO = (objectives: string[]) => {
    // Simulate generating course objectives based on selected core objectives
    const cos = objectives.map(obj => `Learning Objective: Students will ${obj.toLowerCase()} through engaging activities and real-world applications`);
    setGeneratedCOs(cos);
    
    console.log('Generated Course Objectives:', cos);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <MainStepper
        board={board}
        setBoard={setBoard}
        grade={grade}
        setGrade={setGrade}
        subject={subject}
        setSubject={setSubject}
        chapters={chapters}
        setChapters={setChapters}
        onGenerateCO={handleGenerateCO}
      />
    </div>
  );
};

export default Index;

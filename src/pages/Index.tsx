
import React, { useState } from 'react';
import Header from '@/components/Header';
import MainStepper from '@/components/MainStepper';
import { CourseOutcome } from './api';

const Index = () => {
  const [board, setBoard] = useState('cbse');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState<string>('');
  const [generatedCOs, setGeneratedCOs] = useState<CourseOutcome[]>([]);

  const handleGenerateCO = (objectives: any[]) => {
    setGeneratedCOs(objectives);
    console.log('Generated Course Objectives:', objectives);
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
        generatedCOs={generatedCOs}
      />
    </div>
  );
};

export default Index;

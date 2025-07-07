
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectionPanelProps {
  board: string;
  setBoard: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
}

const SelectionPanel = ({ board, setBoard, grade, setGrade, subject, setSubject }: SelectionPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-600 mb-6">Board/Standard, Grade, Subject & Other Selection happens here.</p>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          variant="outline" 
          className="min-w-[150px] h-12 bg-blue-50 border-blue-200 hover:bg-blue-100"
        >
          Create New LP
        </Button>
        <Button 
          variant="outline" 
          className="min-w-[150px] h-12 bg-green-50 border-green-200 hover:bg-green-100"
        >
          Modify Existing LP
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-gray-700">On upload, this frame expands & displays content</p>
        <Button 
          variant="outline" 
          className="bg-gray-50 border-gray-300 hover:bg-gray-100"
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default SelectionPanel;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
}

const CoreObjectives = ({ onGenerateCO }: CoreObjectivesProps) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([
    'Current happenings',
    'School values (dust out)'
  ]);
  
  const objectives = [
    'Current happenings',
    'School values (dust out)', 
    'Human, ethics & moral',
    'Timeless values',
    'College & career readiness',
    'Relevance to life',
    'Life skill'
  ];

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (checked) {
      setSelectedObjectives([...selectedObjectives, objective]);
    } else {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    }
  };

  const handleGenerateCO = () => {
    onGenerateCO(selectedObjectives);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Objectives</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {objectives.map((objective) => (
          <div key={objective} className="flex items-center space-x-3">
            <Checkbox
              id={objective}
              checked={selectedObjectives.includes(objective)}
              onCheckedChange={(checked) => handleObjectiveChange(objective, !!checked)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label 
              htmlFor={objective} 
              className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
            >
              {objective}
            </label>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <Button 
          onClick={handleGenerateCO}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          disabled={selectedObjectives.length === 0}
        >
          Generate COs
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">
          Generated COs in this box is editable, rephrasable on selection of [Remove(s)], deletable, etc.
        </p>
        <div className="flex gap-2 mb-2">
          <Button variant="outline" size="sm" className="text-xs">Rephrase</Button>
          <Button variant="outline" size="sm" className="text-xs">Op°2</Button>
        </div>
      </div>
    </div>
  );
};

export default CoreObjectives;

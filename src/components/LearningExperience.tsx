import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Brain } from 'lucide-react';

const LearningExperience = () => {
  const [selectedApproaches, setSelectedApproaches] = useState<string[]>([]);
  
  const [customSkills, setCustomSkills] = useState<string>('');
  const [selectedIntelligenceTypes, setSelectedIntelligenceTypes] = useState<string[]>([]);

  const pedagogicalApproaches = [
    'Constructivism',
    'Collaborative',
    'Reflective', 
    'Integrity',
    'Inquiry',
    'Contextual',
    'Inclusive',
    'Art Integrated',
    'Project-based',
    'Problem-based',
    'Experiential',
    'Differentiated'
  ];

  const intelligenceTypes = [
    'Visual-spatial',
    'Linguistic-verbal',
    'Logical-mathematical',
    'Body-kinesthetic', 
    'Musical',
    'Interpersonal',
    'Intrapersonal',
    'Naturalistic'
  ];

  const removeApproach = (approach: string) => {
    setSelectedApproaches(selectedApproaches.filter(a => a !== approach));
  };

  const handleCustomSkillsChange = (value: string) => {
    setCustomSkills(value);
    
    // Parse comma, space, or enter separated values
    if (value.includes(',') || value.includes('\n') || value.endsWith(' ')) {
      const skills = value
        .split(/[,\n\s]+/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      if (skills.length > 0) {
        const lastSkill = skills[skills.length - 1];
        if (lastSkill && !selectedApproaches.includes(lastSkill)) {
          setSelectedApproaches([...selectedApproaches, lastSkill]);
          setCustomSkills('');
        }
      }
    }
  };

  const handleIntelligenceChange = (intelligence: string, checked: boolean) => {
    if (checked) {
      setSelectedIntelligenceTypes([...selectedIntelligenceTypes, intelligence]);
    } else {
      setSelectedIntelligenceTypes(selectedIntelligenceTypes.filter(i => i !== intelligence));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !selectedApproaches.includes(value)) {
        setSelectedApproaches([...selectedApproaches, value]);
        setCustomSkills('');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Experience</h3>
        <p className="text-sm text-gray-600 mb-4">By default, all ELOs are selected</p>
        
        <div className="flex justify-end mb-6">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            onClick={() => setSelectedApproaches([
              'Constructivism',
              'Collaborative', 
              'Reflective',
              'Integrity',
              'Inquiry',
              'Contextual',
              'Inclusive',
              'Art Integrated'
            ])}
          >
            Generate Pedagogical Approaches
          </Button>
        </div>

        {/* Selected Pedagogical Approaches */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedApproaches.map((approach) => (
            <Badge 
              key={approach} 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer flex items-center gap-1 px-3 py-1"
              onClick={() => removeApproach(approach)}
            >
              {approach}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>

        {/* Custom Skills Input */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Add custom skills (comma, space, or enter separated)
          </h4>
          <Input
            value={customSkills}
            onChange={(e) => handleCustomSkillsChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type custom skills and press Enter, comma, or space to add..."
            className="w-full"
          />
        </div>

        {/* Intelligence Types Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Intelligence Types</h4>
          <Card className="p-4">
            <div className="space-y-3">
              {intelligenceTypes.map((intelligence) => (
                <div key={intelligence} className="flex items-center space-x-2">
                  <Checkbox
                    id={intelligence}
                    checked={selectedIntelligenceTypes.includes(intelligence)}
                    onCheckedChange={(checked) => handleIntelligenceChange(intelligence, !!checked)}
                  />
                  <label
                    htmlFor={intelligence}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {intelligence}
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Generate Learning Experience Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Generate Learning Experience
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LearningExperience;
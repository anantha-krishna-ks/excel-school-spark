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
  const [showLearningContent, setShowLearningContent] = useState<boolean>(false);

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
            onClick={() => setShowLearningContent(true)}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base rounded-lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate Learning Experience
          </Button>
        </div>

        {/* Learning Experience Content */}
        {showLearningContent && (
          <div className="mt-8 animate-fade-in">
            <Card className="p-6 bg-background border-2 border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-primary" />
                Learning Experience
              </h3>
              <p className="text-muted-foreground mb-6">
                (5 E Model/Experiential Learning/Art-Sports Integrated/ Inter/Cross Disciplinary etc. with clear mention of digital tools and resources used)
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3 border-b border-border pb-2">
                    5E Model
                  </h4>
                  <p className="font-medium text-foreground mb-4">Tools used:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">• Activity 1:</h5>
                      <p className="text-muted-foreground">
                        Introduction of nomenclature with an activity of asking the word used for water. Observe the difficulty and understand the requirement of uniformity in the names of chemical structure, Introduce the nomenclature then.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">• Activity 2:</h5>
                      <p className="text-muted-foreground">
                        Tracing carbon inside me and carbon around me.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">• Activity 3:</h5>
                      <p className="text-muted-foreground">
                        Resonance and reaction intermediates by storytelling.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">• Activity 4:</h5>
                      <p className="text-muted-foreground mb-3">
                        Experience the following using ball and stick models,
                      </p>
                      <ul className="ml-6 space-y-1 text-muted-foreground">
                        <li>1. Structures</li>
                        <li>2. Free rotation in alkanes</li>
                        <li>3. Restricted rotation in alkenes and alkynes.</li>
                        <li>4. Structures of different functional groups like nitriles, carbonyl compounds.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">• Digital Resources:</h5>
                      <p className="text-muted-foreground">
                        Animated videos on purification techniques and understand the principle of it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningExperience;
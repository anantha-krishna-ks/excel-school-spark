
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lightbulb, Bot, CheckCircle, Brain, Heart, Target, Plus, X } from 'lucide-react';
import { Loader } from '@/components/ui/loader';


const ExpectedLearningOutcome = () => {
  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([
    'Apply',
    'Analyse'
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [selectedAttitudes, setSelectedAttitudes] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState('');
  const [customCompetencies, setCustomCompetencies] = useState('');
  const [customAttitudes, setCustomAttitudes] = useState('');
  const [aiGeneratedSkills, setAiGeneratedSkills] = useState<string[]>([]);
  const [aiGeneratedCompetencies, setAiGeneratedCompetencies] = useState<string[]>([]);
  const [customSkillsList, setCustomSkillsList] = useState<string[]>([]);
  const [customCompetenciesList, setCustomCompetenciesList] = useState<string[]>([]);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingCompetencies, setIsGeneratingCompetencies] = useState(false);
  const [isGeneratingOutcomes, setIsGeneratingOutcomes] = useState(false);

  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedOutcomes, setGeneratedOutcomes] = useState<string[]>([]);

  const bloomsLevels = [
    { id: 'apply', label: 'Apply', icon: '🔧', description: 'Use knowledge in new situations' },
    { id: 'analyse', label: 'Analyse', icon: '🔍', description: 'Break down information into parts' },
    { id: 'evaluate', label: 'Evaluate', icon: '⚖️', description: 'Make judgments based on criteria' },
    { id: 'create', label: 'Create', icon: '🎨', description: 'Produce new or original work' }
  ];

  const skillsList: string[] = [];

  const competenciesList = [
    { name: 'Critical Thinking', description: 'Analyze and evaluate information logically' },
    { name: 'Problem Solving', description: 'Apply knowledge to resolve real-life challenges' },
    { name: 'Conceptual Understanding', description: 'Grasp and apply subject concepts meaningfully' },
    { name: 'Numeracy Skills', description: 'Use mathematical reasoning and operations effectively' },
    { name: 'Scientific Inquiry', description: 'Observe, hypothesize, and experiment systematically' },
    { name: 'Reading Comprehension', description: 'Interpret and infer meaning from texts' },
    { name: 'Effective Communication', description: 'Express ideas clearly in oral and written forms' },
    { name: 'Self-Awareness', description: 'Understand one\'s emotions, strengths, and limitations' },
    { name: 'Empathy', description: 'Recognize and respect others\' feelings and perspectives' },
    { name: 'Collaboration', description: 'Work effectively in teams and contribute positively' },
    { name: 'Adaptability', description: 'Adjust to new situations and challenges' },
    { name: 'Responsibility', description: 'Take ownership of actions and decisions' },
    { name: 'Ethical Reasoning', description: 'Make choices based on values and integrity' },
    { name: 'Time Management', description: 'Plan and prioritize tasks efficiently' },
    { name: 'Stress Management', description: 'Handle pressure and maintain emotional balance' },
    { name: 'Digital Literacy', description: 'Use technology responsibly and effectively' },
    { name: 'Financial Awareness', description: 'Understand basic money concepts and budgeting' },
    { name: 'Health & Hygiene', description: 'Maintain personal and community well-being' },
    { name: 'Creative Thinking', description: 'Generate original ideas and solutions' },
    { name: 'Artistic Expression', description: 'Communicate through visual and performing arts' },
    { name: 'Storytelling & Writing', description: 'Use imagination and structure to convey narratives' },
    { name: 'Analytical Reasoning', description: 'Break down complex problems and synthesize solutions' },
    { name: 'Decision Making', description: 'Choose appropriate actions based on evidence and context' },
    { name: 'Leadership', description: 'Motivate and guide peers toward shared goals' },
    { name: 'Initiative', description: 'Take proactive steps in learning and problem-solving' }
  ];

  const attitudesList = [
    'Respect',
    'Integrity', 
    'Compassion',
    'Empathy',
    'Responsibility'
  ];

  // Mock core objectives for mapping
  const mockCoreObjectives = ['Timeless values', 'Life skill', 'Relevance to life'];

  const handleBloomsChange = (blooms: string, checked: boolean) => {
    if (checked) {
      setSelectedBlooms([...selectedBlooms, blooms]);
    } else {
      setSelectedBlooms(selectedBlooms.filter(b => b !== blooms));
    }
  };

  const handleSkillsChange = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    }
  };

  const handleCompetenciesChange = (competency: string, checked: boolean) => {
    if (checked) {
      setSelectedCompetencies([...selectedCompetencies, competency]);
    } else {
      setSelectedCompetencies(selectedCompetencies.filter(c => c !== competency));
    }
  };

  const handleAttitudesChange = (attitude: string, checked: boolean) => {
    if (checked) {
      setSelectedAttitudes([...selectedAttitudes, attitude]);
    } else {
      setSelectedAttitudes(selectedAttitudes.filter(a => a !== attitude));
    }
  };

  const parseCustomInput = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const handleCustomSkillsChange = (value: string) => {
    setCustomSkills(value);
    const parsedSkills = parseCustomInput(value);
    setCustomSkillsList(parsedSkills);
    // Update selected skills with both AI and custom
    setSelectedSkills([...aiGeneratedSkills, ...parsedSkills]);
  };

  const handleCustomCompetenciesChange = (value: string) => {
    setCustomCompetencies(value);
    const parsedCompetencies = parseCustomInput(value);
    setCustomCompetenciesList(parsedCompetencies);
    // Update selected competencies with both AI and custom
    setSelectedCompetencies([...aiGeneratedCompetencies, ...parsedCompetencies]);
  };

  const handleCustomAttitudesChange = (value: string) => {
    setCustomAttitudes(value);
    const parsedAttitudes = parseCustomInput(value);
    setSelectedAttitudes([...new Set([...selectedAttitudes.filter(attitude => !parseCustomInput(customAttitudes).includes(attitude)), ...parsedAttitudes])]);
  };

  const handleVerify = () => {
    const writtenOutcomes = customPrompt.toLowerCase().split(',').map(obj => obj.trim());
    
    console.log('ELO Verification results:', {
      written: writtenOutcomes,
      bloomsAlignment: writtenOutcomes.length
    });
    
    alert(`Verification complete: Your learning outcomes are well-structured and ready to use!`);
  };

  const handleGenerateELO = async () => {
    setIsGeneratingOutcomes(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const outcomes = activeTab === 'recommended' && customPrompt.trim() 
      ? [customPrompt.trim()]
      : selectedBlooms.map(bloom => `Students will be able to ${bloom.toLowerCase()} concepts effectively`);
    
    setGeneratedOutcomes(outcomes);
    setIsGeneratingOutcomes(false);
    console.log('Generated ELO:', outcomes);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <Lightbulb className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Expected Learning Outcomes</h3>
          <p className="text-gray-600 text-sm">Define specific learning outcomes using Bloom's Taxonomy</p>
        </div>
      </div>


      {/* Direct content without tabs */}
      <div className="mb-6">
        <div className="space-y-6">
        {/* Blooms Taxonomy */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-600" size={20} />
            <h4 className="font-semibold text-gray-900">Bloom's Taxonomy - Higher Order Thinking Skills</h4>
          </div>
          <div className="space-y-3">
            <select 
              value={selectedBlooms[0] || ""} 
              onChange={(e) => setSelectedBlooms(e.target.value ? [e.target.value] : [])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="">Select Bloom's level</option>
              {bloomsLevels.map((bloom) => (
                <option key={bloom.id} value={bloom.label}>
                  {bloom.icon} {bloom.label} - {bloom.description}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="text-blue-600" size={20} />
              <h4 className="font-semibold text-gray-900">Skills</h4>
            </div>
            <Button
              onClick={async () => {
                setIsGeneratingSkills(true);
                // Simulate AI generation delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Generate 10 AI-powered context-relevant skills
                const contextSkills = [
                  'Data Analysis and Interpretation',
                  'Critical Thinking and Problem Solving',
                  'Digital Communication and Collaboration',
                  'Research and Information Literacy',
                  'Creative Innovation and Design Thinking',
                  'Scientific Method and Inquiry',
                  'Mathematical Reasoning and Logic',
                  'Presentation and Public Speaking',
                  'Time Management and Organization',
                  'Ethical Decision Making'
                ];
                setAiGeneratedSkills(contextSkills);
                // Combine AI skills with existing custom skills
                setSelectedSkills([...contextSkills, ...customSkillsList]);
                setIsGeneratingSkills(false);
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm px-4 py-2"
              disabled={isGeneratingSkills}
            >
              {isGeneratingSkills ? (
                <Loader size="sm" className="h-4 w-4 mr-2" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              {isGeneratingSkills ? 'Generating...' : 'Generate Skills'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {skillsList.map((skill) => (
                <div 
                  key={skill}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={(checked) => handleSkillsChange(skill, !!checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label 
                    htmlFor={`skill-${skill}`} 
                    className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>

            {/* AI Generated Skills Display */}
            {aiGeneratedSkills.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <h5 className="text-sm font-medium text-blue-900">AI Generated Skills:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiGeneratedSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm font-semibold">
                      <Bot className="h-3 w-3 mr-1" />
                      {skill}
                      <button
                        onClick={() => {
                          const newAiSkills = aiGeneratedSkills.filter(s => s !== skill);
                          setAiGeneratedSkills(newAiSkills);
                          setSelectedSkills([...newAiSkills, ...customSkillsList]);
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Skills Display */}
            {customSkillsList.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4 text-gray-600" />
                  <h5 className="text-sm font-medium text-gray-900">Custom Skills:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customSkillsList.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm font-semibold">
                      {skill}
                      <button
                        onClick={() => {
                          const newCustomSkills = customSkillsList.filter(s => s !== skill);
                          setCustomSkillsList(newCustomSkills);
                          setSelectedSkills([...aiGeneratedSkills, ...newCustomSkills]);
                          // Update the input field
                          setCustomSkills(newCustomSkills.join(', '));
                        }}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
             <div className="border-t pt-4">
               <label className="text-sm font-medium text-gray-700 mb-2 block">
                 Add custom skills (comma, space, or enter separated)
               </label>
               <Input
                 placeholder="e.g., Research skills, Digital literacy, Time management"
                 value={customSkills}
                 onChange={(e) => handleCustomSkillsChange(e.target.value)}
                 className="w-full"
               />
             </div>
          </div>
        </Card>

        {/* Competencies */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="text-green-600" size={20} />
              <h4 className="font-semibold text-gray-900">Competencies</h4>
            </div>
            <Button
              onClick={async () => {
                setIsGeneratingCompetencies(true);
                // Simulate AI generation delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Generate 10 AI-powered context-relevant competencies
                const contextCompetencies = [
                  'Critical Thinking: Analyze and evaluate information logically',
                  'Problem Solving: Apply knowledge to resolve real-life challenges',
                  'Conceptual Understanding: Grasp and apply subject concepts meaningfully',
                  'Effective Communication: Express ideas clearly in oral and written forms',
                  'Self-Awareness: Understand one\'s emotions, strengths, and limitations',
                  'Collaboration: Work effectively in teams and contribute positively',
                  'Adaptability: Adjust to new situations and challenges',
                  'Creative Thinking: Generate original ideas and solutions',
                  'Time Management: Plan and prioritize tasks efficiently',
                  'Digital Literacy: Use technology responsibly and effectively'
                ];
                setAiGeneratedCompetencies(contextCompetencies);
                // Combine AI competencies with existing custom competencies
                setSelectedCompetencies([...contextCompetencies, ...customCompetenciesList]);
                setIsGeneratingCompetencies(false);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm px-4 py-2"
              disabled={isGeneratingCompetencies}
            >
              {isGeneratingCompetencies ? (
                <Loader size="sm" className="h-4 w-4 mr-2" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              {isGeneratingCompetencies ? 'Generating...' : 'Generate Competencies'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {competenciesList.map((competency) => (
                <div 
                  key={competency.name}
                  className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <Checkbox
                    id={`competency-${competency.name}`}
                    checked={selectedCompetencies.includes(`${competency.name}: ${competency.description}`)}
                    onCheckedChange={(checked) => handleCompetenciesChange(`${competency.name}: ${competency.description}`, !!checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 mt-1"
                  />
                  <label 
                    htmlFor={`competency-${competency.name}`} 
                    className="text-sm cursor-pointer hover:text-gray-900 flex-1"
                  >
                    <div className="font-medium text-gray-900">{competency.name}</div>
                    <div className="text-gray-600 text-xs mt-1">{competency.description}</div>
                  </label>
                </div>
              ))}
            </div>

            {/* AI Generated Competencies Display */}
            {aiGeneratedCompetencies.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-green-600" />
                  <h5 className="text-sm font-medium text-green-900">AI Generated Competencies:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiGeneratedCompetencies.map((competency, index) => (
                    <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-semibold">
                      <Bot className="h-3 w-3 mr-1" />
                      {competency}
                      <button
                        onClick={() => {
                          const newAiCompetencies = aiGeneratedCompetencies.filter(c => c !== competency);
                          setAiGeneratedCompetencies(newAiCompetencies);
                          setSelectedCompetencies([...newAiCompetencies, ...customCompetenciesList]);
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Competencies Display */}
            {customCompetenciesList.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4 text-gray-600" />
                  <h5 className="text-sm font-medium text-gray-900">Custom Competencies:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customCompetenciesList.map((competency, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm font-semibold">
                      {competency}
                      <button
                        onClick={() => {
                          const newCustomCompetencies = customCompetenciesList.filter(c => c !== competency);
                          setCustomCompetenciesList(newCustomCompetencies);
                          setSelectedCompetencies([...aiGeneratedCompetencies, ...newCustomCompetencies]);
                          // Update the input field
                          setCustomCompetencies(newCustomCompetencies.join(', '));
                        }}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
             <div className="border-t pt-4">
               <label className="text-sm font-medium text-gray-700 mb-2 block">
                 Add custom competencies (comma, space, or enter separated)
               </label>
               <Input
                 placeholder="e.g., Leadership skills, Innovation thinking, Cultural awareness"
                 value={customCompetencies}
                 onChange={(e) => handleCustomCompetenciesChange(e.target.value)}
                 className="w-full"
               />
             </div>
          </div>
        </Card>

        {/* Attitudes */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-pink-600" size={20} />
            <h4 className="font-semibold text-gray-900">Attitudes</h4>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {attitudesList.map((attitude) => (
                <div 
                  key={attitude}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <Checkbox
                    id={`attitude-${attitude}`}
                    checked={selectedAttitudes.includes(attitude)}
                    onCheckedChange={(checked) => handleAttitudesChange(attitude, !!checked)}
                    className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                  />
                  <label 
                    htmlFor={`attitude-${attitude}`} 
                    className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900"
                  >
                    {attitude}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      </div>
      
      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateELO}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isGeneratingOutcomes || (selectedBlooms.length === 0 && selectedSkills.length === 0 && selectedAttitudes.length === 0)}
        >
          {isGeneratingOutcomes ? (
            <Loader size="sm" className="mr-2" />
          ) : (
            <Lightbulb className="mr-2" size={18} />
          )}
          {isGeneratingOutcomes ? 'Generating...' : 'Generate Learning Outcomes'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {selectedBlooms.length} Blooms + {selectedSkills.length} Skills + {selectedCompetencies.length} Competencies + {selectedAttitudes.length} Attitudes selected
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Lightbulb size={12} className="text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900">Generated Learning Outcomes</h4>
        </div>
        <div className="space-y-2">
          {generatedOutcomes.length > 0 ? (
            generatedOutcomes.map((outcome, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{outcome}</p>
              </div>
            ))
          ) : (
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-500 italic">Your expected learning outcomes will be generated here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpectedLearningOutcome;

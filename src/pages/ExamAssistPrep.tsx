import React, { useState } from 'react';
import searchPlaceholder from '@/assets/search-placeholder.png';
import { ArrowLeft, Search, Filter, Download, Sparkles, RefreshCw, FileText, BookOpen, Users, ClipboardList, GraduationCap, ChevronDown, Bookmark, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  text: string;
  type: string;
  year: string;
  chapter: string;
  class: string;
  subject: string;
  taxonomy: string;
}

interface GeneratedQuestion {
  id: string;
  text: string;
  isEditing?: boolean;
}

const ExamAssistPrep = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [repository, setRepository] = useState<Question[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [questionGenerations, setQuestionGenerations] = useState<Record<string, { similar: GeneratedQuestion[], converted: GeneratedQuestion[] }>>({});
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionTarget, setConversionTarget] = useState<{questionId: string, questionText: string} | null>(null);
  const [conversionType, setConversionType] = useState('MCQ');
  const [conversionQuantity, setConversionQuantity] = useState('1');
  const [addedToRepository, setAddedToRepository] = useState<Set<string>>(new Set());

  // Mock data
  const classes = ['10', '12'];
  const subjects = ['Science', 'Mathematics', 'English', 'Social Science'];
  const chapters = {
    'Science': ['Life Processes', 'Light - Reflection and Refraction', 'Electricity', 'Magnetic Effects of Electric Current'],
    'Mathematics': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations'],
    'English': ['First Flight', 'Footprints without Feet', 'Letter Writing', 'Grammar'],
    'Social Science': ['Resources and Development', 'Democracy and Diversity', 'Nationalism in India', 'The Rise of Nationalism in Europe']
  };
  const questionTypes = ['Knowledge', 'Understanding', 'Application'];

  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'Define photosynthesis and list the raw materials required for this process.',
      type: 'Knowledge',
      year: '2023 CBSE Board - Delhi Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Knowledge'
    },
    {
      id: '2',
      text: 'Which organelle is known as the powerhouse of the cell? (a) Nucleus (b) Mitochondria (c) Chloroplast (d) Ribosome',
      type: 'Knowledge',
      year: '2022 CBSE Board - All India Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Knowledge'
    },
    {
      id: '3',
      text: 'Name the enzyme that breaks down starch in the mouth.',
      type: 'Knowledge',
      year: '2023 CBSE Board - All India Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Knowledge'
    },
    {
      id: '4',
      text: 'Explain the process of photosynthesis in plants. How do plants convert light energy into chemical energy?',
      type: 'Understanding',
      year: '2022 CBSE Board - Foreign Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Understanding'
    },
    {
      id: '5',
      text: 'Describe the structure and function of nephrons. How do kidneys maintain water balance in the body?',
      type: 'Understanding',
      year: '2023 CBSE Board - Delhi Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Understanding'
    },
    {
      id: '6',
      text: 'Explain the mechanism of breathing in humans and the factors that affect the rate of breathing.',
      type: 'Understanding',
      year: '2022 CBSE Board - All India Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Understanding'
    },
    {
      id: '7',
      text: 'A student performed an experiment to show that CO2 is released during respiration. Analyze the experimental setup and predict what would happen if the setup was kept in darkness for 24 hours.',
      type: 'Application',
      year: '2023 CBSE Board - Sample Paper',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Application'
    },
    {
      id: '8',
      text: 'Design an experiment to demonstrate that light is essential for photosynthesis. Include all materials, procedure, and expected results.',
      type: 'Application',
      year: '2023 CBSE Board - Foreign Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Application'
    },
    {
      id: '9',
      text: 'A plant was kept in a dark room for 48 hours and then exposed to sunlight with one leaf covered with aluminum foil. Predict and explain the results when tested with iodine solution.',
      type: 'Application',
      year: '2022 CBSE Board - Delhi Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Application'
    },
    {
      id: '10',
      text: 'Compare the efficiency of aerobic and anaerobic respiration in different environmental conditions and justify which process would be more beneficial for a marathon runner.',
      type: 'Application',
      year: '2023 CBSE Board - All India Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science',
      taxonomy: 'Application'
    }
  ];

  const handleSearch = () => {
    // Implementation for search functionality
    console.log('Searching with filters:', { selectedClass, selectedSubject, selectedChapter, selectedQuestionType });
  };

  const addToRepository = (question: Question) => {
    if (!repository.find(q => q.id === question.id)) {
      setRepository([...repository, question]);
    }
  };

  const removeFromRepository = (questionId: string) => {
    setRepository(repository.filter(q => q.id !== questionId));
  };

  // Functions for managing generated questions from repository/search
  const generateSimilarFromQuestion = (questionId: string, questionText: string) => {
    const generated: GeneratedQuestion[] = [
      { id: `sim-${Date.now()}-1`, text: `Generated Question 1: ${questionText} (Modified with AI)` },
      { id: `sim-${Date.now()}-2`, text: `Generated Question 2: ${questionText} (Alternative approach)` },
      { id: `sim-${Date.now()}-3`, text: `Generated Question 3: ${questionText} (Different context)` }
    ];
    
    setQuestionGenerations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        similar: generated
      }
    }));
  };

  const openConversionModal = (questionId: string, questionText: string) => {
    setConversionTarget({ questionId, questionText });
    setShowConversionModal(true);
  };

  const handleConversion = () => {
    if (!conversionTarget) return;
    
    const quantity = parseInt(conversionQuantity);
    const converted: GeneratedQuestion[] = Array.from({ length: quantity }, (_, index) => ({
      id: `conv-${Date.now()}-${index + 1}`,
      text: `Converted Question ${index + 1} to ${conversionType}: ${conversionTarget.questionText} (Converted to ${conversionType} format)`
    }));
    
    setQuestionGenerations(prev => ({
      ...prev,
      [conversionTarget.questionId]: {
        ...prev[conversionTarget.questionId],
        converted: converted
      }
    }));
    
    setShowConversionModal(false);
    setConversionTarget(null);
  };

  // Functions for managing generated questions
  const editGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string) => {
    setQuestionGenerations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: prev[questionId]?.[type]?.map(q => 
          q.id === id ? { ...q, isEditing: true } : q
        ) || []
      }
    }));
  };

  const saveGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string, newText: string) => {
    setQuestionGenerations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: prev[questionId]?.[type]?.map(q => 
          q.id === id ? { ...q, text: newText, isEditing: false } : q
        ) || []
      }
    }));
  };

  const cancelEditGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string) => {
    setQuestionGenerations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: prev[questionId]?.[type]?.map(q => 
          q.id === id ? { ...q, isEditing: false } : q
        ) || []
      }
    }));
  };

  const deleteGeneratedQuestion = (questionId: string, type: 'similar' | 'converted', id: string) => {
    setQuestionGenerations(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: prev[questionId]?.[type]?.filter(q => q.id !== id) || []
      }
    }));
  };

  const addGeneratedToRepository = (generatedQuestion: GeneratedQuestion) => {
    const newQuestion: Question = {
      id: `repo-${Date.now()}`,
      text: generatedQuestion.text,
      type: 'Generated',
      year: 'AI Generated',
      chapter: 'AI Content',
      class: selectedClass || '10',
      subject: selectedSubject || 'General',
      taxonomy: 'Application'
    };
    
    if (!repository.find(q => q.text === newQuestion.text)) {
      setRepository([...repository, newQuestion]);
      setAddedToRepository(prev => new Set(prev).add(generatedQuestion.id));
    }
  };

  // Component for rendering generated questions inline
  const GeneratedQuestionsDisplay = ({ questionId, type }: { questionId: string, type: 'similar' | 'converted' }) => {
    const questions = questionGenerations[questionId]?.[type] || [];
    if (questions.length === 0) return null;

    return (
      <div className="mt-8 relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 to-indigo-400 rounded-full shadow-sm"></div>
        <div className="pl-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
              type === 'similar' 
                ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
                : 'bg-gradient-to-br from-indigo-500 to-blue-600'
            }`}>
              {type === 'similar' ? (
                <Sparkles className="w-5 h-5 text-white" />
              ) : (
                <RefreshCw className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {type === 'similar' ? 'Generated Similar Questions' : 'Converted Questions'}
              </h4>
              <p className="text-sm text-gray-500 mt-1">AI-powered question variations</p>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 border-0 px-3 py-1"
            >
              {questions.length} questions
            </Badge>
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card 
                key={question.id} 
                className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-full bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 p-6">
                      {question.isEditing ? (
                        <div className="space-y-4">
                          <Textarea
                            defaultValue={question.text}
                            className="w-full border-gray-200 focus:border-violet-300 focus:ring-violet-200 rounded-lg resize-none"
                            rows={4}
                            placeholder="Edit your question..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                saveGeneratedQuestion(questionId, type, question.id, e.currentTarget.value);
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                                if (textarea) {
                                  saveGeneratedQuestion(questionId, type, question.id, textarea.value);
                                }
                              }}
                              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              Save Changes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelEditGeneratedQuestion(questionId, type, question.id)}
                              className="flex items-center gap-2 hover:bg-gray-50"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-800 leading-relaxed text-base font-medium">
                            {question.text}
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editGeneratedQuestion(questionId, type, question.id)}
                                className="h-8 px-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteGeneratedQuestion(questionId, type, question.id)}
                                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant={addedToRepository.has(question.id) ? "default" : "outline"}
                              onClick={() => addGeneratedToRepository(question)}
                              disabled={addedToRepository.has(question.id)}
                              className={`flex items-center gap-2 h-8 px-4 transition-all duration-200 ${
                                addedToRepository.has(question.id) 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' 
                                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                              }`}
                            >
                              {addedToRepository.has(question.id) ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Added to Repository
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Add to Repository
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Exam Prep Assist</h1>
                  <p className="text-sm text-gray-500">Smart CBSE Question Retrieval & AI Generation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI Ready</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tool Introduction */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">CBSE Exam Assistant</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find old board questions, generate new ones with AI, and create perfect exam materials in minutes
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-4xl mx-auto bg-white border-2 border-indigo-100 shadow-lg rounded-xl p-2 h-16 gap-2">
            <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 transition-all duration-300 rounded-lg font-medium py-3 px-4 text-base">
              <Search className="w-5 h-5" />
              Question Search
            </TabsTrigger>
            <TabsTrigger value="repository" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200 transition-all duration-300 rounded-lg font-medium py-3 px-4 text-base">
              <Bookmark className="w-5 h-5" />
              My Repository
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Class</label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(cls => (
                          <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Chapter</label>
                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map(chapter => (
                          <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search questions by keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search Questions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Summary with Interactive Filters */}
            {selectedChapter && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter Questions for "{selectedChapter}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge 
                      variant={selectedFilter === 'All' ? 'default' : 'secondary'}
                      className={`px-3 py-1 cursor-pointer transition-colors hover:bg-indigo-100 ${
                        selectedFilter === 'All' ? 'bg-indigo-600 text-white' : ''
                      }`}
                      onClick={() => setSelectedFilter('All')}
                    >
                      All (10)
                    </Badge>
                    <Badge 
                      variant={selectedFilter === 'Knowledge' ? 'default' : 'secondary'}
                      className={`px-3 py-1 cursor-pointer transition-colors hover:bg-blue-100 ${
                        selectedFilter === 'Knowledge' ? 'bg-blue-600 text-white' : ''
                      }`}
                      onClick={() => setSelectedFilter('Knowledge')}
                    >
                      3 Knowledge
                    </Badge>
                    <Badge 
                      variant={selectedFilter === 'Understanding' ? 'default' : 'secondary'}
                      className={`px-3 py-1 cursor-pointer transition-colors hover:bg-green-100 ${
                        selectedFilter === 'Understanding' ? 'bg-green-600 text-white' : ''
                      }`}
                      onClick={() => setSelectedFilter('Understanding')}
                    >
                      3 Understanding
                    </Badge>
                    <Badge 
                      variant={selectedFilter === 'Application' ? 'default' : 'secondary'}
                      className={`px-3 py-1 cursor-pointer transition-colors hover:bg-purple-100 ${
                        selectedFilter === 'Application' ? 'bg-purple-600 text-white' : ''
                      }`}
                      onClick={() => setSelectedFilter('Application')}
                    >
                      4 Application
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Search Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const filteredQuestions = mockQuestions.filter(question => selectedFilter === 'All' || question.type === selectedFilter);
                      const allFiltered = filteredQuestions.every(q => selectedQuestions.includes(q.id));
                      
                      if (allFiltered) {
                        // Deselect all filtered questions
                        setSelectedQuestions(prev => prev.filter(id => !filteredQuestions.some(q => q.id === id)));
                      } else {
                        // Select all filtered questions
                        const newSelections = filteredQuestions.filter(q => !selectedQuestions.includes(q.id)).map(q => q.id);
                        setSelectedQuestions(prev => [...prev, ...newSelections]);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <input 
                      type="checkbox" 
                      checked={mockQuestions.filter(question => selectedFilter === 'All' || question.type === selectedFilter).every(q => selectedQuestions.includes(q.id))}
                      readOnly
                      className="mr-1"
                    />
                    Select All
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Selected
                  </Button>
                  <Button variant="default" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedClass || !selectedSubject || !selectedChapter ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <img 
                      src={searchPlaceholder} 
                      alt="Select dropdowns to view results" 
                      className="w-64 h-48 object-cover rounded-lg shadow-lg mb-6 opacity-80"
                    />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Search Criteria Selected</h3>
                    <p className="text-gray-500 max-w-md">
                      Please select values from the dropdowns above to display search results.
                    </p>
                  </div>
                ) : (
                  mockQuestions
                    .filter(question => selectedFilter === 'All' || question.type === selectedFilter)
                    .map((question) => (
                    <Card key={question.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white/90 backdrop-blur-sm hover:bg-white overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Left accent bar */}
                          <div className="w-1.5 bg-gradient-to-b from-indigo-500 to-purple-600 flex-shrink-0"></div>
                          
                          {/* Main content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                  <FileText className="w-7 h-7 text-white" />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0 space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-3 py-1 font-medium">{question.type}</Badge>
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">{question.year}</Badge>
                                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 px-3 py-1">{question.chapter}</Badge>
                                  <Badge className="border-purple-200 bg-purple-50 text-purple-700 font-medium px-3 py-1">{question.taxonomy}</Badge>
                                </div>
                                <p className="text-gray-800 leading-relaxed text-lg font-medium">{question.text}</p>
                                
                                {/* Action row */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => generateSimilarFromQuestion(question.id, question.text)}
                                      className="h-9 px-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                                    >
                                      <Sparkles className="w-4 h-4 mr-2" />
                                      Generate Similar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => openConversionModal(question.id, question.text)}
                                      className="h-9 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                    >
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      Convert Type
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    <Button
                                      size="sm"
                                      variant={repository.find(q => q.id === question.id) ? "default" : "outline"}
                                      onClick={() => addToRepository(question)}
                                      disabled={repository.find(q => q.id === question.id) !== undefined}
                                      className={`h-9 px-4 transition-all duration-200 ${
                                        repository.find(q => q.id === question.id) 
                                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' 
                                          : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                                      }`}
                                    >
                                      {repository.find(q => q.id === question.id) ? (
                                        <>
                                          <Check className="w-4 h-4 mr-2" />
                                          Added to Repository
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="w-4 h-4 mr-2" />
                                          Add to Repository
                                        </>
                                      )}
                                    </Button>
                                    
                                    <div className="flex items-center">
                                      <input 
                                        type="checkbox" 
                                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedQuestions([...selectedQuestions, question.id]);
                                          } else {
                                            setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                       
                        {/* Display Generated Questions Inline */}
                        <GeneratedQuestionsDisplay questionId={question.id} type="similar" />
                        <GeneratedQuestionsDisplay questionId={question.id} type="converted" />
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repository Tab */}
          <TabsContent value="repository" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5" />
                    My Question Repository
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Save and organize your favorite questions for future use
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {repository.length} Questions Saved
                  </Badge>
                  {repository.length > 0 && (
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Repository
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {repository.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Saved Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Add questions from the search results to build your personal repository
                    </p>
                    <Button 
                      onClick={() => setActiveTab('search')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Browse Questions
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Summary Widget */}
                    <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              Repository Summary
                            </h3>
                            <p className="text-lg font-semibold text-emerald-700">
                              Total: {repository.length} Questions
                            </p>
                          </div>
                          
                          <div className="border-t border-emerald-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Taxonomy Distribution:
                            </h4>
                            <div className="text-sm text-gray-600 bg-white/50 rounded-lg py-2 px-4 inline-block">
                              {(() => {
                                const taxonomyCounts = repository.reduce((acc, question) => {
                                  acc[question.taxonomy] = (acc[question.taxonomy] || 0) + 1;
                                  return acc;
                                }, {} as Record<string, number>);
                                
                                const taxonomyBreakdown = Object.entries(taxonomyCounts)
                                  .map(([type, count]) => `${type} (${count})`)
                                  .join(' | ');
                                
                                return taxonomyBreakdown || 'No taxonomy data available';
                              })()}
                            </div>
                          </div>
                         </div>
                       </CardContent>
                     </Card>
                     
                     {/* Questions List */}
                     <div className="space-y-4">
                    {repository.map((question) => (
                      <Card key={question.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white/90 backdrop-blur-sm hover:bg-white overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Left accent bar */}
                            <div className="w-1.5 bg-gradient-to-b from-emerald-500 to-teal-600 flex-shrink-0"></div>
                            
                            {/* Main content */}
                            <div className="flex-1 p-6">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                    <Bookmark className="w-7 h-7 text-white" />
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0 space-y-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-3 py-1 font-medium">{question.type}</Badge>
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">{question.year}</Badge>
                                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 px-3 py-1">{question.chapter}</Badge>
                                    <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 px-3 py-1">{question.subject} - Class {question.class}</Badge>
                                    <Badge className="border-purple-200 bg-purple-50 text-purple-700 font-medium px-3 py-1">{question.taxonomy}</Badge>
                                  </div>
                                  <p className="text-gray-800 leading-relaxed text-lg font-medium">{question.text}</p>
                                  
                                  {/* Action row */}
                                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => generateSimilarFromQuestion(question.id, question.text)}
                                        className="h-9 px-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                                      >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Similar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => openConversionModal(question.id, question.text)}
                                        className="h-9 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                      >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Convert Type
                                      </Button>
                                    </div>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeFromRepository(question.id)}
                                      className="h-9 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove from Repository
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                         
                         {/* Display Generated Questions Inline */}
                         <GeneratedQuestionsDisplay questionId={question.id} type="similar" />
                         <GeneratedQuestionsDisplay questionId={question.id} type="converted" />
                       </Card>
                    ))}
                   </div>
                   </>
                )}
              </CardContent>
            </Card>

            {/* Repository Statistics */}
            {repository.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Repository Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {repository.filter(q => q.type === 'Knowledge').length}
                      </div>
                      <div className="text-sm text-gray-600">Knowledge Questions</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {repository.filter(q => q.type === 'Understanding').length}
                      </div>
                      <div className="text-sm text-gray-600">Understanding Questions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {repository.filter(q => q.type === 'Application').length}
                      </div>
                      <div className="text-sm text-gray-600">Application Questions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Conversion Modal */}
      <Dialog open={showConversionModal} onOpenChange={setShowConversionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Convert Question Type
            </DialogTitle>
            <DialogDescription>
              Choose the target question type and specify how many variations you'd like to generate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="conversion-type">Convert to Question Type</Label>
              <Select value={conversionType} onValueChange={setConversionType}>
                <SelectTrigger id="conversion-type">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">Multiple Choice Question (MCQ)</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                  <SelectItem value="Long Answer">Long Answer</SelectItem>
                  <SelectItem value="Assertion-Reason">Assertion-Reason</SelectItem>
                  <SelectItem value="Case Study">Case Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conversion-quantity">Number of Questions</Label>
              <Select value={conversionQuantity} onValueChange={setConversionQuantity}>
                <SelectTrigger id="conversion-quantity">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Question</SelectItem>
                  <SelectItem value="2">2 Questions</SelectItem>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="4">4 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConversionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConversion} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Convert Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamAssistPrep;
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
  const [similarQuestions, setSimilarQuestions] = useState<GeneratedQuestion[]>([]);
  const [convertedQuestions, setConvertedQuestions] = useState<GeneratedQuestion[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [convertInputQuestion, setConvertInputQuestion] = useState('');
  const [targetType, setTargetType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [convertQuantity, setConvertQuantity] = useState('1');
  const [repository, setRepository] = useState<Question[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

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

  const generateSimilarQuestions = () => {
    if (!inputQuestion.trim()) return;
    
    const generated: GeneratedQuestion[] = [
      { id: `sim-${Date.now()}-1`, text: `Generated Question 1: ${inputQuestion} (Modified with AI)` },
      { id: `sim-${Date.now()}-2`, text: `Generated Question 2: ${inputQuestion} (Alternative approach)` },
      { id: `sim-${Date.now()}-3`, text: `Generated Question 3: ${inputQuestion} (Different context)` }
    ];
    setSimilarQuestions(generated);
  };

  const convertQuestionType = () => {
    if (!convertInputQuestion.trim() || !targetType) return;
    
    const quantity = parseInt(convertQuantity) || 1;
    const converted: GeneratedQuestion[] = Array.from({ length: quantity }, (_, i) => ({
      id: `conv-${Date.now()}-${i}`,
      text: `Converted Question ${i + 1} to ${targetType}: ${convertInputQuestion} (Converted format)`
    }));
    setConvertedQuestions(converted);
    
    // Scroll to converted questions section after a brief delay
    setTimeout(() => {
      const convertedSection = document.querySelector('[data-section="converted-questions"]');
      if (convertedSection) {
        convertedSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const addToRepository = (question: Question) => {
    if (!repository.find(q => q.id === question.id)) {
      setRepository([...repository, question]);
    }
  };

  const removeFromRepository = (questionId: string) => {
    setRepository(repository.filter(q => q.id !== questionId));
  };

  // Functions for managing generated questions
  const editGeneratedQuestion = (type: 'similar' | 'converted', id: string) => {
    if (type === 'similar') {
      setSimilarQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, isEditing: true } : q
      ));
    } else {
      setConvertedQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, isEditing: true } : q
      ));
    }
  };

  const saveGeneratedQuestion = (type: 'similar' | 'converted', id: string, newText: string) => {
    if (type === 'similar') {
      setSimilarQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, text: newText, isEditing: false } : q
      ));
    } else {
      setConvertedQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, text: newText, isEditing: false } : q
      ));
    }
  };

  const cancelEditGeneratedQuestion = (type: 'similar' | 'converted', id: string) => {
    if (type === 'similar') {
      setSimilarQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, isEditing: false } : q
      ));
    } else {
      setConvertedQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, isEditing: false } : q
      ));
    }
  };

  const deleteGeneratedQuestion = (type: 'similar' | 'converted', id: string) => {
    if (type === 'similar') {
      setSimilarQuestions(prev => prev.filter(q => q.id !== id));
    } else {
      setConvertedQuestions(prev => prev.filter(q => q.id !== id));
    }
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
    }
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
          <TabsList className="grid w-full grid-cols-3 max-w-4xl mx-auto bg-white border-2 border-indigo-100 shadow-lg rounded-xl p-2 h-16 gap-2">
            <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 transition-all duration-300 rounded-lg font-medium py-3 px-4 text-base">
              <Search className="w-5 h-5" />
              Question Search
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-200 transition-all duration-300 rounded-lg font-medium py-3 px-4 text-base">
              <Sparkles className="w-5 h-5" />
              AI Generate
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
                    <div key={question.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2 mb-2">
                             <Badge variant="outline">{question.type}</Badge>
                             <Badge variant="secondary">{question.year}</Badge>
                             <Badge variant="outline">{question.chapter}</Badge>
                             <Badge className="border border-purple-500 bg-transparent text-purple-600 text-xs px-2 py-1">{question.taxonomy}</Badge>
                           </div>
                          <p className="text-gray-800 leading-relaxed">{question.text}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToRepository(question)}
                            disabled={repository.find(q => q.id === question.id) !== undefined}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            {repository.find(q => q.id === question.id) ? 'Added' : 'Add to Repository'}
                          </Button>
                          <input 
                            type="checkbox" 
                            className="mt-1"
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
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generate Similar Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Similar Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste a question here to generate similar ones..."
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    rows={4}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="knowledge">Knowledge</SelectItem>
                        <SelectItem value="understanding">Understanding</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={generateSimilarQuestions} className="bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Convert Question Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Convert Question Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste a question to convert its format..."
                    value={convertInputQuestion}
                    onChange={(e) => setConvertInputQuestion(e.target.value)}
                    rows={4}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Select value={targetType} onValueChange={setTargetType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Convert to" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={convertQuantity}
                        onChange={(e) => setConvertQuantity(e.target.value)}
                        className="border-0 rounded-none w-1/2 text-center focus-visible:ring-0"
                      />
                      <div className="w-1/2 bg-gray-50 border-l px-3 py-2 text-sm text-gray-600 flex items-center justify-center">
                        Quantity
                      </div>
                    </div>
                    <Button onClick={convertQuestionType} className="bg-green-600 hover:bg-green-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Convert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Similar Questions Results */}
            {similarQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Generated Similar Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {similarQuestions.map((question) => (
                     <div key={question.id} className="p-4 border rounded-lg bg-purple-50">
                       <div className="flex items-start justify-between">
                         <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2 mb-2">
                             <Badge variant="outline">AI Generated</Badge>
                             <Badge variant="secondary">Similar Question</Badge>
                              <Badge className="border border-purple-500 bg-transparent text-purple-600 text-xs px-2 py-1">Application</Badge>
                           </div>
                           {question.isEditing ? (
                             <Textarea
                               value={question.text}
                               onChange={(e) => {
                                 setSimilarQuestions(prev => prev.map(q => 
                                   q.id === question.id ? { ...q, text: e.target.value } : q
                                 ));
                               }}
                               rows={3}
                               className="text-gray-800"
                             />
                           ) : (
                             <p className="text-gray-800">{question.text}</p>
                           )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {question.isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => saveGeneratedQuestion('similar', question.id, question.text)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelEditGeneratedQuestion('similar', question.id)}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editGeneratedQuestion('similar', question.id)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addGeneratedToRepository(question)}
                                className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                              >
                                <Plus className="w-4 h-4" />
                                Add to Repository
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteGeneratedQuestion('similar', question.id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Similar Questions
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Converted Questions Results */}
            {convertedQuestions.length > 0 && (
              <Card data-section="converted-questions">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-green-600" />
                    Converted Questions
                  </CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                   {convertedQuestions.map((question) => (
                     <div key={question.id} className="p-4 border rounded-lg bg-green-50">
                       <div className="flex items-start justify-between">
                         <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2 mb-2">
                             <Badge variant="outline">AI Generated</Badge>
                             <Badge variant="secondary">Converted Question</Badge>
                             <Badge className="border border-purple-500 bg-transparent text-purple-600 text-xs px-2 py-1">Application</Badge>
                           </div>
                           {question.isEditing ? (
                             <Textarea
                               value={question.text}
                               onChange={(e) => {
                                 setConvertedQuestions(prev => prev.map(q => 
                                   q.id === question.id ? { ...q, text: e.target.value } : q
                                 ));
                               }}
                               rows={3}
                               className="text-gray-800"
                             />
                           ) : (
                             <p className="text-gray-800">{question.text}</p>
                           )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {question.isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => saveGeneratedQuestion('converted', question.id, question.text)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelEditGeneratedQuestion('converted', question.id)}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editGeneratedQuestion('converted', question.id)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addGeneratedToRepository(question)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-700"
                              >
                                <Plus className="w-4 h-4" />
                                Add to Repository
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteGeneratedQuestion('converted', question.id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Converted Questions
                  </Button>
                </CardContent>
              </Card>
            )}
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
                      <div key={question.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                             <div className="flex items-center gap-2 mb-2">
                               <Badge variant="outline">{question.type}</Badge>
                               <Badge variant="secondary">{question.year}</Badge>
                               <Badge variant="outline">{question.chapter}</Badge>
                               <Badge variant="outline">{question.subject} - Class {question.class}</Badge>
                               <Badge className="border border-purple-500 bg-transparent text-purple-600 text-xs px-2 py-1">{question.taxonomy}</Badge>
                             </div>
                            <p className="text-gray-800 leading-relaxed">{question.text}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromRepository(question.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
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
    </div>
  );
};

export default ExamAssistPrep;
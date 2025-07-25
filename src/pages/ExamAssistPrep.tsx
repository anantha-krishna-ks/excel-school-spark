import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Download, Sparkles, RefreshCw, FileText, BookOpen, Users, ClipboardList, GraduationCap, ChevronDown, Bookmark, Plus, Trash2 } from 'lucide-react';
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
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const [convertedQuestions, setConvertedQuestions] = useState<string[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [targetType, setTargetType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [convertQuantity, setConvertQuantity] = useState('1');
  const [repository, setRepository] = useState<Question[]>([]);

  // Mock data
  const classes = ['10', '12'];
  const subjects = ['Science', 'Mathematics', 'English', 'Social Science'];
  const chapters = {
    'Science': ['Life Processes', 'Light - Reflection and Refraction', 'Electricity', 'Magnetic Effects of Electric Current'],
    'Mathematics': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations'],
    'English': ['First Flight', 'Footprints without Feet', 'Letter Writing', 'Grammar'],
    'Social Science': ['Resources and Development', 'Democracy and Diversity', 'Nationalism in India', 'The Rise of Nationalism in Europe']
  };
  const questionTypes = ['MCQ', 'Short Answer', 'Long Answer', 'Assertion-Reason', 'Case Study'];

  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'Explain the process of photosynthesis in plants. How do plants convert light energy into chemical energy?',
      type: 'Long Answer',
      year: '2023 CBSE Board - Delhi Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science'
    },
    {
      id: '2',
      text: 'Which of the following is the correct sequence of events in photosynthesis? (a) Light absorption → Water splitting → CO2 fixation → Glucose formation',
      type: 'MCQ',
      year: '2022 CBSE Board - All India Set',
      chapter: 'Life Processes',
      class: '10',
      subject: 'Science'
    }
  ];

  const handleSearch = () => {
    // Implementation for search functionality
    console.log('Searching with filters:', { selectedClass, selectedSubject, selectedChapter, selectedQuestionType });
  };

  const generateSimilarQuestions = () => {
    if (!inputQuestion.trim()) return;
    
    const generated = [
      `Generated Question 1: ${inputQuestion} (Modified with AI)`,
      `Generated Question 2: ${inputQuestion} (Alternative approach)`,
      `Generated Question 3: ${inputQuestion} (Different context)`
    ];
    setSimilarQuestions(generated);
  };

  const convertQuestionType = () => {
    if (!inputQuestion.trim() || !targetType) return;
    
    const quantity = parseInt(convertQuantity) || 1;
    const converted = Array.from({ length: quantity }, (_, i) => 
      `Converted Question ${i + 1} to ${targetType}: ${inputQuestion} (Converted format)`
    );
    setConvertedQuestions(converted);
  };

  const addToRepository = (question: Question) => {
    if (!repository.find(q => q.id === question.id)) {
      setRepository([...repository, question]);
    }
  };

  const removeFromRepository = (questionId: string) => {
    setRepository(repository.filter(q => q.id !== questionId));
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
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Question Search
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Question Type</label>
                    <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
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

            {/* Chapter Summary */}
            {selectedChapter && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Questions for "{selectedChapter}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="px-3 py-1">3 MCQs</Badge>
                    <Badge variant="secondary" className="px-3 py-1">2 Short Answers</Badge>
                    <Badge variant="secondary" className="px-3 py-1">1 Case Study</Badge>
                    <Badge variant="secondary" className="px-3 py-1">4 Long Answers</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Search Results</CardTitle>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Selected
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockQuestions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{question.type}</Badge>
                          <Badge variant="secondary">{question.year}</Badge>
                          <Badge variant="outline">{question.chapter}</Badge>
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
                ))}
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
                        <SelectItem value="easy">Easy (Recall)</SelectItem>
                        <SelectItem value="medium">Medium (Application)</SelectItem>
                        <SelectItem value="hard">Hard (Analysis)</SelectItem>
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
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
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
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={convertQuantity}
                      onChange={(e) => setConvertQuantity(e.target.value)}
                      placeholder="Quantity"
                    />
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
                  {similarQuestions.map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-purple-50">
                      <p className="text-gray-800">{question}</p>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-green-600" />
                    Converted Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {convertedQuestions.map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-green-50">
                      <p className="text-gray-800">{question}</p>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {repository.filter(q => q.type === 'MCQ').length}
                      </div>
                      <div className="text-sm text-gray-600">MCQ Questions</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {repository.filter(q => q.type === 'Short Answer').length}
                      </div>
                      <div className="text-sm text-gray-600">Short Answer</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {repository.filter(q => q.type === 'Long Answer').length}
                      </div>
                      <div className="text-sm text-gray-600">Long Answer</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {repository.filter(q => q.type === 'Case Study').length}
                      </div>
                      <div className="text-sm text-gray-600">Case Study</div>
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
import React, { useState, useEffect } from 'react';
import searchPlaceholder from '@/assets/search-placeholder.png';
import { ArrowLeft, Search, Filter, Download, Sparkles, RefreshCw, FileText, BookOpen, Users, ClipboardList, GraduationCap, ChevronDown, Bookmark, Plus, Trash2, Edit, Check, X, Calendar, Hash, ArrowRight, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

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
  questionType?: string;
}

interface QuestionBundle {
  id: string;
  name: string;
  questions: Question[];
  createdAt: Date;
  lastEditOn: Date;
}

const ExamAssistPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>(['All']);
  const [selectedYears, setSelectedYears] = useState<string[]>(['All']);
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [repository, setRepository] = useState<Question[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string[]>(['All']);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(['All']);
  const [questionGenerations, setQuestionGenerations] = useState<Record<string, { similar: GeneratedQuestion[], converted: GeneratedQuestion[] }>>({});
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionTarget, setConversionTarget] = useState<{questionId: string, questionText: string} | null>(null);
  const [conversionType, setConversionType] = useState('MCQ');
  const [conversionQuantity, setConversionQuantity] = useState('1');
  const [addedToRepository, setAddedToRepository] = useState<Set<string>>(new Set());
  const [questionBundles, setQuestionBundles] = useState<QuestionBundle[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [bundleName, setBundleName] = useState('');
  const [showCreateBundleModal, setShowCreateBundleModal] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#taxonomy-dropdown') && !target.closest('[data-dropdown="taxonomy"]')) {
        document.getElementById('taxonomy-dropdown')?.classList.add('hidden');
      }
      if (!target.closest('#question-type-dropdown') && !target.closest('[data-dropdown="question-type"]')) {
        document.getElementById('question-type-dropdown')?.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data
  const classes = ['10', '12'];
  const subjects = ['Science', 'Mathematics', 'English', 'Social Science'];
  const years = ['All Years', '2025', '2024', '2023', '2022', '2021', '2020'];
  const chapters = {
    'Science': ['Life Processes', 'Light - Reflection and Refraction', 'Electricity', 'Magnetic Effects of Electric Current'],
    'Mathematics': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations'],
    'English': ['First Flight', 'Footprints without Feet', 'Letter Writing', 'Grammar'],
    'Social Science': ['Resources and Development', 'Democracy and Diversity', 'Nationalism in India', 'The Rise of Nationalism in Europe']
  };
  const questionTypes = ['Knowledge', 'Understanding', 'Application'];

  // Helper function to detect question type based on text
  const detectQuestionType = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // MCQ detection
    if (lowerText.includes('(a)') && lowerText.includes('(b)') && lowerText.includes('(c)')) {
      return 'MCQ';
    }
    
    // Short Answer detection (typically shorter questions)
    if (text.length < 100 && (lowerText.includes('define') || lowerText.includes('name') || lowerText.includes('what is') || lowerText.includes('list'))) {
      return 'Short Answer';
    }
    
    // Long Answer detection (typically longer questions with explanations)
    if (text.length > 200 || lowerText.includes('explain') || lowerText.includes('describe') || lowerText.includes('analyze') || lowerText.includes('design an experiment')) {
      return 'Long Answer';
    }
    
    // Assertion-Reason detection
    if (lowerText.includes('assertion') && lowerText.includes('reason')) {
      return 'Assertion-Reason';
    }
    
    // Case Study detection
    if (lowerText.includes('case study') || lowerText.includes('scenario') || (text.length > 300 && lowerText.includes('situation'))) {
      return 'Case Study';
    }
    
    // Default fallback
    return 'Short Answer';
  };

  // Helper function to get question type badge color
  const getQuestionTypeBadgeStyle = (questionType: string) => {
    switch (questionType) {
      case 'MCQ':
        return 'border-blue-300 text-blue-800 bg-blue-100';
      case 'Short Answer':
        return 'border-green-300 text-green-800 bg-green-100';
      case 'Long Answer':
        return 'border-purple-300 text-purple-800 bg-purple-100';
      case 'Assertion-Reason':
        return 'border-orange-300 text-orange-800 bg-orange-100';
      case 'Case Study':
        return 'border-red-300 text-red-800 bg-red-100';
      default:
        return 'border-gray-300 text-gray-800 bg-gray-100';
    }
  };

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
    const filteredQuestions = getFilteredQuestions();
    console.log('Searching with filters:', { 
      selectedClass, 
      selectedSubject, 
      selectedChapters, 
      selectedYears,
      selectedFilter,
      selectedQuestionTypes,
      searchQuery,
      resultCount: filteredQuestions.length
    });
  };

  const addToQuestions = (question: Question) => {
    if (!repository.find(q => q.id === question.id)) {
      setRepository([...repository, question]);
    }
  };

  const removeFromQuestions = (questionId: string) => {
    setRepository(repository.filter(q => q.id !== questionId));
  };

  // Functions for managing generated questions from repository/search
  const generateSimilarFromQuestion = (questionId: string, questionText: string) => {
    const generated: GeneratedQuestion[] = [
      { id: `sim-${Date.now()}-1`, text: `Generated Question 1: ${questionText} (Modified with AI)`, questionType: detectQuestionType(questionText) },
      { id: `sim-${Date.now()}-2`, text: `Generated Question 2: ${questionText} (Alternative approach)`, questionType: detectQuestionType(questionText) },
      { id: `sim-${Date.now()}-3`, text: `Generated Question 3: ${questionText} (Different context)`, questionType: detectQuestionType(questionText) }
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
      text: `Converted Question ${index + 1} to ${conversionType}: ${conversionTarget.questionText} (Converted to ${conversionType} format)`,
      questionType: conversionType
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

  // Bundle management functions
  const handleCreateBundle = () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select questions to create a bundle.",
        variant: "destructive"
      });
      return;
    }
    setShowCreateBundleModal(true);
  };

  const handleExportQuestions = () => {
    // This function is for the new Export button functionality
    // Implementation will be defined separately as per the user's note
    toast({
      title: "Export Feature",
      description: "Export functionality will be implemented separately.",
    });
  };

  const handleSaveBundle = () => {
    if (!bundleName.trim()) {
      toast({
        title: "Bundle Name Required",
        description: "Please enter a name for your question bundle.",
        variant: "destructive"
      });
      return;
    }

    // Get selected questions from the filtered questions
    const filteredQuestions = getFilteredQuestions();
    const selectedQuestionsData = filteredQuestions.filter(q => selectedQuestions.includes(q.id));

    if (selectedQuestionsData.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select questions to create a bundle.",
        variant: "destructive"
      });
      return;
    }

    const newBundle: QuestionBundle = {
      id: `bundle-${Date.now()}`,
      name: bundleName.trim(),
      questions: selectedQuestionsData,
      createdAt: new Date(),
      lastEditOn: new Date()
    };

    setQuestionBundles([...questionBundles, newBundle]);
    setBundleName('');
    setShowCreateBundleModal(false);
    setSelectedQuestions([]); // Clear selection after creating bundle
    
    toast({
      title: "Bundle Created",
      description: `Question bundle "${newBundle.name}" has been created successfully.`,
    });
  };

  const deleteBundle = (bundleId: string) => {
    setQuestionBundles(questionBundles.filter(bundle => bundle.id !== bundleId));
    toast({
      title: "Bundle Deleted",
      description: "Question bundle has been deleted successfully.",
    });
  };

  const exportBundle = (bundle: QuestionBundle) => {
    // Implement export functionality here
    toast({
      title: "Export Started",
      description: `Exporting "${bundle.name}" bundle...`,
    });
  };

  const previewBundle = (bundle: QuestionBundle) => {
    navigate(`/question-bundle/${bundle.id}`, { state: { bundle } });
  };

  // Helper function to get filtered questions based on all criteria
  const getFilteredQuestions = () => {
    const hasClassFilter = selectedClass && selectedClass !== '';
    const hasSubjectFilter = selectedSubject && selectedSubject !== '';
    const hasYearFilter = selectedYears.length > 0 && !selectedYears.includes('All Years');
    const hasChapterFilter = selectedChapters.length > 0 && !selectedChapters.includes('All');
    
    return mockQuestions.filter(question => {
      // Class filter
      const classMatch = !hasClassFilter || question.class === selectedClass;
      
      // Subject filter
      const subjectMatch = !hasSubjectFilter || question.subject === selectedSubject;
      
      // Year filter - extract year from question.year string
      const yearMatch = !hasYearFilter || selectedYears.some(year => question.year.includes(year));
      
      // Chapter filter
      const chapterMatch = !hasChapterFilter || selectedChapters.includes(question.chapter);
      
      // Advanced filters (taxonomy and question type)
      const taxonomyMatch = selectedFilter.includes('All') || selectedFilter.includes(question.type);
      const questionTypeMatch = selectedQuestionTypes.includes('All') || selectedQuestionTypes.includes(detectQuestionType(question.text));
      
      // Search query filter
      const searchMatch = !searchQuery || question.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      return classMatch && subjectMatch && yearMatch && chapterMatch && taxonomyMatch && questionTypeMatch && searchMatch;
    });
  };

  // Component for rendering generated questions inline
  const GeneratedQuestionsDisplay = ({ questionId, type }: { questionId: string, type: 'similar' | 'converted' }) => {
    const questions = questionGenerations[questionId]?.[type] || [];
    if (questions.length === 0) return null;

    return (
      <div className="mt-6 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 to-blue-200 rounded-full"></div>
        <div className="pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'similar' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'} shadow-lg`}>
              {type === 'similar' ? (
                <Sparkles className="w-4 h-4 text-white" />
              ) : (
                <RefreshCw className="w-4 h-4 text-white" />
              )}
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              {type === 'similar' ? 'Generated Similar Questions' : 'Converted Questions'}
            </h4>
            <Badge variant="secondary" className="ml-auto">
              {questions.length} questions
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                     <div className="flex-1 min-w-0">
                       {question.isEditing ? (
                         <div className="space-y-3">
                           <Textarea
                             defaultValue={question.text}
                             className="w-full border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
                             rows={3}
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
                               className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                             >
                               <Check className="w-4 h-4" />
                               Save
                             </Button>
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => cancelEditGeneratedQuestion(questionId, type, question.id)}
                               className="flex items-center gap-2"
                             >
                               <X className="w-4 h-4" />
                               Cancel
                             </Button>
                           </div>
                         </div>
                       ) : (
                         <div className="space-y-3">
                           <div className="flex flex-wrap items-center gap-2 mb-2">
                             <Badge variant="outline" className={getQuestionTypeBadgeStyle(question.questionType || detectQuestionType(question.text))}>
                               {question.questionType || detectQuestionType(question.text)}
                             </Badge>
                           </div>
                           <p className="text-gray-700 leading-relaxed text-base">{question.text}</p>
                         </div>
                       )}
                    </div>
                     {!question.isEditing && (
                       <div className="flex items-center gap-2">
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => editGeneratedQuestion(questionId, type, question.id)}
                           className="p-2 hover:bg-gray-100 transition-colors"
                           title="Edit question"
                         >
                           <Edit className="w-4 h-4 text-gray-600" />
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => deleteGeneratedQuestion(questionId, type, question.id)}
                           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors"
                           title="Delete question"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                         
                         {repository.find(q => q.text === question.text) && (
                           <div title="Saved to My Questions" className="flex items-center">
                             <Bookmark className="w-4 h-4 text-blue-600 fill-blue-600" />
                           </div>
                         )}
                         
                         <input 
                           type="checkbox" 
                           className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                           onChange={(e) => {
                             if (e.target.checked) {
                               setSelectedQuestions([...selectedQuestions, question.id]);
                             } else {
                               setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                             }
                           }}
                           checked={selectedQuestions.includes(question.id)}
                         />
                       </div>
                     )}
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
              My Questions
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                        >
                          <span className="truncate">
                            {selectedYears.length === 1 && selectedYears[0] === 'All Years' 
                              ? 'All Years' 
                              : selectedYears.length === 1 
                                ? selectedYears[0]
                                : `${selectedYears.filter(y => y !== 'All Years').length} selected`}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <div className="p-2 space-y-2">
                          {years.map((year) => (
                            <div key={year} className="flex items-center space-x-2">
                              <Checkbox
                                id={`year-${year}`}
                                checked={selectedYears.includes(year)}
                                onCheckedChange={(checked) => {
                                  if (year === 'All Years') {
                                    setSelectedYears(checked ? ['All Years'] : []);
                                  } else {
                                    if (checked) {
                                      setSelectedYears(prev => 
                                        prev.includes('All Years') 
                                          ? [year] 
                                          : [...prev.filter(y => y !== 'All Years'), year]
                                      );
                                    } else {
                                      setSelectedYears(prev => prev.filter(y => y !== year));
                                    }
                                  }
                                }}
                              />
                              <label
                                htmlFor={`year-${year}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {year}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Chapter</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                          disabled={!selectedSubject}
                        >
                          <span className="truncate">
                            {selectedChapters.length === 1 && selectedChapters[0] === 'All' 
                              ? 'All Chapters' 
                              : selectedChapters.length === 1 
                                ? selectedChapters[0]
                                : `${selectedChapters.filter(c => c !== 'All').length} selected`}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <div className="p-2 space-y-2">
                          {selectedSubject && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="chapter-all"
                                  checked={selectedChapters.includes('All')}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedChapters(['All']);
                                    } else {
                                      setSelectedChapters([]);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="chapter-all"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  All Chapters
                                </label>
                              </div>
                              {chapters[selectedSubject as keyof typeof chapters]?.map(chapter => (
                                <div key={chapter} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`chapter-${chapter}`}
                                    checked={selectedChapters.includes(chapter)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedChapters(prev => 
                                          prev.includes('All') 
                                            ? [chapter] 
                                            : [...prev.filter(c => c !== 'All'), chapter]
                                        );
                                      } else {
                                        setSelectedChapters(prev => prev.filter(c => c !== chapter));
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`chapter-${chapter}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {chapter}
                                  </label>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
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

            {/* Advanced Filters - Always Visible */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {/* Taxonomy Filter Dropdown */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Taxonomy Level</label>
                    <div className="relative inline-block text-left">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 min-w-[200px] justify-between bg-white border-2 border-gray-200 hover:border-indigo-300"
                        data-dropdown="taxonomy"
                        onClick={() => {
                          const dropdown = document.getElementById('taxonomy-dropdown');
                          dropdown?.classList.toggle('hidden');
                        }}
                      >
                        <span className="text-sm">
                          {selectedFilter.includes('All') ? 'All Taxonomy' : 
                           selectedFilter.length === 1 ? selectedFilter[0] : 
                           `${selectedFilter.length} selected`}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <div
                        id="taxonomy-dropdown"
                        className="hidden absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                      >
                        <div className="py-2">
                          {['All', 'Knowledge', 'Understanding', 'Application'].map((option) => (
                            <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFilter.includes(option) || (option === 'All' && selectedFilter.includes('All'))}
                                onChange={(e) => {
                                  if (option === 'All') {
                                    setSelectedFilter(e.target.checked ? ['All'] : []);
                                  } else {
                                    const newFilter = selectedFilter.filter(f => f !== 'All');
                                    if (e.target.checked) {
                                      const updated = [...newFilter, option];
                                      setSelectedFilter(updated.length === 3 ? ['All'] : updated);
                                    } else {
                                      setSelectedFilter(newFilter.filter(f => f !== option));
                                    }
                                  }
                                }}
                                className="mr-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                ({option === 'All' ? '10' : option === 'Knowledge' ? '3' : option === 'Understanding' ? '3' : '4'})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Type Filter Dropdown */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Question Type</label>
                    <div className="relative inline-block text-left">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 min-w-[200px] justify-between bg-white border-2 border-gray-200 hover:border-purple-300"
                        data-dropdown="question-type"
                        onClick={() => {
                          const dropdown = document.getElementById('question-type-dropdown');
                          dropdown?.classList.toggle('hidden');
                        }}
                      >
                        <span className="text-sm">
                          {selectedQuestionTypes.includes('All') ? 'All Types' : 
                           selectedQuestionTypes.length === 1 ? selectedQuestionTypes[0] : 
                           `${selectedQuestionTypes.length} selected`}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <div
                        id="question-type-dropdown"
                        className="hidden absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                      >
                        <div className="py-2">
                          {['All', 'MCQ', 'Short Answer', 'Long Answer', 'Assertion-Reason', 'Case Study'].map((option) => (
                            <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedQuestionTypes.includes(option) || (option === 'All' && selectedQuestionTypes.includes('All'))}
                                onChange={(e) => {
                                  if (option === 'All') {
                                    setSelectedQuestionTypes(e.target.checked ? ['All'] : []);
                                  } else {
                                    const newFilter = selectedQuestionTypes.filter(f => f !== 'All');
                                    if (e.target.checked) {
                                      const updated = [...newFilter, option];
                                      setSelectedQuestionTypes(updated.length === 5 ? ['All'] : updated);
                                    } else {
                                      setSelectedQuestionTypes(newFilter.filter(f => f !== option));
                                    }
                                  }
                                }}
                                className="mr-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chapter-specific summary */}
            {selectedChapter && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Results for "{selectedChapter}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    Showing filtered results from {selectedChapter} chapter
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
                      const filteredQuestions = getFilteredQuestions();
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
                      checked={(() => {
                        const filteredQuestions = getFilteredQuestions();
                        return filteredQuestions.length > 0 && filteredQuestions.every(q => selectedQuestions.includes(q.id));
                      })()}
                      readOnly
                      className="mr-1"
                    />
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportQuestions}
                    className="flex items-center gap-2"
                    disabled={selectedQuestions.length === 0}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleCreateBundle}
                    className="flex items-center gap-2"
                    disabled={selectedQuestions.length === 0}
                  >
                    <Plus className="w-4 h-4" />
                    +ADD TO MY QUESTIONS
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const hasClassFilter = selectedClass && selectedClass !== '';
                  const hasSubjectFilter = selectedSubject && selectedSubject !== '';
                  const hasYearFilter = selectedYears.length > 0 && !selectedYears.includes('All Years');
                  const hasChapterFilter = selectedChapters.length > 0 && !selectedChapters.includes('All');
                  
                  // Show "No Search Criteria Selected" if no primary filters are applied
                  if (!hasClassFilter && !hasSubjectFilter && !hasYearFilter && !hasChapterFilter) {
                    return (
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
                    );
                  }
                  
                  // Get filtered questions using the helper function
                  const filteredQuestions = getFilteredQuestions();
                  
                  return filteredQuestions.map((question) => (
                    <Card key={question.id} className="group hover:border-gray-300 transition-all duration-300 border border-gray-200 bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                          </div>
                          
                           <div className="flex-1 min-w-0 space-y-3">
                             <div className="flex flex-wrap items-center gap-2">
                               <Badge variant="outline" className={getQuestionTypeBadgeStyle(detectQuestionType(question.text))}>
                                 {detectQuestionType(question.text)}
                               </Badge>
                               <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">{question.type}</Badge>
                               <Badge variant="secondary" className="bg-gray-100 text-gray-700">{question.year}</Badge>
                               <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">{question.chapter}</Badge>
                             </div>
                             <p className="text-gray-800 leading-relaxed text-base font-medium">{question.text}</p>
                           </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white/80">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => generateSimilarFromQuestion(question.id, question.text)}
                                className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 transition-colors"
                                title="Generate Similar Questions"
                              >
                                <Sparkles className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openConversionModal(question.id, question.text)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                                title="Convert Question Type"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </div>
                            
                             
                             {repository.find(q => q.id === question.id) && (
                               <div title="Saved to My Questions" className="flex items-center">
                                 <Bookmark className="w-4 h-4 text-blue-600 fill-blue-600" />
                               </div>
                             )}
                             
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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
                      </CardContent>
                       
                        {/* Display Generated Questions Inline */}
                        <GeneratedQuestionsDisplay questionId={question.id} type="similar" />
                        <GeneratedQuestionsDisplay questionId={question.id} type="converted" />
                    </Card>
                   ));
                })()}
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
                    My Questions
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Save and organize your favorite questions for future use
                  </p>
                </div>
                 <div className="flex items-center gap-2">
                   <Badge variant="secondary" className="px-3 py-1">
                     {questionBundles.length} Bundle{questionBundles.length !== 1 ? 's' : ''}
                   </Badge>
                 </div>
              </CardHeader>
              <CardContent>
                {/* Always show summary stats */}
                <Card className="mb-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          My Questions Overview
                        </h3>
                        <p className="text-gray-600 text-lg">
                          Your organized question collection at a glance
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <BookOpen className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-indigo-600 mb-3">
                            {questionBundles.length}
                          </div>
                          <div className="text-lg font-semibold text-gray-700">
                            Question Bundle{questionBundles.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            Organized collections
                          </div>
                        </div>
                        
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FileText className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-emerald-600 mb-3">
                            {questionBundles.reduce((total, bundle) => total + bundle.questions.length, 0)}
                          </div>
                          <div className="text-lg font-semibold text-gray-700">
                            Total Questions
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            Across all bundles
                          </div>
                        </div>
                      </div>
                      
                      {questionBundles.length === 0 && (
                        <div className="mt-8 p-6 bg-white/70 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Bookmark className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-gray-600 text-lg mb-4">
                            No question bundles yet
                          </p>
                          <p className="text-gray-500 text-sm">
                            Start building your collection by creating bundles from the search results
                          </p>
                          <Button 
                            onClick={() => setActiveTab('search')}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Browse Questions
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {questionBundles.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Question Bundles</h3>
                    <div className="space-y-4">
                      {/* Question bundles will be listed here - this section remains unchanged */}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Question Bundles */}
            {questionBundles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Bundles</CardTitle>
                  <p className="text-sm text-gray-600">Your exported question collections</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {questionBundles.map((bundle) => (
                      <Card key={bundle.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{bundle.name}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Last Edit On: {bundle.lastEditOn.toLocaleDateString()}</p>
                                <p>Total Questions: {bundle.questions.length}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => previewBundle(bundle)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportBundle(bundle)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Export
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteBundle(bundle.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

      {/* Create Bundle Modal */}
      <Dialog open={showCreateBundleModal} onOpenChange={setShowCreateBundleModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Create Question Bundle
            </DialogTitle>
            <DialogDescription>
              Enter a name for this question bundle to organize your selected questions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bundle-name">Bundle Name</Label>
              <Input
                id="bundle-name"
                placeholder="e.g., Science Chapter 1 Practice Questions"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              This bundle will contain {selectedQuestions.length} selected question{selectedQuestions.length !== 1 ? 's' : ''}.
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBundleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBundle} className="bg-indigo-600 hover:bg-indigo-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Save Bundle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamAssistPrep;
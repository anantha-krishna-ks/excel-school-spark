import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, GripVertical, Eye, Download, Save, Sparkles, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  elo: string;
}

interface QuizData {
  name: string;
  grade: string;
  subject: string;
  chapter: string;
  questionCount: number;
  selectedELOs: Array<{ id: string; title: string; description: string }>;
}

const QuizPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state?.quizData as QuizData;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [quizName, setQuizName] = useState(quizData?.name || '');

  // Generate mock questions based on quiz data
  useEffect(() => {
    if (quizData) {
      const mockQuestions: Question[] = [];
      const questionTypes: Question['type'][] = ['multiple-choice', 'true-false', 'short-answer'];
      
      for (let i = 0; i < quizData.questionCount; i++) {
        const eloIndex = i % quizData.selectedELOs.length;
        const selectedELO = quizData.selectedELOs[eloIndex];
        const questionType = questionTypes[i % questionTypes.length];
        
        let options: string[] | undefined;
        let correctAnswer = '';
        
        if (questionType === 'multiple-choice') {
          options = [
            'Option A - First choice',
            'Option B - Second choice',
            'Option C - Third choice',
            'Option D - Fourth choice'
          ];
          correctAnswer = 'Option A - First choice';
        } else if (questionType === 'true-false') {
          options = ['True', 'False'];
          correctAnswer = 'True';
        } else {
          correctAnswer = 'Sample answer for short answer question';
        }

        mockQuestions.push({
          id: `q-${i + 1}`,
          text: `Question ${i + 1}: This is a sample ${questionType} question related to ${selectedELO.title}. What is the correct approach to solve this problem?`,
          type: questionType,
          options,
          correctAnswer,
          explanation: `This is the explanation for question ${i + 1}. The correct answer is based on the principles of ${selectedELO.title}.`,
          difficulty: ['easy', 'medium', 'hard'][i % 3] as Question['difficulty'],
          elo: selectedELO.title
        });
      }
      
      setQuestions(mockQuestions);
    }
  }, [quizData]);

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? editingQuestion : q
      ));
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
      toast({
        title: "Question updated",
        description: "The question has been successfully updated.",
      });
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    toast({
      title: "Question deleted",
      description: "The question has been removed from the quiz.",
    });
  };

  const handleSaveQuiz = () => {
    // Implementation for saving quiz
    console.log('Saving quiz:', { name: quizName, questions });
    toast({
      title: "Quiz saved",
      description: `"${quizName}" has been saved successfully.`,
    });
    setSaveDialogOpen(false);
    navigate('/quiz-generator');
  };

  const handleDisplay = () => {
    navigate('/quiz-generator/display', { state: { questions, quizData: { ...quizData, name: quizName } } });
  };

  const handleExport = () => {
    // Implementation for export functionality
    toast({
      title: "Export feature",
      description: "Export functionality will be implemented here.",
    });
  };

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No quiz data found</h2>
          <p className="text-gray-500 mb-4">Please create a quiz first.</p>
          <Button onClick={() => navigate('/quiz-generator/create')}>
            Create Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-cyan-50">
      {/* Animated Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100 px-6 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/quiz-generator/create')}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Create
              </Button>
              <div className="animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
                      Quiz Preview & Editing
                    </h1>
                    <p className="text-sm text-purple-600/70">Review and perfect your generated quiz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Animated Quiz Details Card */}
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-500 text-white">
            <CardTitle className="flex items-center justify-between text-2xl">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <span className="font-bold">{quizData.name}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-medium">
                  {quizData.grade}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-medium">
                  {quizData.subject}
                </Badge>
              </div>
            </CardTitle>
            <p className="text-purple-100 text-lg font-medium">Chapter: {quizData.chapter}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900 text-lg">Learning Outcomes</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {quizData.selectedELOs.map((elo, index) => (
                  <Badge 
                    key={elo.id} 
                    variant="secondary" 
                    className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200 px-3 py-1 text-sm font-medium hover-scale transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {elo.title}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animated Questions List */}
        <Card className="overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Edit2 className="w-5 h-5" />
              </div>
              Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className="group relative border-2 border-purple-100 rounded-xl p-6 bg-gradient-to-br from-white to-purple-50/50 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover-scale"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg group-hover:from-purple-600 group-hover:to-violet-600 transition-all duration-300">
                      <GripVertical className="w-4 h-4 text-white cursor-move" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                        Q{index + 1}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium transition-all duration-200 ${
                          question.difficulty === 'easy' ? 'border-green-300 text-green-700 bg-green-50' :
                          question.difficulty === 'medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                          'border-red-300 text-red-700 bg-red-50'
                        }`}
                      >
                        {question.difficulty.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-200"
                      >
                        {question.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(question)}
                      className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Question Content */}
                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-4 border border-purple-100">
                    <h4 className="font-semibold text-gray-900 text-lg leading-relaxed">{question.text}</h4>
                  </div>

                  {question.options && (
                    <div className="ml-4 bg-white/50 rounded-lg p-4 border border-purple-100">
                      <h5 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Answer Options:
                      </h5>
                      <ul className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <li 
                            key={optIndex} 
                            className={`text-sm p-3 rounded-lg transition-all duration-200 ${
                              option === question.correctAnswer 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-semibold border border-green-200 shadow-sm' 
                                : 'bg-gray-50 text-gray-700 border border-gray-200'
                            }`}
                          >
                            <span className="font-medium text-purple-600 mr-2">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {option}
                            {option === question.correctAnswer && (
                              <span className="ml-2 text-green-600 font-bold">✓</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Correct Answer:
                      </h5>
                      <p className="text-sm text-green-800 font-medium bg-white/60 p-2 rounded border border-green-100">
                        {question.correctAnswer}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Explanation:
                      </h5>
                      <p className="text-sm text-blue-800 bg-white/60 p-2 rounded border border-blue-100 leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <Badge 
                      variant="outline" 
                      className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200 px-3 py-1"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      ELO: {question.elo}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-6 justify-center pt-8">
          <Button
            variant="outline"
            onClick={handleDisplay}
            className="min-w-36 h-12 text-lg font-medium bg-white/70 hover:bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-300 transition-all duration-300 hover-scale"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="min-w-36 h-12 text-lg font-medium bg-white/70 hover:bg-cyan-50 border-cyan-200 text-cyan-700 hover:border-cyan-300 transition-all duration-300 hover-scale"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="min-w-36 h-12 text-lg font-medium bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                <Save className="w-5 h-5 mr-2" />
                Save Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-lg border-purple-200">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-purple-900">Save Your Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-700">Quiz Name</label>
                  <Input
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Enter quiz name"
                    className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSaveDialogOpen(false)}
                    className="hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveQuiz}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    Save Quiz
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-lg border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Edit Question
            </DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-purple-700">Question Text</label>
                <Textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, text: e.target.value } : null)}
                  rows={3}
                  className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {editingQuestion.options && (
                <div>
                  <label className="text-sm font-medium text-purple-700">Answer Options</label>
                  <div className="space-y-2 mt-1">
                    {editingQuestion.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options!];
                          newOptions[index] = e.target.value;
                          setEditingQuestion(prev => prev ? { ...prev, options: newOptions } : null);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-purple-700">Correct Answer</label>
                <Input
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, correctAnswer: e.target.value } : null)}
                  className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-purple-700">Explanation</label>
                <Textarea
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, explanation: e.target.value } : null)}
                  rows={2}
                  className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPreview;
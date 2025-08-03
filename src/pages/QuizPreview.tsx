import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, GripVertical, Eye, Download, Save } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/quiz-generator/create')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Create
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Preview & Editing</h1>
                <p className="text-sm text-gray-500">Review and edit your generated quiz</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quiz Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{quizData.name}</span>
              <div className="flex gap-2">
                <Badge variant="outline">{quizData.grade}</Badge>
                <Badge variant="outline">{quizData.subject}</Badge>
              </div>
            </CardTitle>
            <p className="text-sm text-gray-600">Chapter: {quizData.chapter}</p>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-medium mb-2">Selected Learning Outcomes:</h4>
              <div className="flex flex-wrap gap-2">
                {quizData.selectedELOs.map(elo => (
                  <Badge key={elo.id} variant="secondary">
                    {elo.title}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-600">Q{index + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {question.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{question.text}</h4>
                  </div>

                  {question.options && (
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Options:</h5>
                      <ul className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex} className={`text-sm ${
                            option === question.correctAnswer 
                              ? 'text-green-600 font-medium' 
                              : 'text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {option === question.correctAnswer && ' ✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-700">Correct Answer:</h5>
                    <p className="text-sm text-green-600 font-medium">{question.correctAnswer}</p>
                  </div>

                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-700">Explanation:</h5>
                    <p className="text-sm text-gray-600">{question.explanation}</p>
                  </div>

                  <div className="ml-4">
                    <Badge variant="outline" className="text-xs">
                      ELO: {question.elo}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleDisplay}
            className="min-w-32"
          >
            <Eye className="w-4 h-4 mr-2" />
            Display
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="min-w-32"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 min-w-32">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Quiz Name</label>
                  <Input
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Enter quiz name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveQuiz}>Save Quiz</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question Text</label>
                <Textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, text: e.target.value } : null)}
                  rows={3}
                />
              </div>

              {editingQuestion.options && (
                <div>
                  <label className="text-sm font-medium">Options</label>
                  <div className="space-y-2">
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
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Correct Answer</label>
                <Input
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, correctAnswer: e.target.value } : null)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Explanation</label>
                <Textarea
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, explanation: e.target.value } : null)}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPreview;
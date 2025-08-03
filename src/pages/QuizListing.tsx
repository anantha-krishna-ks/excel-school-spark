import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Edit, Copy, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SavedQuiz {
  id: string;
  name: string;
  chapter: string;
  subject: string;
  grade: string;
  questionCount: number;
  createdAt: string;
  lastModified: string;
}

const QuizListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for saved quizzes
  const [savedQuizzes] = useState<SavedQuiz[]>([
    {
      id: '1',
      name: 'Photosynthesis Quiz',
      chapter: 'Life Processes',
      subject: 'Biology',
      grade: 'Class 10',
      questionCount: 10,
      createdAt: '2024-01-15',
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      name: 'Quadratic Equations Test',
      chapter: 'Polynomials',
      subject: 'Mathematics',
      grade: 'Class 10',
      questionCount: 12,
      createdAt: '2024-01-10',
      lastModified: '2024-01-12'
    },
    {
      id: '3',
      name: 'Periodic Classification Quiz',
      chapter: 'Periodic Classification of Elements',
      subject: 'Chemistry',
      grade: 'Class 10',
      questionCount: 8,
      createdAt: '2024-01-05',
      lastModified: '2024-01-05'
    }
  ]);

  const filteredQuizzes = savedQuizzes.filter(quiz =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (quizId: string) => {
    navigate(`/quiz-generator/preview/${quizId}`);
  };

  const handleDuplicate = (quiz: SavedQuiz) => {
    console.log('Duplicating quiz:', quiz);
    // Implementation for duplicating quiz
  };

  const handleDelete = (quizId: string) => {
    console.log('Deleting quiz:', quizId);
    // Implementation for deleting quiz
  };

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
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Generator</h1>
                <p className="text-sm text-gray-500">Manage and create interactive quizzes</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/quiz-generator/create')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search quizzes by name, subject, or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first quiz'}
            </p>
            <Button 
              onClick={() => navigate('/quiz-generator/create')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {quiz.name}
                      </CardTitle>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>{quiz.subject} • {quiz.grade}</p>
                        <p>{quiz.chapter}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{quiz.questionCount} questions</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(quiz.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(quiz.id)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(quiz)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListing;
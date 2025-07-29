import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, Calendar, Hash } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: 'Knowledge' | 'Understanding' | 'Application';
  marks: number;
  isBookmarked?: boolean;
}

interface QuestionBundle {
  id: string;
  name: string;
  lastEditOn: Date;
  questions: Question[];
}

const QuestionBundlePreview = () => {
  const navigate = useNavigate();
  const { bundleId } = useParams();
  const location = useLocation();
  
  // Get bundle data from location state or fetch from storage
  const bundle: QuestionBundle | null = location.state?.bundle || null;

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Bundle Not Found</h2>
              <p className="text-gray-600 mb-4">The requested question bundle could not be found.</p>
              <Button onClick={() => navigate('/exam-assist-prep')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Exam Prep
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Knowledge':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Understanding':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Application':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/exam-assist-prep')}
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {bundle.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Last edited: {bundle.lastEditOn.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {bundle.questions.length} questions
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Bundle
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Bundle Stats */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {bundle.questions.filter(q => q.type === 'Knowledge').length}
                </div>
                <div className="text-sm font-medium text-blue-700">Knowledge Questions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {bundle.questions.filter(q => q.type === 'Understanding').length}
                </div>
                <div className="text-sm font-medium text-green-700">Understanding Questions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {bundle.questions.filter(q => q.type === 'Application').length}
                </div>
                <div className="text-sm font-medium text-purple-700">Application Questions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bundle.questions.map((question, index) => (
                <Card key={question.id} className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Q{index + 1}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`${getTypeColor(question.type)} font-medium`}
                          >
                            {question.type}
                          </Badge>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {question.marks} marks
                          </Badge>
                        </div>
                        <p className="text-gray-900 text-base leading-relaxed">
                          {question.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {bundle.questions.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
              <p className="text-gray-600">This bundle doesn't contain any questions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionBundlePreview;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { getGrades, getSubjects, getChapters, type Grade, type Subject, type Chapter } from '../../api';

const AssessmentCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    board: '',
    grade: '',
    subject: '',
    assessmentName: '',
    duration: '',
    marks: '',
    assessmentType: ''
  });

  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);

  // Fallback grades in case API fails
  const fallbackGrades = [
    { ClassId: 1, ClassName: 'Grade 1' },
    { ClassId: 2, ClassName: 'Grade 2' },
    { ClassId: 3, ClassName: 'Grade 3' },
    { ClassId: 4, ClassName: 'Grade 4' },
    { ClassId: 5, ClassName: 'Grade 5' },
    { ClassId: 6, ClassName: 'Grade 6' },
    { ClassId: 7, ClassName: 'Grade 7' },
    { ClassId: 8, ClassName: 'Grade 8' },
    { ClassId: 9, ClassName: 'Grade 9' },
    { ClassId: 10, ClassName: 'Grade 10' },
    { ClassId: 11, ClassName: 'Grade 11' },
    { ClassId: 12, ClassName: 'Grade 12' }
  ];

  // Fallback subjects based on grade
  const getSubjectsForGrade = (gradeId: string) => {
    const grade = parseInt(gradeId);
    
    if (grade <= 5) {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'Science', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Social Studies', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Hindi', PlanClassId: gradeId }
      ];
    } else if (grade <= 8) {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'General Science', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Social Science', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Hindi', PlanClassId: gradeId },
        { SubjectId: 6, SubjectName: 'Computer Science', PlanClassId: gradeId }
      ];
    } else if (grade <= 10) {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'Physics', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Chemistry', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Biology', PlanClassId: gradeId },
        { SubjectId: 6, SubjectName: 'Social Science', PlanClassId: gradeId },
        { SubjectId: 7, SubjectName: 'Hindi', PlanClassId: gradeId },
        { SubjectId: 8, SubjectName: 'Computer Science', PlanClassId: gradeId }
      ];
    } else {
      return [
        { SubjectId: 1, SubjectName: 'Mathematics', PlanClassId: gradeId },
        { SubjectId: 2, SubjectName: 'English', PlanClassId: gradeId },
        { SubjectId: 3, SubjectName: 'Physics', PlanClassId: gradeId },
        { SubjectId: 4, SubjectName: 'Chemistry', PlanClassId: gradeId },
        { SubjectId: 5, SubjectName: 'Biology', PlanClassId: gradeId },
        { SubjectId: 6, SubjectName: 'Economics', PlanClassId: gradeId },
        { SubjectId: 7, SubjectName: 'Political Science', PlanClassId: gradeId },
        { SubjectId: 8, SubjectName: 'History', PlanClassId: gradeId },
        { SubjectId: 9, SubjectName: 'Geography', PlanClassId: gradeId },
        { SubjectId: 10, SubjectName: 'Computer Science', PlanClassId: gradeId },
        { SubjectId: 11, SubjectName: 'Hindi', PlanClassId: gradeId }
      ];
    }
  };

  const boards = [
    { value: 'cbse', label: 'CBSE' },
    { value: 'icse', label: 'ICSE' },
    { value: 'state', label: 'State Board' },
    { value: 'ib', label: 'IB' }
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ];

  const assessmentTypes = [
    { value: 'PA1', label: 'PA1' },
    { value: 'PA2', label: 'PA2' },
    { value: 'Mid-term', label: 'Mid-term' },
    { value: 'Preparatory', label: 'Preparatory' },
    { value: 'Final', label: 'Final' }
  ];

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradesData = await getGrades('ORG001');
        setGrades(gradesData.length > 0 ? gradesData : fallbackGrades);
      } catch (error) {
        console.error('Error fetching grades:', error);
        // Use fallback grades if API fails
        setGrades(fallbackGrades);
      }
    };
    fetchGrades();
  }, []);

  const handleGradeChange = async (gradeId: string) => {
    setFormData({ ...formData, grade: gradeId, subject: '' });
    setSubjects([]);
    setChapters([]);
    setSelectedChapters([]);
    
    if (gradeId) {
      try {
        setLoading(true);
        const subjectsData = await getSubjects('ORG001', parseInt(gradeId));
        setSubjects(subjectsData.length > 0 ? subjectsData : getSubjectsForGrade(gradeId));
      } catch (error) {
        console.error('Error fetching subjects:', error);
        // Use fallback subjects if API fails
        setSubjects(getSubjectsForGrade(gradeId));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubjectChange = async (subjectId: string) => {
    setFormData({ ...formData, subject: subjectId });
    setChapters([]);
    setSelectedChapters([]);
    
    if (subjectId) {
      try {
        setLoading(true);
        const selectedSubject = subjects.find(s => s.SubjectId.toString() === subjectId);
        if (selectedSubject) {
          const chaptersData = await getChapters('ORG001', selectedSubject.PlanClassId);
          if (chaptersData && chaptersData.length > 0) {
            setChapters(chaptersData);
            setSelectedChapters(chaptersData);
          } else {
            // Use fallback chapters if API returns empty
            const fallbackChapters = getFallbackChapters(subjectId);
            setChapters(fallbackChapters);
            setSelectedChapters(fallbackChapters);
          }
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        // Use fallback chapters if API fails
        const fallbackChapters = getFallbackChapters(subjectId);
        setChapters(fallbackChapters);
        setSelectedChapters(fallbackChapters);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fallback chapters based on subject
  const getFallbackChapters = (subjectId: string) => {
    const subjectName = subjects.find(s => s.SubjectId.toString() === subjectId)?.SubjectName || '';
    
    if (subjectName.toLowerCase().includes('mathematics')) {
      return [
        { chapterId: '1', chapterName: 'Numbers and Operations' },
        { chapterId: '2', chapterName: 'Algebra and Patterns' },
        { chapterId: '3', chapterName: 'Geometry and Measurement' },
        { chapterId: '4', chapterName: 'Data and Probability' }
      ];
    } else if (subjectName.toLowerCase().includes('science')) {
      return [
        { chapterId: '1', chapterName: 'Living and Non-Living Things' },
        { chapterId: '2', chapterName: 'Plants and Animals' },
        { chapterId: '3', chapterName: 'Matter and Materials' },
        { chapterId: '4', chapterName: 'Forces and Motion' }
      ];
    } else if (subjectName.toLowerCase().includes('english')) {
      return [
        { chapterId: '1', chapterName: 'Reading Comprehension' },
        { chapterId: '2', chapterName: 'Grammar and Usage' },
        { chapterId: '3', chapterName: 'Vocabulary Building' },
        { chapterId: '4', chapterName: 'Writing Skills' }
      ];
    } else {
      return [
        { chapterId: '1', chapterName: 'Introduction to ' + subjectName },
        { chapterId: '2', chapterName: 'Fundamental Concepts' },
        { chapterId: '3', chapterName: 'Advanced Topics' },
        { chapterId: '4', chapterName: 'Applications and Practice' }
      ];
    }
  };

  const removeChapter = (chapterId: string) => {
    setSelectedChapters(prev => prev.filter(chapter => chapter.chapterId !== chapterId));
  };

  const handleGenerate = () => {
    if (!formData.board || !formData.grade || !formData.subject || !formData.assessmentName || 
        !formData.duration || !formData.marks || !formData.assessmentType || selectedChapters.length === 0) {
      alert('Please fill all required fields and select at least one chapter.');
      return;
    }

    // Navigate to ELO selection page with the form data
    navigate('/assessment-assist/elo-selection', { 
      state: { 
        formData, 
        selectedChapters,
        gradeName: grades.find(g => g.ClassId.toString() === formData.grade)?.ClassName,
        subjectName: subjects.find(s => s.SubjectId.toString() === formData.subject)?.SubjectName
      } 
    });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/assessment-assist')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment Repository
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Create Assessment</h1>
            <p className="text-lg text-muted-foreground">
              Set up your assessment details and configure the content
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Setup */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Basic Setup</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Configure your assessment details in just a few clicks</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Board, Grade, Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <label className="text-sm font-semibold text-foreground">Board/Standard *</label>
                    </div>
                    <Select value={formData.board} onValueChange={(value) => setFormData({ ...formData, board: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Board" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map(board => (
                          <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <label className="text-sm font-semibold text-foreground">Grade *</label>
                    </div>
                    <Select value={formData.grade} onValueChange={handleGradeChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {(grades.length > 0 ? grades : fallbackGrades).map(grade => (
                          <SelectItem key={grade.ClassId} value={grade.ClassId.toString()}>
                            {grade.ClassName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <label className="text-sm font-semibold text-foreground">Subject *</label>
                    </div>
                    <Select value={formData.subject} onValueChange={handleSubjectChange} disabled={!formData.grade}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {(subjects.length > 0 ? subjects : formData.grade ? getSubjectsForGrade(formData.grade) : []).map(subject => (
                          <SelectItem key={subject.SubjectId} value={subject.SubjectId.toString()}>
                            {subject.SubjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Chapter/Unit Selection */}
                {formData.subject && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <label className="text-sm font-semibold text-foreground">Chapter/Unit</label>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Loading chapters...</p>
                      </div>
                    ) : chapters.length > 0 ? (
                      <div className="space-y-4">
                        <Select>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder={`${selectedChapters.length} chapter(s) selected`} />
                          </SelectTrigger>
                          <SelectContent>
                            {chapters.map(chapter => (
                              <SelectItem key={chapter.chapterId} value={chapter.chapterId}>
                                {chapter.chapterName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">
                            Selected Chapters ({selectedChapters.length} of {chapters.length})
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedChapters.map(chapter => (
                              <Badge 
                                key={chapter.chapterId} 
                                variant="secondary" 
                                className="flex items-center gap-2 px-3 py-1"
                              >
                                {chapter.chapterName}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive/20"
                                  onClick={() => removeChapter(chapter.chapterId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Select disabled>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select chapter/unit..." />
                        </SelectTrigger>
                      </Select>
                    )}
                  </div>
                )}

                {/* Upload Related Content */}
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-blue-50/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Upload Related Content</h4>
                        <p className="text-sm text-blue-700">PDFs, documents, and materials</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Assessment Name *</label>
                  <Input
                    placeholder="Enter assessment name"
                    value={formData.assessmentName}
                    onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Time Duration *</label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map(duration => (
                          <SelectItem key={duration.value} value={duration.value}>{duration.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Total Marks *</label>
                    <Input
                      type="number"
                      placeholder="Enter marks"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Assessment Type *</label>
                    <Select value={formData.assessmentType} onValueChange={(value) => setFormData({ ...formData, assessmentType: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assessmentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleGenerate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-12 py-4 h-auto text-lg rounded-xl"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {loading ? 'Loading...' : 'Generate COs'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreate;
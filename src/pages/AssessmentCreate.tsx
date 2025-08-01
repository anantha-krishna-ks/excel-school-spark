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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/assessment-assist')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-blue-50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment Repository
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Create Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Design comprehensive assessments with intelligent AI assistance
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Setup */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-scale-in">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Basic Setup
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">Configure your assessment details in just a few clicks</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Board, Grade, Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3 group">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"></div>
                      <label className="text-sm font-semibold text-foreground">Board/Standard *</label>
                    </div>
                    <Select value={formData.board} onValueChange={(value) => setFormData({ ...formData, board: value })}>
                      <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors duration-200 bg-white/50">
                        <SelectValue placeholder="Select Board" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map(board => (
                          <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 group">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"></div>
                      <label className="text-sm font-semibold text-foreground">Grade *</label>
                    </div>
                    <Select value={formData.grade} onValueChange={handleGradeChange}>
                      <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors duration-200 bg-white/50">
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

                  <div className="space-y-3 group">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"></div>
                      <label className="text-sm font-semibold text-foreground">Subject *</label>
                    </div>
                    <Select value={formData.subject} onValueChange={handleSubjectChange} disabled={!formData.grade}>
                      <SelectTrigger className="h-12 border-2 hover:border-purple-300 transition-colors duration-200 bg-white/50 disabled:opacity-50">
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
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"></div>
                      <label className="text-lg font-semibold text-foreground">Chapter/Unit Selection</label>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Loading chapters...</p>
                      </div>
                    ) : chapters.length > 0 ? (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-6 rounded-xl shadow-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-base font-semibold text-orange-900">
                              Available Chapters ({selectedChapters.length} of {chapters.length} selected)
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedChapters(chapters)}
                                disabled={selectedChapters.length === chapters.length}
                                className="bg-white/70 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200"
                              >
                                Select All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedChapters([])}
                                disabled={selectedChapters.length === 0}
                                className="bg-white/70 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200"
                              >
                                Clear All
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {chapters.map(chapter => {
                              const isSelected = selectedChapters.some(sc => sc.chapterId === chapter.chapterId);
                              return (
                                <div 
                                  key={chapter.chapterId} 
                                  className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                    isSelected 
                                      ? 'border-orange-300 bg-gradient-to-r from-orange-100 to-amber-100 shadow-md' 
                                      : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                      isSelected 
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 shadow-lg' 
                                        : 'border-gray-300 hover:border-orange-400'
                                    }`}>
                                      {isSelected && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                      {chapter.chapterName}
                                    </span>
                                  </div>
                                  
                                  {isSelected ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-red-100 rounded-full transition-all duration-200"
                                      onClick={() => removeChapter(chapter.chapterId)}
                                    >
                                      <X className="h-5 w-5 text-red-500" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-orange-100 rounded-full transition-all duration-200"
                                      onClick={() => setSelectedChapters(prev => [...prev, chapter])}
                                    >
                                      <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {selectedChapters.length === 0 && (
                            <div className="text-center py-6">
                              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <p className="text-orange-700 font-medium">
                                Please select at least one chapter to continue.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No chapters available for the selected subject.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Assessment Details */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Assessment Details
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-3">
                  <label className="text-base font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Assessment Name *
                  </label>
                  <Input
                    placeholder="Enter assessment name"
                    value={formData.assessmentName}
                    onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                    className="h-12 text-base border-2 hover:border-blue-300 focus:border-blue-500 transition-colors duration-200 bg-white/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Time Duration *
                    </label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger className="h-12 border-2 hover:border-purple-300 transition-colors duration-200 bg-white/50">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map(duration => (
                          <SelectItem key={duration.value} value={duration.value}>{duration.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Total Marks *
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter marks"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      className="h-12 text-base border-2 hover:border-green-300 focus:border-green-500 transition-colors duration-200 bg-white/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Assessment Type *
                    </label>
                    <Select value={formData.assessmentType} onValueChange={(value) => setFormData({ ...formData, assessmentType: value })}>
                      <SelectTrigger className="h-12 border-2 hover:border-orange-300 transition-colors duration-200 bg-white/50">
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
            <div className="flex justify-center animate-fade-in">
              <Button 
                onClick={handleGenerate}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-16 py-6 h-auto text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 transform"
                disabled={loading}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreate;
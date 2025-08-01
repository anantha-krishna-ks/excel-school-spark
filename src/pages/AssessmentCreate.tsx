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
          setChapters(chaptersData);
          // Auto-select all chapters initially
          setSelectedChapters(chaptersData);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Create Assessment</h1>
            <p className="text-lg text-muted-foreground">
              Set up your assessment details and configure the content
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Board/Standard *</label>
                    <Select value={formData.board} onValueChange={(value) => setFormData({ ...formData, board: value })}>
                      <SelectTrigger>
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
                    <label className="text-sm font-semibold text-foreground">Grade *</label>
                    <Select value={formData.grade} onValueChange={handleGradeChange}>
                      <SelectTrigger>
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
                    <label className="text-sm font-semibold text-foreground">Subject *</label>
                    <Select value={formData.subject} onValueChange={handleSubjectChange} disabled={!formData.grade}>
                      <SelectTrigger>
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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Time Duration *</label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Assessment Type *</label>
                    <Select value={formData.assessmentType} onValueChange={(value) => setFormData({ ...formData, assessmentType: value })}>
                      <SelectTrigger>
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

            {/* Chapter Selection */}
            {chapters.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Chapter Selection</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Remove unwanted chapters from the assessment scope
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                    {selectedChapters.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No chapters selected. Please select at least one chapter.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerate}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Generate'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreate;
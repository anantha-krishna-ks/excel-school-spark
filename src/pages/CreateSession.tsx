import React, { useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Target, Lightbulb, Clock, BookOpen, Users } from 'lucide-react';
import Header from '@/components/Header';
import RichTextEditor from '@/components/RichTextEditor';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import config from '@/config';

const CreateSession = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessonPlanData, setLessonPlanData] = useState(null);
  const location = useLocation();
      const {
      selectedsubject,Selectedunittitle,selectedGrade,selectedGradeId,selectedSubjectId
    } = location.state || {};
  const [sessionData, setSessionData] = useState({
    title: '',
    duration: '',
    selectedCOs: [] as string[],
    selectedELOs: [] as string[],
    instructions: ''
  });

  // Mock data - in real app this would come from API
  const lessonPlan = {
    title: Selectedunittitle,
    grade: selectedGrade,
    subject: selectedsubject
  };

  const availableCOs = [
    "Students develop gratitude towards farmers for their hard work and their role in ensuring food security",
    "Students acquire the ability to analyze complex problems and develop sustainable solutions", 
    "Students gain a holistic understanding of food production and its socio-economic impact"
  ];

  const availableELOs = [
    "Recognize the basic components of photosynthesis",
    "Differentiate between light and dark reactions",
    "Explain the role of chlorophyll in photosynthesis",
    "Analyze factors affecting photosynthesis rate",
    "Evaluate the importance of photosynthesis in ecosystems"
  ];

  const handleCOToggle = (co: string) => {
    setSessionData(prev => ({
      ...prev,
      selectedCOs: prev.selectedCOs.includes(co)
        ? prev.selectedCOs.filter(item => item !== co)
        : [...prev.selectedCOs, co]
    }));
  };

  const handleELOToggle = (elo: string) => {
    setSessionData(prev => ({
      ...prev,
      selectedELOs: prev.selectedELOs.includes(elo)
        ? prev.selectedELOs.filter(item => item !== elo)
        : [...prev.selectedELOs, elo]
    }));
  };

  const handleSave = () => {
    if (!sessionData.title || !sessionData.duration || sessionData.selectedCOs.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one Core Objective.",
        variant: "destructive"
      });
      return;
    }

    // Mock save logic
    toast({
      title: "Session Created!",
      description: "Your session has been successfully created.",
    });
    GetLessonPlanData();
    // setTimeout(() => {
    //   navigate(`/session-plan-output`);
    // }, 1000);
  };

   const GetLessonPlanData = async()=>{
    try {
      // Use the duration as provided by the user
      const getDuration = (durationStr) => {
        return durationStr || '45'; 
      };
      const topic=lessonPlan.title;
      const subject = lessonPlan.subject;
      const grade = lessonPlan.grade; 
      const duration = sessionData.duration; 
      const keyVocabulary = ''; 
      const supportingMaterials = ''; 
      const currentTopic = lessonPlan.title || '';
      const currentSubject = lessonPlan.subject || '';
      const currentGrade = String(lessonPlan.grade || '');

      const payload = {
        "promptType": "lesson_plan",
        "subject": currentSubject,
        "grade": currentGrade,
        "lessonTitle": topic,
        "duration": duration,
        "keyVocabulary": keyVocabulary,
        "supportingMaterials": supportingMaterials
      };
  
      const response = await axios.post(config.ENDPOINTS.GENERATE_LESSON_PLAN, payload);
      const parsedLesson = JSON.parse(response.data.lessonPlan);
  
      const inputToken = response.data.inputtoken || 0;
      const responseToken = response.data.responsetoken || 0;
  
      const newLessonPlanData = {
        structuredData: {
          ...parsedLesson,
          currentAffairs: parsedLesson.additionalSections?.currentAffairs || [],
          educationalVideos: parsedLesson.additionalSections?.educationalVideos || []
        },
        markdown: response.data.markdown || '',
        inputtoken: inputToken,
        responsetoken: responseToken,
        ailessonplan: parsedLesson
      };

      setLessonPlanData(newLessonPlanData);

      navigate('/session-plan-output', {
        state: {
          lessonPlanData: newLessonPlanData,
          originalTopic: topic,
          onSaveSuccess: true,
          UnitId: lessonId,
        }
      });     
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Please check your input and try again.';
      let displayMessage = 'Failed to generate lesson plan.';
      if (errorMessage.includes('topic') && errorMessage.includes('subject')) {
        displayMessage = 'The topic does not match the selected subject.';
      }        
      console.error('Error generating lesson plan:', err);
    } finally {
    }
  }
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')} className="cursor-pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/lesson-plan-assistant')} className="cursor-pointer">
                Lesson Plan Repository
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(`/session/${lessonId}`)} className="cursor-pointer">
                Sessions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Session</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Session</h1>
            <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Subject:</span> {lessonPlan.subject}
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium">Topic:</span> {lessonPlan.title}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Class:</span> Grade {lessonPlan.grade}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Session Title *
                </label>
                <Input
                  placeholder="Enter session title..."
                  value={sessionData.title}
                  onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Duration *
                </label>
                <Input
                  placeholder="e.g., 45 minutes"
                  value={sessionData.duration}
                  onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Session Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Session Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={sessionData.instructions}
                onChange={(content) => setSessionData(prev => ({ ...prev, instructions: content }))}
                placeholder="Write detailed instructions for this session..."
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Section 3: Core Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Core Objectives *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableCOs.map((co, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`co-${index}`}
                    checked={sessionData.selectedCOs.includes(co)}
                    onCheckedChange={() => handleCOToggle(co)}
                  />
                  <label
                    htmlFor={`co-${index}`}
                    className="text-sm text-foreground leading-tight cursor-pointer"
                  >
                    {co}
                  </label>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-2">
                Selected: {sessionData.selectedCOs.length} of {availableCOs.length}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Expected Learning Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-600" />
                Expected Learning Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableELOs.map((elo, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`elo-${index}`}
                    checked={sessionData.selectedELOs.includes(elo)}
                    onCheckedChange={() => handleELOToggle(elo)}
                  />
                  <label
                    htmlFor={`elo-${index}`}
                    className="text-sm text-foreground leading-tight cursor-pointer"
                  >
                    {elo}
                  </label>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-2">
                Selected: {sessionData.selectedELOs.length} of {availableELOs.length}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                // Draft save logic
                toast({
                  title: "Draft Saved",
                  description: "Your session has been saved as a draft.",
                });
              }}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
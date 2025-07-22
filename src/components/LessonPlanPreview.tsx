import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Target, Lightbulb, Clock, BookOpen, Users, Share, Download } from 'lucide-react';
import Header from '@/components/Header';
import RichTextEditor from '@/components/RichTextEditor';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface LessonPlanPreviewProps {
  lessonPlan: any;
  unitPlan: any;
  onBack: () => void;
  onEdit: () => void;
}

const LessonPlanPreview: React.FC<LessonPlanPreviewProps> = ({ 
  lessonPlan, 
  unitPlan, 
  onBack, 
  onEdit 
}) => {
  const navigate = useNavigate();

  // Mock session data based on the unit plan
  const sessionData = {
    title: lessonPlan?.title || "Understanding Microorganisms",
    duration: "45 minutes",
    selectedCOs: unitPlan?.coreObjectives?.map((co: any) => co.text) || [
      "Students will identify major groups of microorganisms, understanding their characteristics and habitats.",
      "Students develop scientific curiosity about microscopic life forms around them.",
      "Students gain appreciation for the role of microorganisms in daily life and ecosystems."
    ],
    selectedELOs: unitPlan?.expectedLearningOutcomes || [
      "Define microorganisms and explain why they are called microbes, with examples from daily life.",
      "List and classify the major groups of microorganisms using observable features.",
      "Recognize the presence and importance of microorganisms in different environments.",
      "Demonstrate proper techniques for observing microorganisms safely.",
      "Analyze the beneficial and harmful effects of microorganisms on human life."
    ],
    instructions: "This lesson introduces students to the fascinating world of microorganisms. Students will explore the characteristics of different microbe groups through hands-on activities and microscopic observations. The lesson emphasizes both beneficial and harmful aspects of microorganisms, helping students develop scientific curiosity and appreciation for microscopic life."
  };

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
              <BreadcrumbPage>Lesson Plan Preview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Repository
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lesson Plan Preview</h1>
              <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Subject:</span> {lessonPlan?.subject || "General Science"}
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Topic:</span> {sessionData.title}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Class:</span> Grade {lessonPlan?.grade || "VII"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
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
                  Session Title
                </label>
                <div className="p-3 bg-muted/30 rounded-md border">
                  <span className="text-foreground">{sessionData.title}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Duration
                </label>
                <div className="p-3 bg-muted/30 rounded-md border">
                  <span className="text-foreground">{sessionData.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Session Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Session Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-md border min-h-[120px]">
                <div className="text-foreground text-sm leading-relaxed">
                  {sessionData.instructions}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Core Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Core Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessionData.selectedCOs.map((co, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-sm flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                  </div>
                  <span className="text-sm text-foreground leading-tight flex-1">
                    {co}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Badge variant="secondary" className="text-xs">
                  Selected: {sessionData.selectedCOs.length} objectives
                </Badge>
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
              {sessionData.selectedELOs.map((elo, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-green-100 rounded-sm flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                  </div>
                  <span className="text-sm text-foreground leading-tight flex-1">
                    {elo}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Badge variant="secondary" className="text-xs">
                  Selected: {sessionData.selectedELOs.length} outcomes
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information from Unit Plan */}
          {unitPlan?.learningProgression && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Learning Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {unitPlan.learningProgression.slice(0, 3).map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{step.step}</h4>
                      <p className="text-sm text-muted-foreground">{step.example}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Repository
            </Button>
            <Button
              onClick={onEdit}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Lesson Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanPreview;
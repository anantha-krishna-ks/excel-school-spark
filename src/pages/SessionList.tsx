import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, BookOpen, Users, Calendar, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const SessionList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would come from API based on lesson plan ID
  const lessonPlan = {
    id: parseInt(id || '1'),
    title: "Understanding Photosynthesis: The Food Factory of Plants",
    grade: "VII",
    subject: "General Science"
  };

  const sessions = [
    {
      id: 1,
      title: "Introduction to Photosynthesis",
      duration: "45 minutes",
      objectives: 3,
      outcomes: 5,
      status: "completed",
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Light and Dark Reactions",
      duration: "50 minutes", 
      objectives: 4,
      outcomes: 6,
      status: "in-progress",
      createdDate: "2024-01-16"
    },
    {
      id: 3,
      title: "Factors Affecting Photosynthesis",
      duration: "40 minutes",
      objectives: 3,
      outcomes: 4,
      status: "draft",
      createdDate: "2024-01-17"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
              <BreadcrumbPage>Sessions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/lesson-plan-assistant')}
              className="mt-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{lessonPlan.title}</h1>
              <p className="text-muted-foreground mb-4">Manage sessions for this lesson plan</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {sessions.length} Sessions
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Grade {lessonPlan.grade}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">Grade {lessonPlan.grade}</div>
              <div className="text-sm text-muted-foreground">{lessonPlan.subject}</div>
            </div>
            <Button 
              onClick={() => navigate(`/session/create/${lessonPlan.id}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/session/view/${session.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                    {session.title}
                  </CardTitle>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {session.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.createdDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{session.objectives}</div>
                    <div className="text-xs text-muted-foreground">Objectives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{session.outcomes}</div>
                    <div className="text-xs text-muted-foreground">Outcomes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sessions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first session to get started with this lesson plan.
              </p>
              <Button 
                onClick={() => navigate(`/session/create/${lessonPlan.id}`)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SessionList;
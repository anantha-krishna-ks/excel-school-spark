import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, FileText, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import LessonPlanResult from '@/components/LessonPlanResult';

const LessonPlanAssistant = () => {
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    lessonName: ''
  });

  // Sample lesson plans data
  const sampleLessonPlans = [
    {
      id: 1,
      title: "Understanding Photosynthesis: The Food Factory of Plants",
      grade: "VII",
      subject: "General Science"
    },
    {
      id: 2,
      title: "Understanding Photosynthesis: The Powerhouse of Plant Life",
      grade: "6",
      subject: "Science"
    }
  ];

  const handleCreateLessonPlan = () => {
    if (formData.grade && formData.subject && formData.lessonName) {
      setShowResult(true);
    }
  };

  if (showResult) {
    return <LessonPlanResult lessonData={formData} onBack={() => setShowResult(false)} />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Lesson Planner</h1>
          <p className="text-lg text-muted-foreground">
            Instantly generate engaging, structured lesson plans with real-world resources
          </p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Lesson Plan
              </TabsTrigger>
              <TabsTrigger value="repository" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Lesson Plan Repository
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="space-y-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create New Lesson Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade</label>
                    <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Grade 1</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                        <SelectItem value="4">Grade 4</SelectItem>
                        <SelectItem value="5">Grade 5</SelectItem>
                        <SelectItem value="6">Grade 6</SelectItem>
                        <SelectItem value="7">Grade 7</SelectItem>
                        <SelectItem value="8">Grade 8</SelectItem>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="social-studies">Social Studies</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="geography">Geography</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lesson Name</label>
                    <Input
                      placeholder="Enter lesson name"
                      value={formData.lessonName}
                      onChange={(e) => setFormData({...formData, lessonName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleCreateLessonPlan}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8"
                    disabled={!formData.grade || !formData.subject || !formData.lessonName}
                  >
                    Create My Amazing Lesson Plan!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repository" className="space-y-6">
            <Card className="max-w-6xl mx-auto">
              <CardHeader>
                <CardTitle>Lesson Plan Repository</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search lesson plans..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select defaultValue="all-grades">
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-grades">All Grades</SelectItem>
                      <SelectItem value="1-5">Grades 1-5</SelectItem>
                      <SelectItem value="6-8">Grades 6-8</SelectItem>
                      <SelectItem value="9-12">Grades 9-12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-subjects">
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-subjects">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">SL No.</th>
                        <th className="text-left py-3 px-4 font-medium">Lesson Plan Title</th>
                        <th className="text-left py-3 px-4 font-medium">Grade</th>
                        <th className="text-left py-3 px-4 font-medium">Subject</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleLessonPlans.map((lesson, index) => (
                        <tr key={lesson.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4 font-medium">{lesson.title}</td>
                          <td className="py-4 px-4">{lesson.grade}</td>
                          <td className="py-4 px-4">{lesson.subject}</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LessonPlanAssistant;
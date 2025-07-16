import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';

const LessonPlanAssistant = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    grade: "all",
    subject: "all",
    lessonName: ""
  });

  // Sample lesson plans data - extended to match the reference image
  const lessonPlans = [
    {
      id: 1,
      title: "Understanding Photosynthesis: The Food Factory of Plants",
      grade: "VII",
      subject: "General Science",
      session: 1
    },
    {
      id: 2,
      title: "Understanding Photosynthesis: The Powerhouse of Plant Life",
      grade: "6",
      subject: "Science",
      session: 2
    },
    {
      id: 3,
      title: "Understanding Heat: Transfer, Effects, and Applications",
      grade: "9",
      subject: "General Science",
      session: 1
    },
    {
      id: 4,
      title: "Exploring the World of Plants: Structure, Functions, and Importance",
      grade: "8",
      subject: "General Science",
      session: 3
    },
    {
      id: 5,
      title: "Exploring the Wonders of Light",
      grade: "VII",
      subject: "Science",
      session: 1
    },
    {
      id: 6,
      title: "Journey Through the Digestive System",
      grade: "7",
      subject: "Science",
      session: 2
    }
  ];

  const handleCreateNew = () => {
    navigate("/lesson-plan");
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Lesson Plan Repository</h1>
            <p className="text-lg text-muted-foreground">
              Manage and organize your lesson plans
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create new lesson plan
          </Button>
        </div>

        <Card className="w-full border border-border/50 shadow-sm">
          <CardHeader className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Grade</label>
                <Select value={filters.grade} onValueChange={(value) => setFilters({...filters, grade: value})}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                    <SelectItem value="4">Grade 4</SelectItem>
                    <SelectItem value="5">Grade 5</SelectItem>
                    <SelectItem value="6">Grade 6</SelectItem>
                    <SelectItem value="7">Grade 7</SelectItem>
                    <SelectItem value="VII">Grade VII</SelectItem>
                    <SelectItem value="8">Grade 8</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Subject</label>
                <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="general-science">General Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="social-studies">Social Studies</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Lesson Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter lesson name"
                    value={filters.lessonName}
                    onChange={(e) => setFilters({...filters, lessonName: e.target.value})}
                    className="pl-10 h-11 bg-background"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-20 font-semibold text-foreground">SL No.</TableHead>
                    <TableHead className="font-semibold text-foreground">Lesson Plan Title</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Grade</TableHead>
                    <TableHead className="w-40 font-semibold text-foreground">Subject</TableHead>
                    <TableHead className="w-32 font-semibold text-foreground">Session</TableHead>
                    <TableHead className="w-32 font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessonPlans.map((lesson, index) => (
                    <TableRow key={lesson.id} className="border-b border-border/50 hover:bg-muted/20">
                      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{lesson.title}</TableCell>
                      <TableCell className="text-muted-foreground">{lesson.grade}</TableCell>
                      <TableCell className="text-muted-foreground">{lesson.subject}</TableCell>
                       <TableCell>
                         <Button 
                           variant="link" 
                           className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                           onClick={() => navigate(`/session/${lesson.id}`)}
                         >
                           Session ({lesson.session})
                         </Button>
                       </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50">
                            <Edit className="h-4 w-4 text-purple-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-50">
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanAssistant;
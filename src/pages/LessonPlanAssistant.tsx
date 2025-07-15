import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';

const LessonPlanAssistant = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    grade: "",
    subject: "",
    lessonName: ""
  });

  // Sample lesson plans data - extended to match the reference image
  const lessonPlans = [
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
    },
    {
      id: 3,
      title: "Understanding Heat: Transfer, Effects, and Applications",
      grade: "9",
      subject: "General Science"
    },
    {
      id: 4,
      title: "Exploring the World of Plants: Structure, Functions, and Importance",
      grade: "8",
      subject: "General Science"
    },
    {
      id: 5,
      title: "Exploring the Wonders of Light",
      grade: "VII",
      subject: "Science"
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

        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Grade</label>
                <Select value={filters.grade} onValueChange={(value) => setFilters({...filters, grade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
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

              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
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

              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Lesson Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter lesson name"
                    value={filters.lessonName}
                    onChange={(e) => setFilters({...filters, lessonName: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">SL No.</TableHead>
                  <TableHead>Lesson Plan Title</TableHead>
                  <TableHead className="w-24">Grade</TableHead>
                  <TableHead className="w-40">Subject</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonPlans.map((lesson, index) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{lesson.grade}</TableCell>
                    <TableCell>{lesson.subject}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanAssistant;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';

const AssessmentAssist = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    grade: "all",
    subject: "all",
    assessmentName: ""
  });

  // Sample assessments data
  const assessments = [
    {
      id: 1,
      name: "Understanding Photosynthesis Assessment",
      grade: "VII",
      subject: "General Science",
      type: "PA1",
      marks: 20,
      duration: "45 minutes",
      status: "Completed"
    },
    {
      id: 2,
      name: "Heat Transfer Unit Assessment",
      grade: "9",
      subject: "Science",
      type: "Mid-term",
      marks: 50,
      duration: "90 minutes",
      status: "Draft"
    },
    {
      id: 3,
      name: "Plant Structure and Functions",
      grade: "8",
      subject: "General Science",
      type: "PA2",
      marks: 25,
      duration: "60 minutes",
      status: "Active"
    },
    {
      id: 4,
      name: "Light and Optics Assessment",
      grade: "VII",
      subject: "Science",
      type: "Final",
      marks: 100,
      duration: "180 minutes",
      status: "Completed"
    }
  ];

  const handleCreateNew = () => {
    navigate("/assessment-assist/create");
  };

  const handlePreviewAssessment = (assessment: any) => {
    console.log('Preview assessment:', assessment);
  };

  const handleEditAssessment = (assessment: any) => {
    console.log('Edit assessment:', assessment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Active':
        return 'text-blue-600 bg-blue-50';
      case 'Draft':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Assessment Repository
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Manage and organize your assessments with AI-powered tools
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Assessment
          </Button>
        </div>

        <Card className="w-full border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 group">
                <label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  Grade
                </label>
                <Select value={filters.grade} onValueChange={(value) => setFilters({...filters, grade: value})}>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors duration-200 bg-white/50">
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

              <div className="space-y-3 group">
                <label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  Subject
                </label>
                <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                  <SelectTrigger className="h-12 border-2 hover:border-purple-300 transition-colors duration-200 bg-white/50">
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

              <div className="space-y-3 group">
                <label className="text-base font-semibold text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                  Assessment Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter assessment name"
                    value={filters.assessmentName}
                    onChange={(e) => setFilters({...filters, assessmentName: e.target.value})}
                    className="pl-12 h-12 text-base border-2 hover:border-orange-300 focus:border-orange-500 transition-colors duration-200 bg-white/50"
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
                    <TableHead className="font-semibold text-foreground">Assessment Name</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Grade</TableHead>
                    <TableHead className="w-40 font-semibold text-foreground">Subject</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Type</TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">Marks</TableHead>
                    <TableHead className="w-32 font-semibold text-foreground">Duration</TableHead>
                    <TableHead className="w-28 font-semibold text-foreground">Status</TableHead>
                    <TableHead className="w-32 font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment, index) => (
                    <TableRow key={assessment.id} className="border-b border-border/50 hover:bg-muted/20">
                      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{assessment.name}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.grade}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.type}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.marks}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.duration}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-purple-50"
                            onClick={() => handleEditAssessment(assessment)}
                          >
                            <Edit className="h-4 w-4 text-purple-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-green-50"
                            onClick={() => handlePreviewAssessment(assessment)}
                          >
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

export default AssessmentAssist;
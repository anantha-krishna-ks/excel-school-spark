import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Save, Edit, RefreshCw, Plus, Sparkles, User, Brain } from 'lucide-react';
import Header from '@/components/Header';
import axios from 'axios';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PageLoader } from "@/components/ui/loader"


const UnitPlanPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [unitPlan, setUnitPlan] = useState<any>(null);
  const [issaved, setissaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customObjectives, setCustomObjectives] = useState<any[]>([]);
  const [showAddObjective, setShowAddObjective] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    factor: ''
  });
  
  const lessonData = location.state?.lessonData;
  const unitPlanRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (lessonData?.unitplandata) {
      setUnitPlan(lessonData.unitplandata);
    }
  }, [lessonData]);

  const addCustomObjective = () => {
    if (newObjective.title && newObjective.description && newObjective.factor) {
      setCustomObjectives([...customObjectives, { ...newObjective, id: Date.now(), isCustom: true }]);
      setNewObjective({ title: '', description: '', factor: '' });
      setShowAddObjective(false);
    }
  };

  const removeCustomObjective = (id: number) => {
    setCustomObjectives(customObjectives.filter(obj => obj.id !== id));
  };

  const SaveUnitPlan = async () => {
    try {
      const payload ={
        AppCode: "AP01",
        CustCode: "CU01",
        OrgCode: "OR01",
        UserCode: "UO01",
        ClassName: lessonData.grade,
        ClassId: lessonData.gradeid,
        SubjectName: lessonData.subject,
        SubjectId: lessonData.subjectid,
        PlanClassId: lessonData.PlanClassId,
        ChapterId: lessonData.subjectid,
        ChapterName: lessonData.lessonName,
        UnitPlanTitle: lessonData.lessonName,
        AILessonPlan: lessonData.unitplandata,
        ModifiedLessonPlan: lessonData.unitplandata,
        InputToken: 123,
        ResponseToken: 456
      }
      const response = await axios.post(
        'https://ai.excelsoftcorp.com/aiapps/AIToolKit/UnitPlanGen/save-unit-plan-details',
        JSON.stringify(payload),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setissaved(true);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to fetch unit plan:', error);
    }
  };

  const downloadPDF = async () => {
      setLoading(true);
  if (!unitPlanRef.current) return;

  const element = unitPlanRef.current;

  const canvas = await html2canvas(element, {
    scale: 2, // higher resolution
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    setLoading(false);
  pdf.save(`${lessonData.lessonName || 'unit-plan'}.pdf`);
};

  return (
    <div className="w-full min-h-screen bg-background">
      {loading && <PageLoader text="Please wait..." />}
      <Header />
      
      {saveSuccess && (
        <Dialog
          open={saveSuccess}
          onClose={() => setSaveSuccess(false)}
          PaperProps={{ sx: { borderRadius: 3, px: 3, py: 2, textAlign: 'center' } }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
            ✅ Unit Plan Saved Successfully!
          </DialogTitle>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant="default" onClick={() => setSaveSuccess(false)}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => navigate("/lesson-plan-assistant")}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lesson Plan Repository
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Unit Plan Preview</h1>
            <p className="text-muted-foreground">Review and customize your unit plan</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={SaveUnitPlan} variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
            <Button onClick={downloadPDF} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {unitPlan && (
          <div ref={unitPlanRef} className="space-y-8">
            {/* Header Card */}
            <Card className="border-border shadow-lg">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <div className="text-primary-foreground font-bold text-xl">EXCEL</div>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">Excel Public School, Mysuru</h1>
                        <h2 className="text-xl font-semibold text-primary tracking-wide">UNIT PLAN</h2>
                      </div>
                    </div>
                    <div className="text-right text-muted-foreground">
                      <div className="text-sm">Academic Year</div>
                      <div className="font-semibold">2025-26</div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Board/Standard</span>
                        <span className="text-lg font-semibold text-foreground">CBSE</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Grade</span>
                        <span className="text-lg font-semibold text-foreground">{lessonData.grade}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Subject</span>
                        <span className="text-lg font-semibold text-foreground">{lessonData.subject}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Chapter/Unit</span>
                        <span className="text-lg font-semibold text-foreground">{lessonData.lessonName}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Teacher's Name</span>
                        <span className="text-lg font-semibold text-foreground">Dr. Sriman S Kamath</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Planned Date</span>
                        <span className="text-lg font-semibold text-foreground">28/07/2025</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Class & Section</span>
                        <span className="text-lg font-semibold text-foreground">{lessonData.grade} A & B</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Execution Period</span>
                        <span className="text-lg font-semibold text-foreground">03/08/2025 to 31/08/2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Objectives */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Core Objectives</h3>
                    <p className="text-muted-foreground text-sm">Reference to daily life, long lasting values, and skills</p>
                  </div>
                  <Button 
                    onClick={() => setShowAddObjective(!showAddObjective)}
                    variant="outline" 
                    size="sm"
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Generated Objectives */}
                {unitPlan.coreObjectives?.map((objective: any, index: number) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed mb-2">{objective.text}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                          {objective.label?.value && (
                            <Badge variant="outline" className="text-xs">
                              {objective.label.value}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Custom Objectives */}
                {customObjectives.map((objective: any, index: number) => (
                  <div key={objective.id} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">{unitPlan.coreObjectives.length + index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{objective.title}</h4>
                        <p className="text-foreground leading-relaxed mb-2">{objective.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                            <User className="h-3 w-3 mr-1" />
                            Custom Added
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {objective.factor}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeCustomObjective(objective.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Custom Objective Form */}
                {showAddObjective && (
                  <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-4">Add Custom Objective</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                          <Input
                            placeholder="Enter objective title"
                            value={newObjective.title}
                            onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                          <Textarea
                            placeholder="Enter objective description"
                            value={newObjective.description}
                            onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Factor</label>
                          <Select value={newObjective.factor} onValueChange={(value) => setNewObjective({...newObjective, factor: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select factor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Learning">Learning</SelectItem>
                              <SelectItem value="Skills">Skills</SelectItem>
                              <SelectItem value="Values">Values</SelectItem>
                              <SelectItem value="Application">Application</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addCustomObjective} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Objective
                          </Button>
                          <Button onClick={() => setShowAddObjective(false)} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Expected Learning Outcomes */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Expected Learning Outcomes</h3>
                <p className="text-muted-foreground text-sm">Please refer to the LO mentioned in the Curriculum document</p>
              </CardHeader>
              <CardContent>
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="font-semibold text-foreground mb-4">Students should be able to:</p>
                  <ul className="space-y-3">
                    {unitPlan.expectedLearningOutcomes?.map((outcome: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">{outcome}</span>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 ml-auto">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Bloom's Taxonomy - Higher Order Thinking Skills */}
            <Card className="border-border shadow-sm bg-muted/20">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Bloom's Taxonomy - Higher Order Thinking Skills</h3>
                <p className="text-muted-foreground text-sm">Focus on Analysis, Synthesis, and Evaluation levels</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-700">Analyze</span>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 ml-auto">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">Break down organic compounds into their structural components and identify functional groups</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-blue-700">Evaluate</span>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 ml-auto">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">Assess the stability and reactivity of different organic compounds based on their structure</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="font-semibold text-purple-700">Create</span>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 ml-auto">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">Design synthesis pathways for organic compounds using knowledge of reactions and mechanisms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Skills</h3>
                <p className="text-muted-foreground text-sm">21st Century Skills developed through this lesson</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Critical Thinking", desc: "Analyzing molecular structures and predicting properties" },
                    { title: "Problem Solving", desc: "Identifying unknown compounds using structural clues" },
                    { title: "Scientific Communication", desc: "Explaining concepts using proper chemical terminology" },
                    { title: "Digital Literacy", desc: "Using molecular modeling software and databases" },
                    { title: "Collaboration", desc: "Working in teams on laboratory experiments" },
                    { title: "Data Analysis", desc: "Interpreting spectroscopic data for structure determination" }
                  ].map((skill, index) => (
                    <div key={index} className="text-center p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary">{skill.title}</h4>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          <Sparkles className="h-3 w-3" />
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{skill.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competencies */}
            <Card className="border-border shadow-sm bg-muted/20">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Competencies</h3>
                <p className="text-muted-foreground text-sm">Key competencies developed in this lesson</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Scientific Inquiry", desc: "Ability to formulate hypotheses and design experiments to test organic chemistry concepts" },
                    { title: "Mathematical Reasoning", desc: "Applying mathematical concepts to understand molecular geometry and reaction kinetics" },
                    { title: "Environmental Awareness", desc: "Understanding the environmental impact of organic compounds and sustainable chemistry practices" },
                    { title: "Communication Skills", desc: "Effectively communicating scientific findings and concepts to peers and instructors" }
                  ].map((competency, index) => (
                    <div key={index} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary font-bold text-xs">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{competency.title}</h4>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{competency.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Progression */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Learning Progression</h3>
                <p className="text-muted-foreground text-sm">Step-by-step learning pathway</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {unitPlan.learningProgression?.map((step: any, idx: number) => (
                  <div key={idx} className="border border-border p-4 rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{step.step}</h4>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong className="text-primary">Rationale:</strong> <span className="text-foreground">{step.rationale}</span></p>
                      <p><strong className="text-primary">Example:</strong> <span className="text-foreground">{step.example}</span></p>
                      <p><strong className="text-primary">Connection:</strong> <span className="text-foreground">{step.connection}</span></p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assessment */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Assessment</h3>
                <p className="text-muted-foreground text-sm">Evaluation methods and criteria</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">Stimulus</h4>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <p className="text-foreground">{unitPlan.assessment?.stimulus}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">Stem</h4>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <p className="text-foreground">{unitPlan.assessment?.stem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Assessment Questions</h4>
                    <ul className="space-y-2">
                      {unitPlan.assessment?.questions?.map((q: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary font-bold text-xs">{idx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <strong className="text-primary">{q.type}:</strong>
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            </div>
                            <span className="text-foreground">{q.text}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignments */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Assignments</h3>
                <p className="text-muted-foreground text-sm">Homework and practice activities</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {unitPlan.assignments?.map((assignment: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary font-bold text-xs">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-foreground">{assignment.title}:</strong>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        </div>
                        <span className="text-muted-foreground">{assignment.purpose}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Learning Experiences */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Learning Experiences</h3>
                <p className="text-muted-foreground text-sm">Interactive and engaging learning activities</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {unitPlan.learningExperiences?.map((exp: any, idx: number) => (
                  <div key={idx} className="border border-border p-4 rounded-lg bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-foreground">{exp.phase}</h4>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {exp.activities?.map((activity: string, actIdx: number) => (
                        <li key={actIdx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-foreground text-sm">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitPlanPreview;

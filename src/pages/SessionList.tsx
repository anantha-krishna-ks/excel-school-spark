
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Clock, BookOpen, Users, Calendar, ArrowLeft, Edit, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import UnitPlanView from '@/components/UnitPlanView';

const SessionList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

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
      status: "draft",
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

  // Mock unit plan data
  const unitPlanData = {
    assessment: {
      stem: "How can your understanding of microorganisms help explain the increase in food poisoning and plant diseases? What steps would you recommend to prevent further outbreaks?",
      stimulus: "A local newspaper has reported an increase in cases of food poisoning and plant diseases in your community. The community health center is seeking student volunteers to investigate the causes and suggest solutions.",
      questions: [
        {
          text: "Identify possible microorganisms responsible for food spoilage and plant diseases in the community. Explain their characteristics and how they spread.",
          type: "Application"
        },
        {
          text: "Analyze the role of hygiene and environmental conditions in the recent increase of microbial diseases. What practices may have contributed to the problem?",
          type: "Analysis"
        },
        {
          text: "Reflect on your own daily hygiene routines. What changes would you make to help prevent the spread of harmful microbes at home and in public places?",
          type: "Reflection"
        },
        {
          text: "Work with your group to design a community awareness campaign, including posters and demonstrations, to educate people about the benefits of good hygiene and the positive roles of beneficial microbes.",
          type: "Group Activity"
        }
      ]
    },
    assignments: [
      {
        title: "Microbe Hunters: Classification Challenge",
        purpose: "To develop observation and classification skills by identifying and grouping microorganisms from images, prepared slides, and case studies. Encourages scientific reasoning and teamwork."
      },
      {
        title: "Fermentation Diary",
        purpose: "To observe and document the process of fermentation at home (e.g., curd, bread, dosa batter), linking scientific concepts to everyday life and appreciating the positive role of microbes."
      },
      {
        title: "Hygiene Audit: School and Home",
        purpose: "To assess hygiene practices in school and at home, identify areas for improvement, and recommend practical steps to reduce the spread of harmful microorganisms. Instills responsibility and civic engagement."
      },
      {
        title: "Microbial Growth Experiment",
        purpose: "To design and conduct a controlled experiment (e.g., growing mold on bread under different conditions), record observations, and interpret results, fostering inquiry skills and scientific thinking."
      },
      {
        title: "Awareness Poster: Beneficial vs. Harmful Microbes",
        purpose: "To synthesize understanding by creating a visual poster contrasting the roles of beneficial and harmful microorganisms, promoting awareness and communication skills."
      }
    ],
    coreObjectives: [
      {
        text: "Students will identify major groups of microorganisms, understanding their characteristics and habitats, relating classification to real-world scenarios such as food spoilage, environmental cleanliness, and health.",
        label: {
          value: "Knowledge; Classification skills; Scientific curiosity"
        }
      },
      {
        text: "Students will analyze the positive roles of microorganisms in processes such as fermentation, soil fertility, and medicine, connecting these to everyday applications like yogurt making, composting, and vaccine development.",
        label: {
          value: "Application; Analytical thinking; Appreciation of science in daily life"
        }
      },
      {
        text: "Students will explain how certain microorganisms cause diseases in humans, animals, and plants, and discuss preventive strategies, fostering awareness of health and hygiene in community contexts.",
        label: {
          value: "Analysis; Health awareness; Responsibility"
        }
      },
      {
        text: "Students will develop awareness of hygienic practices to prevent the spread of harmful microorganisms in daily life, encouraging the adoption of safe routines at home, school, and public places.",
        label: {
          value: "Application; Civic responsibility; Personal hygiene skills"
        }
      },
      {
        text: "Students will design and conduct simple experiments to observe the growth and effects of microorganisms under different conditions, promoting scientific inquiry and data interpretation.",
        label: {
          value: "Experimentation; Observation skills; Scientific mindset"
        }
      }
    ],
    learningExperiences: [
      {
        phase: "Engage",
        activities: [
          "Brainstorming session: 'Where have you seen microorganisms at work?' (e.g., spoiled food, making curd, composting).",
          "Show short video clips or images of microbial life in action.",
          "Class discussion on misconceptions: Are all microbes bad? Why or why not?"
        ]
      },
      {
        phase: "Explore",
        activities: [
          "Observation of prepared slides/images of bacteria, fungi, protozoa, algae, and viruses.",
          "Sorting activity: Classifying given examples (pictures, text descriptions) into correct microorganism groups.",
          "Group research: Investigate and present on habitats of different microbes (e.g., soil, water, human body, food)."
        ]
      },
      {
        phase: "Explain",
        activities: [
          "Teacher-guided interactive lesson on characteristics of each microorganism group, using real-life examples.",
          "Demonstration: Setting up a simple fermentation experiment (e.g., milk to curd) and predicting outcomes.",
          "Discussion: How do microbes help in agriculture (nitrogen fixation), medicine (antibiotics), and food (fermentation)?"
        ]
      },
      {
        phase: "Elaborate",
        activities: [
          "Case study analysis: Outbreak of a disease in humans/plants/animals; tracing the cause and prevention.",
          "Role-play: Acting out the journey of a microbe causing disease vs. a beneficial microbe.",
          "Hands-on experiment: Setting up bread mold growth under different conditions (moist/dry, warm/cold, covered/uncovered); recording and comparing results.",
          "Group project: Designing and presenting a hygiene campaign for school/community."
        ]
      },
      {
        phase: "Evaluate",
        activities: [
          "Quiz: Classifying microbes, identifying beneficial/harmful roles, and explaining prevention strategies.",
          "Practical demonstration: Proper handwashing technique and explanation of its importance.",
          "Reflection journal: What have you learned about microbes that changed your perception or behavior?",
          "Peer review of posters and experiments; constructive feedback and discussion."
        ]
      }
    ],
    learningProgression: [
      {
        step: "Introduction to Microorganisms: What are they and where are they found?",
        example: "Discussing why bread becomes moldy or why curd forms from milk.",
        rationale: "Builds foundational understanding; connects to students' real-life experiences.",
        connection: "Prepares students to recognize presence and diversity of microbes in their surroundings."
      },
      {
        step: "Classification and Characteristics of Microorganisms",
        example: "Sorting images or samples of bacteria, fungi, algae, protozoa, and viruses.",
        rationale: "Supports scientific classification skills and observation.",
        connection: "Builds on initial awareness and introduces systematic identification."
      },
      {
        step: "Exploring Beneficial Microbes: Fermentation, Soil Fertility, and Medicine",
        example: "Observing curd formation, learning about antibiotics, and composting.",
        rationale: "Highlights positive impacts; counters misconceptions about all microbes being harmful.",
        connection: "Deepens understanding by linking to food, agriculture, and health."
      },
      {
        step: "Harmful Microorganisms: Diseases and Their Prevention",
        example: "Case studies on cholera, flu, or plant blight; discussing how diseases spread.",
        rationale: "Develops critical thinking about risks and responsibility.",
        connection: "Contrasts beneficial roles with risks, leading to preventive strategies."
      },
      {
        step: "Hygiene and Disease Prevention in Everyday Life",
        example: "Demonstrating handwashing, creating hygiene posters.",
        rationale: "Promotes healthy habits and community responsibility.",
        connection: "Applies learning to personal and social contexts."
      },
      {
        step: "Scientific Inquiry: Observing Microbial Growth",
        example: "Setting up bread mold or yogurt experiments, recording observations.",
        rationale: "Encourages hands-on experimentation and scientific reasoning.",
        connection: "Integrates all prior knowledge into practical, inquiry-based activities."
      }
    ],
    expectedLearningOutcomes: [
      "Define microorganisms and explain why they are called microbes, with examples from daily life.",
      "List and classify the major groups of microorganisms (bacteria, viruses, fungi, protozoa, algae) using observable features.",
      "Describe key characteristics and common habitats of each major group of microorganisms, making connections to their presence in household, school, and natural environments.",
      "Demonstrate a positive attitude towards learning about the importance and role of microorganisms in food, health, and agriculture.",
      "Describe the roles of beneficial microorganisms in fermentation (e.g., curd, bread), soil fertility (e.g., nitrogen fixation), and medicine (e.g., antibiotics, vaccines).",
      "Identify and explain common microbial diseases in humans, animals, and plants, including symptoms and methods of transmission.",
      "List and discuss effective methods to prevent the spread of microbial diseases, emphasizing personal and community hygiene.",
      "Demonstrate proper handwashing and hygiene routines, and recommend preventive measures for different scenarios (school, home, public places).",
      "Design and conduct simple controlled experiments to observe microbial growth (e.g., bread mold, yogurt making) and record observations systematically.",
      "Explain the effects of environmental factors (temperature, moisture) on microbial growth, and interpret experimental data.",
      "Show responsibility by promoting safe hygiene practices and spreading awareness among peers and family members.",
      "Reflect on the significance of using beneficial microbes for health, environmental well-being, and sustainable living."
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewSession = (session: any) => {
    setSelectedSession(session);
    setShowPreview(true);
  };

  const handleEditSession = (session: any) => {
    // Navigate to edit page
    navigate(`/session/edit/${session.id}`);
  };

  const handleDeleteSession = (sessionId: number) => {
    // Handle delete functionality
    console.log('Delete session:', sessionId);
  };

  if (showPreview && selectedSession) {
    return (
      <UnitPlanView
        unitPlan={unitPlanData}
        onBack={() => setShowPreview(false)}
        onEdit={() => handleEditSession(selectedSession)}
      />
    );
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
            <Card key={session.id} className="hover:shadow-md transition-shadow">
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

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSession(session)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSession(session)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

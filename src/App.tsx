import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import ToolsDashboard from "./pages/ToolsDashboard";
import LessonPlanAssistant from "./pages/LessonPlanAssistant";
import LessonPlanOutput from "./pages/LessonPlanOutput";
import LessonPlanOptions from "./pages/LessonPlanOptions";
import LessonPlanTraditional from "./pages/LessonPlanTraditional";
import SessionList from "./pages/SessionList";
import CreateSession from "./pages/CreateSession";
import ExamAssistPrep from "./pages/ExamAssistPrep";
import QuestionBundlePreview from "./pages/QuestionBundlePreview";
import SlideGenerator from "./pages/SlideGenerator";
import SlideGeneratorLessonPlan from "./pages/SlideGeneratorLessonPlan";
import SlideGeneratorTemplates from "./pages/SlideGeneratorTemplates";
import AssessmentAssist from "./pages/AssessmentAssist";
import AssessmentCreate from "./pages/AssessmentCreate";
import AssessmentELOSelection from "./pages/AssessmentELOSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/lesson-plan-assistant" element={<LessonPlanAssistant />} />
          <Route path="/exam-assist-prep" element={<ExamAssistPrep />} />
          <Route path="/slide-generator" element={<SlideGenerator />} />
          <Route path="/slide-generator/lesson-plan" element={<SlideGeneratorLessonPlan />} />
          <Route path="/slide-generator/templates" element={<SlideGeneratorTemplates />} />
          <Route path="/assessment-assist" element={<AssessmentAssist />} />
          <Route path="/assessment-assist/create" element={<AssessmentCreate />} />
          <Route path="/assessment-assist/elo-selection" element={<AssessmentELOSelection />} />
          <Route path="/question-bundle/:bundleId" element={<QuestionBundlePreview />} />
          <Route path="/lesson-plan" element={<Index />} />
          <Route path="/lesson-plan-options" element={<LessonPlanOptions />} />
          <Route path="/lesson-plan-output" element={<LessonPlanOutput />} />
          <Route path="/lesson-plan-traditional" element={<LessonPlanTraditional />} />
          <Route path="/session/:id" element={<SessionList />} />
          <Route path="/session/create/:lessonId" element={<CreateSession />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

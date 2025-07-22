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
import SessionPlanPreview from "./pages/SessionPlanPreview";
import SessionPlanOutput from "./pages/SessionPlanOutput";
import UnitPlanPreview from "./pages/UnitPlanPreview";
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
          <Route path="/lesson-plan" element={<Index />} />
          <Route path="/lesson-plan-options" element={<LessonPlanOptions />} />
          <Route path="/lesson-plan-output" element={<LessonPlanOutput />} />
          <Route path="/lesson-plan-traditional" element={<LessonPlanTraditional />} />
          <Route path="/session/:id/:grade/:subject" element={<SessionList />} />
          <Route path="/session/create/:lessonId" element={<CreateSession />} />
          <Route path="/session-plan-preview" element={<SessionPlanPreview />} />
          <Route path="/session-plan-output" element={<SessionPlanOutput />} />
          <Route path="/unit-plan-preview" element={<UnitPlanPreview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

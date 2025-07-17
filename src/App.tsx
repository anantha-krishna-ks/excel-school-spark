import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoleSelection from "./pages/RoleSelection";
import ToolsDashboard from "./pages/ToolsDashboard";
import LessonPlanAssistant from "./pages/LessonPlanAssistant";
import LessonPlanOutput from "./pages/LessonPlanOutput";
import LessonPlanOptions from "./pages/LessonPlanOptions";
import LessonPlanTraditional from "./pages/LessonPlanTraditional";
import SessionList from "./pages/SessionList";
import CreateSession from "./pages/CreateSession";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/lesson-plan-assistant" element={<LessonPlanAssistant />} />
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

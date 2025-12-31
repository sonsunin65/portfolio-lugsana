import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PerformanceEvaluation from "./pages/PerformanceEvaluation";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import ActivityDetail from "./pages/ActivityDetail";
import WorkDetail from "./pages/WorkDetail";
import CertificateDetail from "./pages/CertificateDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/performance-evaluation" element={<PerformanceEvaluation />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/works/:id" element={<WorkDetail />} />
          <Route path="/certificates/:id" element={<CertificateDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

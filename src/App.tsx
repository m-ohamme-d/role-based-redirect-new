import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AdminDashboard from "./pages/admin/Dashboard";
import TeamLeadTeam from "./pages/teamlead/Team";
import TeamLeadTeamDepartment from "./pages/teamlead/TeamDepartment";
import ManagerDashboard from "./pages/manager/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/teamlead/team" element={<TeamLeadTeam />} />
            <Route path="/teamlead/team/:deptId" element={<TeamLeadTeamDepartment />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

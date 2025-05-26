
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Common Pages
import Notifications from "./pages/common/Notifications";
import Reports from "./pages/common/Reports";
import Support from "./pages/common/Support";

// Manager Routes
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerTeam from "./pages/manager/Team";
import ManagerClients from "./pages/manager/Clients";
import ManagerAlerts from "./pages/manager/Alerts";
import ManagerDepartment from "./pages/manager/Department";
import ManagerEmployee from "./pages/manager/Employee";
import ManagerSettings from "./pages/manager/Settings";
import ManagerProfile from "./pages/manager/Profile";

// Team Lead Routes
import TeamLeadLayout from "./pages/teamlead/TeamLeadLayout";
import TeamLeadDashboard from "./pages/teamlead/Dashboard";
import TeamLeadTeam from "./pages/teamlead/Team";
import TeamLeadTeamDepartment from "./pages/teamlead/TeamDepartment";
import TeamLeadClients from "./pages/teamlead/Clients";
import TeamLeadReports from "./pages/teamlead/Reports";
import TeamLeadSettings from "./pages/teamlead/Settings";
import TeamLeadProfile from "./pages/teamlead/Profile";

// Admin Routes
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminDepartments from "./pages/admin/Departments";
import AdminRecords from "./pages/admin/Records";
import AdminAuditLog from "./pages/admin/AuditLog";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="team" element={<ManagerTeam />} />
            <Route path="clients" element={<ManagerClients />} />
            <Route path="alerts" element={<ManagerAlerts />} />
            <Route path="department/:deptId" element={<ManagerDepartment />} />
            <Route path="employee/:employeeId" element={<ManagerEmployee />} />
            <Route path="settings" element={<ManagerSettings />} />
            <Route path="profile" element={<ManagerProfile />} />
            {/* Common Pages */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
          </Route>
          
          {/* Team Lead Routes */}
          <Route path="/teamlead" element={<TeamLeadLayout />}>
            <Route index element={<TeamLeadDashboard />} />
            <Route path="dashboard" element={<TeamLeadDashboard />} />
            <Route path="team" element={<TeamLeadTeam />} />
            <Route path="team/:deptId" element={<TeamLeadTeamDepartment />} />
            <Route path="clients" element={<TeamLeadClients />} />
            <Route path="settings" element={<TeamLeadSettings />} />
            <Route path="profile" element={<TeamLeadProfile />} />
            {/* Common Pages */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="records" element={<AdminRecords />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
            <Route path="settings" element={<AdminSettings />} />
            {/* Common Pages */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
          </Route>
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/teamlead-dashboard" element={<TeamLeadDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

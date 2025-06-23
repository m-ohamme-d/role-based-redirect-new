import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUp, ArrowDown, User, BarChart3, Eye, Bell } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useManagerData } from "@/hooks/useManagerData";
import type { ManagerStats } from "@/hooks/useManagerData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data for charts
const employeeOverviewData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 40 },
];

const employeeProgressData = [
  { name: 'IT', value: 85 },
  { name: 'HR', value: 65 },
  { name: 'Sales', value: 76 },
  { name: 'Marketing', value: 90 },
  { name: 'Finance', value: 70 },
];

// Mock clients data with enhanced structure
const clientsData = [
  { 
    id: 1, 
    name: 'TechCorp Solutions', 
    company: 'TechCorp Inc.', 
    status: 'working',
    projects: [
      { id: 1, name: 'Mobile App Development', status: 'working' },
      { id: 2, name: 'Web Platform Redesign', status: 'working' }
    ]
  },
  { 
    id: 2, 
    name: 'HealthCare Inc', 
    company: 'HealthCare Systems', 
    status: 'working',
    projects: [
      { id: 3, name: 'Patient Management System', status: 'working' },
      { id: 4, name: 'Telemedicine Platform', status: 'stopped' }
    ]
  },
  { 
    id: 3, 
    name: 'Finance Plus', 
    company: 'Financial Services Ltd', 
    status: 'stopped',
    projects: [
      { id: 5, name: 'Trading Platform', status: 'stopped' }
    ]
  },
  { 
    id: 4, 
    name: 'Retail Masters', 
    company: 'Retail Solutions', 
    status: 'working',
    projects: [
      { id: 6, name: 'E-commerce Migration', status: 'working' }
    ]
  },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useManagerData();

  // Local UI state for dialogs
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>;
  }
  if (error) {
    return <div className="text-center p-8">
      <h2 className="text-2xl font-bold">Error loading dashboard</h2>
      <p className="mt-2">{error}</p>
      <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
    </div>;
  }

  // Destructure your real data here.
  const {
    totalEmployees,
    newEmployees,
    departmentCount,
    averagePerformance,
    employeeOverviewData,
    employeeProgressData,
    clientsData,
    departments,
    employeeGrowthText,
    employeeTrend,
    newEmployeeGrowthText,
    newEmployeeTrend,
    performanceChangeText,
    performanceTrend
  } = stats as ManagerStats;

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    setShowClientDialog(true);
  };
  const handleViewAllClients = () => {
    navigate('/manager/clients');
  };
  const toggleProjectStatus = (projectId: number) => {
    if (selectedClient) {
      const updated = selectedClient.projects.map((p: any) =>
        p.id === projectId
          ? { ...p, status: p.status === 'working' ? 'stopped' : 'working' }
          : p
      );
      setSelectedClient({ ...selectedClient, projects: updated });
      toast.success('Project status updated');
    }
  };

  // Add robust exportToStyledPDF for manager dashboard
  const exportToStyledPDF = (data, filename = 'manager_dashboard_report') => {
    if (!data || data.length === 0) {
      toast.error('No data to export!');
      return;
    }
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'l' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logo = new window.Image();
    logo.src = '/your-logo.svg';
    logo.crossOrigin = 'anonymous';
    let startY = margin;
    logo.onload = () => {
      const logoW = 80;
      const logoH = (logo.height / logo.width) * logoW;
      doc.addImage(logo, 'PNG', margin, margin, logoW, logoH);
      startY += logoH + 20;
      drawTableAndSave();
    };
    logo.onerror = () => {
      drawTableAndSave();
    };
    setTimeout(() => {
      if (!logo.complete) return;
      drawTableAndSave();
    }, 500);
    function drawTableAndSave() {
      doc.setFontSize(18);
      doc.setTextColor('#333');
      doc.text(
        'Manager Dashboard Report',
        pageWidth / 2,
        startY,
        { align: 'center' }
      );
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - margin,
        startY,
        { align: 'right' }
      );
      // Example: use employeeOverviewData or similar for the table
      const head = [Object.keys((data && data[0]) || {})];
      const body = data.map(r => head[0].map(k => String(r[k] ?? '')));
      autoTable(doc, {
        head,
        body,
        startY: startY + 20,
        theme: 'striped',
        headStyles: { fillColor: [41,128,185], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, textColor: 50 },
        styles: { cellPadding: 6, halign: 'left', valign: 'middle' },
        margin: { left: margin, right: margin },
        didDrawPage: (dataArg) => {
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(9);
          doc.setTextColor('#999');
          doc.text(
            `Page ${dataArg.pageNumber} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        },
      });
      doc.save(`${filename}.pdf`);
      toast.success('PDF report generated and downloaded successfully');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header + Alerts */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Send Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Send Performance Alert</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Send performance report reminders to all Team Leads
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAlertsDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Performance report alert sent to all Team Leads');
                  setShowAlertsDialog(false);
                }}>
                  Send Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={<Users size={24} />}
          change={`${employeeGrowthText}`}
          trend={employeeTrend}
        />
        <StatCard
          title="New Employees"
          value={newEmployees.toString()}
          icon={<User size={24} />}
          change={`${newEmployeeGrowthText}`}
          trend={newEmployeeTrend}
        />
        <StatCard
          title="Departments"
          value={departmentCount.toString()}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Avg. Performance"
          value={`${averagePerformance}%`}
          icon={<BarChart3 size={24} />}
          change={`${performanceChangeText}`}
          trend={performanceTrend}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={employeeOverviewData}
          title="Employee Overview"
          subtitle="Employee count over time"
        />
        <BarChart
          data={employeeProgressData}
          title="Department Performance"
          subtitle="Avg. performance by department"
        />
      </div>

      {/* Client Portfolio */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Portfolio</CardTitle>
            <Button
              onClick={handleViewAllClients}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All Clients
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientsData.map(client => (
              <Card
                key={client.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleClientClick(client)}
              >
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.company}</p>
                  <Badge
                    variant={client.status === 'working' ? 'default' : 'destructive'}
                    className={client.status === 'working' ? 'bg-green-500' : 'bg-red-500'}
                  >
                    {client.status === 'working' ? 'Working' : 'Stopped'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card>
        <CardHeader><CardTitle>Department Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => (
              <Card
                key={dept.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <Link to={`/manager/department/${dept.id}`}>
                    <h3 className="font-semibold">{dept.name}</h3>
                    <p className="text-sm text-gray-500">
                      {dept.employeeCount} employees
                    </p>
                  </Link>
                  <div className={`flex items-center mt-2 text-sm font-medium ${
                    dept.trend === 'up' ? 'text-green-500' :
                    dept.trend === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {dept.growth}
                    {dept.trend === 'up' && <ArrowUp size={16} className="ml-1" />}
                    {dept.trend === 'down' && <ArrowDown size={16} className="ml-1" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Projects Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name} - Projects</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedClient?.projects.map((project: any) => (
              <Card key={project.id}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge
                      variant={project.status === 'working' ? 'default' : 'destructive'}
                      className={project.status === 'working' ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {project.status === 'working' ? 'Working' : 'Stopped'}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleProjectStatus(project.id)}
                  >
                    Mark as {project.status === 'working' ? 'Stopped' : 'Working'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDashboard;

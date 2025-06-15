
import { useState } from 'react';
import { Users, User, BarChart3 } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router-dom";
import ClientPortfolioCard from "@/components/manager/ClientPortfolioCard";
import DepartmentOverviewCard from "@/components/manager/DepartmentOverviewCard";
import PerformanceAlertDialog from "@/components/manager/PerformanceAlertDialog";

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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  
  const departments = [
    { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' as const },
    { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' as const },
    { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' as const },
    { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' as const },
    { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' as const },
  ];

  const handleViewAllClients = () => {
    navigate('/manager/clients');
    console.log('Navigating to full client portfolio');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <div className="flex gap-2">
          <PerformanceAlertDialog 
            open={showAlertsDialog} 
            onOpenChange={setShowAlertsDialog} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees"
          value="107"
          icon={<Users size={24} />}
          change="+5.3% from last month"
          trend="up"
        />
        <StatCard 
          title="New Employees"
          value="12"
          icon={<User size={24} />}
          change="+2 from last week"
          trend="up"
        />
        <StatCard 
          title="Departments"
          value={departments.length.toString()}
          icon={<Users size={24} />}
        />
        <StatCard 
          title="Average Performance"
          value="78%"
          icon={<BarChart3 size={24} />}
          change="+2.5% from last quarter"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={employeeOverviewData} 
          title="Employee Overview" 
          subtitle="Employee count over time"
        />
        <BarChart 
          data={employeeProgressData} 
          title="Department Performance" 
          subtitle="Average performance by department"
        />
      </div>

      <ClientPortfolioCard onViewAllClients={handleViewAllClients} />
      <DepartmentOverviewCard departments={departments} />
    </div>
  );
};

export default ManagerDashboard;

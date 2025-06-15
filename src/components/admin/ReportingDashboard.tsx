
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Download, TrendingUp, Users, FolderOpen, Building } from 'lucide-react';
import { useReportingData } from '@/hooks/useReportingData';
import BarChart from '@/components/charts/BarChart';
import { toast } from 'sonner';

const ReportingDashboard = () => {
  const { metrics, loading, generateReport } = useReportingData();

  const handleDownloadReport = (type: 'clients' | 'projects' | 'departments' | 'activity') => {
    const report = generateReport(type);
    if (report) {
      // Create a simple text report for download
      const reportContent = `
${report.title}
Generated: ${new Date().toLocaleDateString()}

Data Summary:
${JSON.stringify(report.data, null, 2)}

Charts:
${report.charts.map(chart => `
${chart.title}:
${chart.data.map((item: any) => `  ${item.name || item.department}: ${item.value || item.count}`).join('\n')}
`).join('\n')}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No reporting data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{metrics.clientMetrics.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-green-600">
                {metrics.clientMetrics.activeClients} Active
              </Badge>
              <Badge variant="outline" className="text-red-600">
                {metrics.clientMetrics.inactiveClients} Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{metrics.projectMetrics.totalProjects}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-green-600">
                {metrics.projectMetrics.activeProjects} Active
              </Badge>
              <Badge variant="outline" className="text-blue-600">
                {metrics.projectMetrics.completedProjects} Done
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold">{metrics.departmentMetrics.totalDepartments}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline">
                {metrics.departmentMetrics.totalMembers} Total Members
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Activity</p>
                <p className="text-2xl font-bold">{metrics.activityMetrics.totalAuditLogs}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-orange-600">
                {metrics.activityMetrics.recentActions} Recent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Clients by Department
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('clients')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart
              data={metrics.clientMetrics.clientsByDepartment.map(item => ({
                name: item.department,
                value: item.count
              }))}
              title=""
              subtitle=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Projects by Department
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('projects')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart
              data={metrics.projectMetrics.projectsByDepartment.map(item => ({
                name: item.department,
                value: item.count
              }))}
              title=""
              subtitle=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Department Sizes
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('departments')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart
              data={metrics.departmentMetrics.departmentSizes.map(dept => ({
                name: dept.name,
                value: dept.memberCount
              }))}
              title=""
              subtitle=""
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top System Actions
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('activity')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart
              data={metrics.activityMetrics.topActions.map(action => ({
                name: action.action,
                value: action.count
              }))}
              title=""
              subtitle=""
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Report Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'clients', label: 'Client Analytics', icon: Users, color: 'blue' },
              { type: 'projects', label: 'Project Analytics', icon: FolderOpen, color: 'green' },
              { type: 'departments', label: 'Department Analytics', icon: Building, color: 'purple' },
              { type: 'activity', label: 'Activity Analytics', icon: TrendingUp, color: 'orange' }
            ].map(({ type, label, icon: Icon, color }) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleDownloadReport(type as any)}
              >
                <Icon className={`h-6 w-6 text-${color}-600`} />
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingDashboard;

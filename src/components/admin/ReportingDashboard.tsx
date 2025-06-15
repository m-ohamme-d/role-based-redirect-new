
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
          <Card key={i} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
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
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Clients</p>
                <p className="text-2xl font-bold text-blue-800">{metrics.clientMetrics.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                {metrics.clientMetrics.activeClients} Active
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                {metrics.clientMetrics.inactiveClients} Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-green-800">{metrics.projectMetrics.totalProjects}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                {metrics.projectMetrics.activeProjects} Active
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                {metrics.projectMetrics.completedProjects} Done
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Departments</p>
                <p className="text-2xl font-bold text-purple-800">{metrics.departmentMetrics.totalDepartments}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                {metrics.departmentMetrics.totalMembers} Total Members
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">System Activity</p>
                <p className="text-2xl font-bold text-orange-800">{metrics.activityMetrics.totalAuditLogs}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                {metrics.activityMetrics.recentActions} Recent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Clients by Department
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('clients')}
                className="flex items-center gap-2 hover:bg-blue-50"
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

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Projects by Department
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('projects')}
                className="flex items-center gap-2 hover:bg-green-50"
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

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Department Sizes
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('departments')}
                className="flex items-center gap-2 hover:bg-purple-50"
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

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Top System Actions
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('activity')}
                className="flex items-center gap-2 hover:bg-orange-50"
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
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-gray-600" />
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
                className={`h-auto p-4 flex flex-col items-center gap-2 hover:bg-${color}-50 border-${color}-200`}
                onClick={() => handleDownloadReport(type as any)}
              >
                <Icon className={`h-6 w-6 text-${color}-600`} />
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingDashboard;

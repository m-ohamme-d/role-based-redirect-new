// src/pages/admin/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, FileText, Activity } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { Link } from "react-router-dom";
import { useAdminData } from "@/hooks/useAdminData";
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const mockUserActivityData = [
	{ name: "Jan", value: 45 },
	{ name: "Feb", value: 52 },
	{ name: "Mar", value: 48 },
	{ name: "Apr", value: 65 },
	{ name: "May", value: 58 },
	{ name: "Jun", value: 72 },
	{ name: "Jul", value: 75 },
];
const mockUserDistributionData = [
	{ name: "Admin", value: 5 },
	{ name: "Manager", value: 15 },
	{ name: "Team Lead", value: 25 },
	{ name: "User", value: 85 },
];
const mockRecentActivities = [
	{
		user: "Robert Manager",
		action: "added a new team member",
		time: "2 hours ago",
		color: "bg-green-500",
	},
	{
		user: "Sarah Lead",
		action: "updated performance ratings",
		time: "5 hours ago",
		color: "bg-blue-500",
	},
	{
		user: "Emily Davis",
		action: "registered",
		time: "1 day ago",
		color: "bg-purple-500",
	},
];
const mockSystemHealth = [
	{
		label: "Server Uptime",
		value: "99.98%",
		percent: "99%",
		color: "bg-green-500",
	},
	{
		label: "Storage Used",
		value: "72%",
		percent: "72%",
		color: "bg-blue-500",
	},
	{
		label: "Error Rate",
		value: "0.3%",
		percent: "0.3%",
		color: "bg-red-500",
	},
];

const AdminDashboard = () => {
	const { departments, users, loading, error } = useAdminData();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
					<p className="mt-4 text-gray-600">Loading admin dashboard...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Error Loading Dashboard
					</h2>
					<p className="text-gray-600">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 text-blue-600 hover:underline"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
				<Link
					to="/admin/settings"
					className="text-blue-600 hover:underline text-sm font-medium"
				>
					System Settings
				</Link>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle>Total Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{users.length}</div>
					</CardContent>
				</Card>
				<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle>System Security</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<Shield size={24} />
							<div>
								<div className="text-2xl font-bold text-gray-900">99.8%</div>
								<p className="text-sm text-gray-600">No recent threats</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle>Locked Records</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<FileText size={24} />
							<div>
								<div className="text-2xl font-bold text-gray-900">
									{/* {lockedRecords} */}
								</div>
								<p className="text-sm text-gray-600">+5 from last week</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle>Audit Logs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<Activity size={24} />
							<div>
								<div className="text-2xl font-bold text-gray-900">
									{/* {auditLogs} */}
								</div>
								<p className="text-sm text-gray-600">+36 today</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<LineChart
					data={mockUserActivityData}
					title="User Activity"
					subtitle="Active users over time"
				/>
				<BarChart
					data={mockUserDistributionData}
					title="User Distribution"
					subtitle="Users by role"
				/>
			</div>

			{/* Bottom Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle>Recent User Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{mockRecentActivities.map((activity, idx) => (
								<div
									key={idx}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
								>
									<div
										className={`w-2 h-2 ${activity.color} rounded-full`}
									/>
									<p className="text-sm">
										<span className="font-medium">{activity.user}</span>{" "}
										{activity.action}
									</p>
									<span className="text-xs text-gray-500 ml-auto">
										{activity.time}
									</span>
								</div>
							))}
						</div>
						<div className="mt-4 text-center">
							<Link
								to="/admin/audit-log"
								className="text-blue-600 hover:underline text-sm"
							>
								View All Activity
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
					<CardHeader>
						<CardTitle>System Health</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{mockSystemHealth.map((item, idx) => (
								<div key={idx}>
									<div className="flex justify-between mb-1">
										<span className="text-sm font-medium">{item.label}</span>
										<span className="text-sm font-medium">{item.value}</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`${item.color} h-2 rounded-full`}
											style={{ width: item.percent }}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Export Button */}
			<div className="flex justify-end">
				<button
					onClick={() => exportToStyledPDF(mockUserActivityData)}
					className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all"
				>
					Export to PDF
				</button>
			</div>
		</div>
	);
};

// Add robust exportToStyledPDF for admin dashboard
const exportToStyledPDF = (data, filename = 'admin_dashboard_report') => {
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
      'Admin Dashboard Report',
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
    // Example: use mockUserActivityData or similar for the table
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
}

export default AdminDashboard;

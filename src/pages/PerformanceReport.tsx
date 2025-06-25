
import React, { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for demonstration
const mockPerformanceData = [
  {
    id: '1',
    employee_name: 'John Doe',
    designation: 'Software Engineer',
    department: 'IT',
    team_lead: 'Jane Smith',
    rating: 4.5,
    period: 'Current',
    avatar_url: '/placeholder.svg',
    team_lead_avatar: '/placeholder.svg'
  },
  {
    id: '2',
    employee_name: 'Alice Johnson',
    designation: 'Marketing Specialist',
    department: 'Marketing',
    team_lead: 'Bob Wilson',
    rating: 4.2,
    period: 'Current',
    avatar_url: '/placeholder.svg',
    team_lead_avatar: '/placeholder.svg'
  },
  {
    id: '3',
    employee_name: 'Mike Chen',
    designation: 'HR Manager',
    department: 'HR',
    team_lead: 'Sarah Davis',
    rating: 4.8,
    period: 'Current',
    avatar_url: '/placeholder.svg',
    team_lead_avatar: '/placeholder.svg'
  },
  {
    id: '4',
    employee_name: 'Emily Rodriguez',
    designation: 'Sales Representative',
    department: 'Sales',
    team_lead: 'David Brown',
    rating: 4.1,
    period: 'Current',
    avatar_url: '/placeholder.svg',
    team_lead_avatar: '/placeholder.svg'
  },
  {
    id: '5',
    employee_name: 'James Wilson',
    designation: 'Finance Analyst',
    department: 'Finance',
    team_lead: 'Lisa Anderson',
    rating: 4.6,
    period: 'Current',
    avatar_url: '/placeholder.svg',
    team_lead_avatar: '/placeholder.svg'
  }
]

export const PerformanceReport: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['performance_ratings', 'current'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockPerformanceData
    }
  })

  const exportToPDF = async () => {
    if (!reportRef.current) {
      alert('Report area not rendered yet.')
      return
    }

    // Ensure it's visible / painted
    reportRef.current.scrollIntoView()
    await new Promise(r => setTimeout(r, 100)) // let layout settle

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'pt', 'a4')
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
      pdf.save('performance-report.pdf')
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('Could not generate PDF. See console for details.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performance report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Report</h2>
            <p className="text-gray-600">{(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Performance Report
            </h1>
            <p className="text-gray-600 mt-2">Current performance ratings and analytics</p>
          </div>
          <Button
            onClick={exportToPDF}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!data || data.length === 0}
          >
            <FileDown className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
        </div>

        <Card className="shadow-lg border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Performance Data ({data?.length || 0} employees)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Only this div is captured by html2canvas */}
            <div ref={reportRef} className="bg-white rounded-lg p-4">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Employee Performance Report</h2>
                <p className="text-gray-600">Period: Current Quarter</p>
              </div>

              {data && data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Photo</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Team Lead</TableHead>
                      <TableHead className="text-center">Rating</TableHead>
                      <TableHead className="text-center">Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <img
                            src={r.avatar_url}
                            alt={r.employee_name}
                            crossOrigin="anonymous"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{r.employee_name}</TableCell>
                        <TableCell>{r.designation}</TableCell>
                        <TableCell>{r.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <img
                              src={r.team_lead_avatar}
                              alt={r.team_lead}
                              crossOrigin="anonymous"
                              className="w-8 h-8 rounded-full mr-2 object-cover"
                            />
                            <span>{r.team_lead}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              r.rating >= 4
                                ? 'bg-green-100 text-green-800'
                                : r.rating >= 3
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            ⭐ {r.rating}
                          </span>
                        </TableCell>
                        <TableCell className="text-center capitalize">{r.period}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border">
                  <p className="text-lg font-medium">No performance data available</p>
                  <p className="text-sm mt-2">Please check back later or contact your administrator</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerformanceReport

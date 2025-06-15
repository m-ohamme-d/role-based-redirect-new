
import React, { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for demonstration since we don't have the required tables yet
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

  // For now, we'll use mock data. Later this can be replaced with actual Supabase queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['performance_ratings', 'current'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Performance data loaded:', mockPerformanceData)
      return mockPerformanceData
    }
  })

  const exportToPDF = async () => {
    if (!reportRef.current) {
      console.error('Report reference not found')
      return
    }

    if (!data || data.length === 0) {
      console.error('No data available for PDF export')
      alert('No data available to export')
      return
    }

    try {
      console.log('Starting PDF export with data:', data)
      console.log('Report element:', reportRef.current)
      
      // Wait a bit to ensure the content is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = await html2canvas(reportRef.current, { 
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        logging: true
      })
      
      console.log('Canvas created, dimensions:', canvas.width, 'x', canvas.height)
      
      const imgData = canvas.toDataURL('image/png')
      console.log('Image data created, length:', imgData.length)
      
      const pdf = new jsPDF('l', 'pt', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('performance-report.pdf')
      
      console.log('PDF export completed successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
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
            <p className="text-gray-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log('Rendering with data:', data)

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
          
          <div className="flex space-x-3">
            <Button
              onClick={exportToPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!data || data.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Performance Data ({data?.length || 0} employees)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={reportRef}
              className="bg-white rounded-lg p-4"
              style={{ minHeight: '400px' }}
            >
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Employee Performance Report</h2>
                <p className="text-gray-600">Period: Current Quarter</p>
              </div>
              
              {data && data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-gray-800">Photo</TableHead>
                      <TableHead className="font-bold text-gray-800">Employee</TableHead>
                      <TableHead className="font-bold text-gray-800">Designation</TableHead>
                      <TableHead className="font-bold text-gray-800">Department</TableHead>
                      <TableHead className="font-bold text-gray-800">Team Lead</TableHead>
                      <TableHead className="font-bold text-gray-800 text-center">Rating</TableHead>
                      <TableHead className="font-bold text-gray-800 text-center">Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold border-2 border-blue-200">
                            {r.employee_name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">{r.employee_name}</TableCell>
                        <TableCell className="text-gray-600">{r.designation}</TableCell>
                        <TableCell className="text-gray-600">{r.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold mr-3 border border-gray-300">
                              {r.team_lead.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-gray-700">{r.team_lead}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            r.rating >= 4 ? 'bg-green-100 text-green-800 border border-green-200' :
                            r.rating >= 3 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            ⭐ {r.rating}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-gray-600 capitalize font-medium">{r.period}</TableCell>
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

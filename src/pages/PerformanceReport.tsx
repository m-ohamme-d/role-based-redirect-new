
import React, { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Download } from "lucide-react"

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
      return mockPerformanceData
    }
  })

  const exportToPDF = async () => {
    if (!reportRef.current) return
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'pt', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      pdf.save('performance-report.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
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
              Performance Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={reportRef}
              className="overflow-x-auto"
            >
              <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <th className="p-4 text-left font-semibold text-gray-800 border-b">Photo</th>
                    <th className="p-4 text-left font-semibold text-gray-800 border-b">Employee</th>
                    <th className="p-4 text-left font-semibold text-gray-800 border-b">Designation</th>
                    <th className="p-4 text-left font-semibold text-gray-800 border-b">Department</th>
                    <th className="p-4 text-left font-semibold text-gray-800 border-b">Team Lead</th>
                    <th className="p-4 text-center font-semibold text-gray-800 border-b">Rating</th>
                    <th className="p-4 text-center font-semibold text-gray-800 border-b">Period</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 border-b">
                          <img
                            src={r.avatar_url || "/placeholder.svg"}
                            alt={r.employee_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        </td>
                        <td className="p-4 border-b font-medium text-gray-800">{r.employee_name}</td>
                        <td className="p-4 border-b text-gray-600">{r.designation}</td>
                        <td className="p-4 border-b text-gray-600">{r.department}</td>
                        <td className="p-4 border-b">
                          <div className="flex items-center">
                            <img
                              src={r.team_lead_avatar || "/placeholder.svg"}
                              alt={r.team_lead}
                              className="w-8 h-8 rounded-full mr-3 object-cover border border-gray-200"
                            />
                            <span className="text-gray-700">{r.team_lead}</span>
                          </div>
                        </td>
                        <td className="p-4 border-b text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            r.rating >= 4 ? 'bg-green-100 text-green-800' :
                            r.rating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {r.rating}
                          </span>
                        </td>
                        <td className="p-4 border-b text-center text-gray-600 capitalize">{r.period}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No performance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerformanceReport

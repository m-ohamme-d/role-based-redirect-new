
import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartDateFilter from './ChartDateFilter';

interface LineChartProps {
  data: any[];
  title: string;
  subtitle?: string;
}

const LineChart = ({ data, title, subtitle }: LineChartProps) => {
  const [currentFilter, setCurrentFilter] = useState('monthly');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
    console.log('LineChart data updated:', data);
  }, [data]);

  const handleFilterChange = (period: string, customRange?: { start: Date; end: Date }) => {
    setCurrentFilter(period);
    console.log(`LineChart ${title} - applying filter:`, period, customRange);
    
    // Improved filter logic with better data handling
    let filtered = [...data];
    
    switch (period) {
      case 'daily':
        // Show last 7 days of data
        filtered = data.slice(-7);
        console.log('Daily filter applied - showing last 7 entries');
        break;
      case 'weekly':
        // Show last 4 weeks of data
        filtered = data.slice(-4);
        console.log('Weekly filter applied - showing last 4 entries');
        break;
      case 'monthly':
        // Show all monthly data (default)
        filtered = data;
        console.log('Monthly filter applied - showing all data');
        break;
      case 'yearly':
        // Group by year (simplified for demo)
        filtered = data.slice(-12);
        console.log('Yearly filter applied - showing last 12 entries');
        break;
      case 'custom':
        // Custom range filtering would need actual date data
        if (customRange) {
          console.log('Custom filter applied:', customRange);
          // In a real app, you'd filter based on actual dates
          // For now, just use all data
          filtered = data;
        }
        break;
      default:
        filtered = data;
    }
    
    setFilteredData(filtered);
    console.log(`LineChart ${title} filtered data:`, filtered);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      <ChartDateFilter 
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
      />
      
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#1d4ed8' }}
              name="Value"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;


import { useState } from 'react';
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

  const handleFilterChange = (period: string, customRange?: { start: Date; end: Date }) => {
    setCurrentFilter(period);
    
    // Filter logic based on period
    let filtered = [...data];
    
    switch (period) {
      case 'daily':
        // Show last 7 days of data
        filtered = data.slice(-7);
        break;
      case 'weekly':
        // Show last 4 weeks of data
        filtered = data.slice(-4);
        break;
      case 'monthly':
        // Show all monthly data (default)
        filtered = data;
        break;
      case 'yearly':
        // Group by year (simplified for demo)
        filtered = data.slice(-12);
        break;
      case 'custom':
        // Custom range filtering would need actual date data
        if (customRange) {
          console.log('Applying custom filter:', customRange);
          // In a real app, you'd filter based on actual dates
          filtered = data;
        }
        break;
      default:
        filtered = data;
    }
    
    setFilteredData(filtered);
    console.log(`LineChart ${title} filtered by ${period}:`, filtered);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      
      <ChartDateFilter 
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
      />
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;

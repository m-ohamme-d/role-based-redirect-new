
import { useState } from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DropdownDateFilter from './DropdownDateFilter';

interface BarChartProps {
  data: any[];
  title: string;
  subtitle?: string;
}

const BarChart = ({ data, title, subtitle }: BarChartProps) => {
  const [currentFilter, setCurrentFilter] = useState('month');
  const [filteredData, setFilteredData] = useState(data);

  const handleFilterChange = (period: string, customRange?: { start: Date; end: Date }) => {
    setCurrentFilter(period);
    
    // Filter logic based on period
    let filtered = [...data];
    
    switch (period) {
      case 'month':
        // Show monthly data (default)
        filtered = data;
        break;
      case 'quarter':
        // Show last 3 months of data
        filtered = data.slice(-3);
        break;
      case 'year':
        // Show yearly data (simplified for demo)
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
    console.log(`BarChart ${title} filtered by ${period}:`, filtered);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <DropdownDateFilter 
          onFilterChange={handleFilterChange}
          currentFilter={currentFilter}
        />
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;

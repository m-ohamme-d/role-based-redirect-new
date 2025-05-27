
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Filter, Clock, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ChartDateFilterProps {
  onFilterChange: (period: string, customRange?: { start: Date; end: Date }) => void;
  currentFilter: string;
}

const ChartDateFilter = ({ onFilterChange, currentFilter }: ChartDateFilterProps) => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filterOptions = [
    { value: 'daily', label: 'Daily', icon: '1D', color: 'bg-blue-500' },
    { value: 'weekly', label: 'Weekly', icon: '1W', color: 'bg-green-500' },
    { value: 'monthly', label: 'Monthly', icon: '1M', color: 'bg-purple-500' },
    { value: 'yearly', label: 'Yearly', icon: '1Y', color: 'bg-orange-500' },
    { value: 'custom', label: 'Custom', icon: '📅', color: 'bg-gray-500' }
  ];

  const handleFilterClick = (filterValue: string) => {
    console.log('Filter clicked:', filterValue);
    
    if (filterValue === 'custom') {
      setShowCustomDialog(true);
    } else {
      onFilterChange(filterValue);
      console.log('Chart filter applied:', filterValue);
      toast.success(`Chart filtered by ${filterValue} view`);
    }
  };

  const handleCustomRangeSubmit = () => {
    if (!customStartDate || !customEndDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    const startDate = new Date(customStartDate);
    const endDate = new Date(customEndDate);

    if (startDate > endDate) {
      toast.error('Start date cannot be after end date');
      return;
    }

    onFilterChange('custom', { start: startDate, end: endDate });
    console.log('Custom date range applied:', { start: startDate, end: endDate });
    toast.success(`Custom range applied: ${customStartDate} to ${customEndDate}`);
    setShowCustomDialog(false);
  };

  const getCurrentFilterLabel = () => {
    const currentOption = filterOptions.find(option => option.value === currentFilter);
    return currentOption ? currentOption.label : 'Monthly';
  };

  return (
    <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Time Range:</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 bg-white rounded-lg p-1 border shadow-sm">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => handleFilterClick(option.value)}
            className={`
              relative px-3 py-2 text-xs font-medium transition-all duration-200 rounded-md
              ${currentFilter === option.value 
                ? `${option.color} text-white shadow-md transform scale-105` 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
            {currentFilter === option.value && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2 border-current"></div>
            )}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        <Filter className="h-3 w-3" />
        <span>Active: {getCurrentFilterLabel()}</span>
      </div>

      {/* Custom Date Range Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Custom Date Range
            </DialogTitle>
            <DialogDescription>
              Select a custom date range to filter the chart data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-sm font-medium">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomRangeSubmit} className="bg-blue-600 hover:bg-blue-700">
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChartDateFilter;

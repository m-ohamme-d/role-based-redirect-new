
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Filter } from 'lucide-react';
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
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterClick = (filterValue: string) => {
    if (filterValue === 'custom') {
      setShowCustomDialog(true);
    } else {
      onFilterChange(filterValue);
      console.log('Chart filter applied:', filterValue);
      toast.success(`Chart filtered by ${filterValue}`);
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
    toast.success(`Chart filtered by custom range: ${customStartDate} to ${customEndDate}`);
    setShowCustomDialog(false);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Filter className="h-4 w-4 text-gray-600" />
      <div className="flex gap-1">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={currentFilter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(option.value)}
            className="text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Custom Date Range Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Custom Date Range
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomRangeSubmit}>
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

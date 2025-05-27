
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownDateFilterProps {
  onFilterChange: (period: string, customRange?: { start: Date; end: Date }) => void;
  currentFilter: string;
}

const DropdownDateFilter = ({ onFilterChange, currentFilter }: DropdownDateFilterProps) => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filterOptions = [
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const handleFilterClick = (filterValue: string) => {
    if (filterValue === 'custom') {
      setShowCustomDialog(true);
    } else {
      onFilterChange(filterValue);
      console.log('Chart filter applied:', filterValue);
      toast.success(`Chart filtered by ${filterOptions.find(f => f.value === filterValue)?.label}`);
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

  const getCurrentLabel = () => {
    if (currentFilter === 'custom') {
      return customStartDate && customEndDate 
        ? `${customStartDate} to ${customEndDate}`
        : 'Custom Date Range';
    }
    return filterOptions.find(f => f.value === currentFilter)?.label || 'This Month';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 min-w-[160px] justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{getCurrentLabel()}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] bg-white border shadow-lg">
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleFilterClick(option.value)}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-sm">{option.label}</span>
              {currentFilter === option.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
};

export default DropdownDateFilter;

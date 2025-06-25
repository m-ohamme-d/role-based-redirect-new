
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

interface PerformanceAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PerformanceAlertDialog = ({ open, onOpenChange }: PerformanceAlertDialogProps) => {
  const handleSendAlert = () => {
    toast.success('Performance report alert sent to all Team Leads');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Send Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Performance Alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send performance report reminders to all Team Leads
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendAlert}>
              Send Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceAlertDialog;

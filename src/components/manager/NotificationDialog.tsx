
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTeams: number[];
  teams: any[];
  notificationText: string;
  setNotificationText: (text: string) => void;
  reminderDate: string;
  setReminderDate: (date: string) => void;
}

const NotificationDialog = ({
  showDialog,
  onOpenChange,
  selectedTeams,
  teams,
  notificationText,
  setNotificationText,
  reminderDate,
  setReminderDate
}: NotificationDialogProps) => {
  const handleSendNotification = () => {
    if (selectedTeams.length === 0) {
      toast.error('Please select teams to notify');
      return;
    }

    if (!notificationText.trim()) {
      toast.error('Please enter notification text');
      return;
    }

    const selectedTeamNames = teams
      .filter(team => selectedTeams.includes(team.id))
      .map(team => team.name)
      .join(', ');

    toast.success(`Notification sent to ${selectedTeams.length} team leads: ${selectedTeamNames}`);
    
    if (reminderDate) {
      toast.success(`Reminder set for ${reminderDate}`);
    }

    onOpenChange(false);
    setNotificationText('');
    setReminderDate('');
  };

  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2"
          disabled={selectedTeams.length === 0}
        >
          <Bell className="h-4 w-4" />
          Notify
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={notificationText}
              onChange={(e) => setNotificationText(e.target.value)}
              placeholder="Enter notification message..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Reminder Date (Optional)</label>
            <Input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>
              Send Notification
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;

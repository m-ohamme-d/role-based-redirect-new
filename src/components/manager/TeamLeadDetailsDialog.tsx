
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface TeamLeadDetailsDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTeamLead: any;
  onSendMessage: (teamLead: any) => void;
}

const TeamLeadDetailsDialog = ({ 
  showDialog, 
  onOpenChange, 
  selectedTeamLead, 
  onSendMessage 
}: TeamLeadDetailsDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Team Lead Details</DialogTitle>
        </DialogHeader>
        {selectedTeamLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {selectedTeamLead.lead?.split(' ').map((n: string) => n[0]).join('') || 'TL'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedTeamLead.lead}</h3>
                <p className="text-sm text-gray-600">Team Lead - {selectedTeamLead.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p>{selectedTeamLead.leadEmail || `${selectedTeamLead.lead?.toLowerCase().replace(' ', '.')}@company.com`}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p>{selectedTeamLead.leadPhone || '+1 (555) 000-0000'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p>{selectedTeamLead.department}</p>
              </div>
            </div>
            
            <div className="pt-3">
              <Button 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  onOpenChange(false);
                  onSendMessage(selectedTeamLead);
                  toast.success('Notification draft created');
                }}
              >
                <Send className="h-4 w-4" />
                Send Direct Message
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TeamLeadDetailsDialog;

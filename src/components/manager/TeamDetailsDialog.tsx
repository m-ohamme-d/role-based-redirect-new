
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users } from 'lucide-react';
import TeamPerformanceRating from '@/components/TeamPerformanceRating';

interface TeamDetailsDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTeam: any;
  onRatingUpdate: (memberId: string, category: string, rating: number) => void;
}

const TeamDetailsDialog = ({ 
  showDialog, 
  onOpenChange, 
  selectedTeam, 
  onRatingUpdate 
}: TeamDetailsDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedTeam?.name} - Team Performance Rating</DialogTitle>
        </DialogHeader>
        {selectedTeam && selectedTeam.members && selectedTeam.members.length > 0 && (
          <TeamPerformanceRating
            members={selectedTeam.members.map((member: any) => ({
              id: member.id.toString(),
              name: member.name,
              position: member.position,
              department: selectedTeam.department,
              ratings: member.ratings
            }))}
            onRatingUpdate={onRatingUpdate}
          />
        )}
        {selectedTeam && (!selectedTeam.members || selectedTeam.members.length === 0) && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No team members assigned to this team yet.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailsDialog;

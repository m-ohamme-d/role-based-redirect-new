import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { downloadTeamReportPDF } from "@/utils/downloadTeamReport";

// Using Team Lead's data from TeamDepartment page
const teamMembers = [
  { 
    id: 101, 
    name: 'John Smith', 
    designation: 'Senior Developer', 
    avatar: null,
    ratings: {
      productivity: 95,
      collaboration: 88,
      timeliness: 92,
      overall: 92
    }
  },
  { 
    id: 102, 
    name: 'Emily Wilson', 
    designation: 'UX Designer', 
    avatar: null,
    ratings: {
      productivity: 90,
      collaboration: 95,
      timeliness: 85,
      overall: 90
    }
  },
  { 
    id: 103, 
    name: 'Michael Brown', 
    designation: 'Backend Developer', 
    avatar: null,
    ratings: {
      productivity: 88,
      collaboration: 90,
      timeliness: 94,
      overall: 91
    }
  }
];

export default function TeamLeadReports() {
  const { profile } = useAuth();
  const [generating, setGenerating] = useState(false);

  // TeamLead-only: direct PDF download (no /export navigation)
  const handleDownload = async (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    try {
      setGenerating(true);
      
      // Use the exact rows the Team List renders
      const rows = teamMembers.map(member => ({
        id: member.id,
        name: member.name,
        designation: member.designation,
        photo: member.avatar,
        rating: member.ratings.overall,
        notes: `Productivity: ${member.ratings.productivity}%, Collaboration: ${member.ratings.collaboration}%, Timeliness: ${member.ratings.timeliness}%`
      }));

      await downloadTeamReportPDF(rows, {
        title: "Team Performance Report",
        departmentId: "IT Department",     // Team Lead is in IT department
        dateFrom: "",                      // Could add date filter state here
        dateTo: "",                        // Could add date filter state here
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setGenerating(false);
    }

  };

  return (
    <Card className="p-6">
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <div className="space-y-4">
          <Button 
            type="button" 
            onClick={handleDownload} 
            disabled={generating}
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Report"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Bell } from 'lucide-react';

// Mock data for teams
const teamsData = [
  { id: 1, name: 'Development Team', lead: 'John Smith', members: 8, department: 'IT', performance: 92 },
  { id: 2, name: 'Design Team', lead: 'Emily Wilson', members: 5, department: 'IT', performance: 88 },
  { id: 3, name: 'HR Team', lead: 'Michael Brown', members: 4, department: 'HR', performance: 85 },
  { id: 4, name: 'Sales Team', lead: 'Sarah Johnson', members: 12, department: 'Sales', performance: 90 },
  { id: 5, name: 'Marketing Team', lead: 'David Lee', members: 6, department: 'Marketing', performance: 87 },
];

const ManagerTeam = () => {
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  const handleSelectTeam = (teamId: number) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === teamsData.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teamsData.map(team => team.id));
    }
  };

  const handleExport = () => {
    toast.success(`Exported ${selectedTeams.length} teams`);
  };

  const handleNotify = () => {
    toast.success(`Notification sent to ${selectedTeams.length} teams`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={selectedTeams.length === 0}
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="flex items-center gap-2"
            disabled={selectedTeams.length === 0}
            onClick={handleNotify}
          >
            <Bell className="h-4 w-4" />
            Notify
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={selectedTeams.length === teamsData.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Team Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Team Lead</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Members</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {teamsData.map(team => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        checked={selectedTeams.includes(team.id)} 
                        onChange={() => handleSelectTeam(team.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">{team.name}</td>
                    <td className="py-3 px-4">{team.lead}</td>
                    <td className="py-3 px-4">{team.department}</td>
                    <td className="py-3 px-4">{team.members}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${team.performance}%` }}
                          ></div>
                        </div>
                        <span>{team.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerTeam;

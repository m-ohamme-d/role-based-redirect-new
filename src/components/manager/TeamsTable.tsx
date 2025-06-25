
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamsTableProps {
  teams: any[];
  selectedTeams: number[];
  onSelectTeam: (teamId: number) => void;
  onSelectAll: () => void;
  onTeamClick: (team: any) => void;
  onTeamLeadClick: (team: any) => void;
}

const TeamsTable = ({ 
  teams, 
  selectedTeams, 
  onSelectTeam, 
  onSelectAll, 
  onTeamClick, 
  onTeamLeadClick 
}: TeamsTableProps) => {
  return (
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
                    checked={selectedTeams.length === teams.length}
                    onChange={onSelectAll}
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
              {teams.map(team => (
                <tr key={team.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      checked={selectedTeams.includes(team.id)} 
                      onChange={() => onSelectTeam(team.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => onTeamClick(team)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {team.name}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => onTeamLeadClick(team)}
                      className="text-blue-600 hover:underline"
                    >
                      {team.lead}
                    </button>
                  </td>
                  <td className="py-3 px-4">{team.department}</td>
                  <td className="py-3 px-4">{Array.isArray(team.members) ? team.members.length : 0}</td>
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
  );
};

export default TeamsTable;

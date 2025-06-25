
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DepartmentWithStats {
  id: string;
  name: string;
  memberCount: number;
  teamLeadName?: string;
}

interface DepartmentStatsCardProps {
  departments: DepartmentWithStats[];
  loading?: boolean;
}

const DepartmentStatsCard = ({ departments, loading = false }: DepartmentStatsCardProps) => {
  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {departments.slice(0, 5).map((dept) => (
            <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-gray-600">Lead: {dept.teamLeadName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{dept.memberCount}</p>
                <p className="text-sm text-gray-600">members</p>
              </div>
            </div>
          ))}
          {departments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No departments found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentStatsCard;

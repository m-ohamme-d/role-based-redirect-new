
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDepartments } from '@/hooks/useDepartments';

const TeamLeadTeam = () => {
  const { teamLeadDepartments, loading } = useDepartments();
  const [activeTab, setActiveTab] = useState(teamLeadDepartments[0]?.id || "");
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading departments...</p>
      </div>
    );
  }

  if (teamLeadDepartments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Departments Assigned</h3>
            <p className="text-gray-600">
              You haven't been assigned to any departments yet. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
        <p className="text-sm text-gray-600">
          Team member management is handled by managers. View-only access.
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {teamLeadDepartments.map(dept => (
            <TabsTrigger key={dept.id} value={dept.id}>
              {dept.name} ({dept.memberCount})
            </TabsTrigger>
          ))}
        </TabsList>
        
        {teamLeadDepartments.map(dept => (
          <TabsContent key={dept.id} value={dept.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{dept.name} Department</span>
                  <Link 
                    to={`/teamlead/team/${dept.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Team Details
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  {dept.memberCount} members in this department. Click "View Team Details" to review 
                  performance metrics and provide ratings. Member management is handled by managers.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Average Performance</h3>
                      <div className="text-3xl font-bold mt-2">
                        {75 + Math.floor(Math.random() * 20)}%
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Active Projects</h3>
                      <div className="text-3xl font-bold mt-2">
                        {Math.floor(Math.random() * 5) + 2}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Completion Rate</h3>
                      <div className="text-3xl font-bold mt-2">
                        {80 + Math.floor(Math.random() * 15)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TeamLeadTeam;

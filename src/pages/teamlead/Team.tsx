
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock departments data - restricted to IT only for team leads
const departments = [
  { id: 1, name: 'IT', memberCount: 15 },
];

const TeamLeadTeam = () => {
  const [activeTab, setActiveTab] = useState("1");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border">
          <p className="font-medium">Team Management Notice:</p>
          <p>Member addition, removal, and profile management are handled by managers in Team Management.</p>
          <p>You can review performance and provide ratings for existing team members.</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {departments.map(dept => (
            <TabsTrigger key={dept.id} value={dept.id.toString()}>
              {dept.name} ({dept.memberCount})
            </TabsTrigger>
          ))}
        </TabsList>
        
        {departments.map(dept => (
          <TabsContent key={dept.id} value={dept.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{dept.name} Department</span>
                  <Link 
                    to={`/teamlead/team/${dept.id}`}
                    className="text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded"
                  >
                    Review Team Performance
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  {dept.memberCount} members in this department. Click "Review Team Performance" to 
                  evaluate member performance and provide ratings. Contact your manager for member management.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Average Performance</h3>
                      <div className="text-3xl font-bold mt-2">
                        {75 + Math.floor(Math.random() * 20)}%
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Based on your ratings</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Active Projects</h3>
                      <div className="text-3xl font-bold mt-2">
                        {Math.floor(Math.random() * 5) + 2}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Current assignments</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Completion Rate</h3>
                      <div className="text-3xl font-bold mt-2">
                        {80 + Math.floor(Math.random() * 15)}%
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Task completion</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Performance Review Focus</h4>
                  <p className="text-sm text-yellow-700">
                    As a Team Lead, your primary responsibility is to evaluate and rate team member performance. 
                    Use the performance review section to provide constructive feedback and ratings.
                  </p>
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

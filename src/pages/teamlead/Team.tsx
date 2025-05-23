
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock departments data
const departments = [
  { id: 1, name: 'IT', memberCount: 15 },
  { id: 2, name: 'Marketing', memberCount: 8 },
  { id: 3, name: 'Sales', memberCount: 12 },
];

const TeamLeadTeam = () => {
  const [activeTab, setActiveTab] = useState("1");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
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
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {dept.memberCount} members in this department. Click "View Details" to manage team members 
                  and review performance metrics.
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

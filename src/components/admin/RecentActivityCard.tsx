
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

const recentActivities = [
  {
    id: 1,
    user: 'Robert Manager',
    action: 'added a new team member',
    time: '2 hours ago',
    color: 'bg-green-500'
  },
  {
    id: 2,
    user: 'Sarah Lead',
    action: 'updated performance ratings',
    time: '5 hours ago',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    user: 'New user registered',
    action: 'Emily Davis',
    time: '1 day ago',
    color: 'bg-purple-500'
  }
];

const RecentActivityCard = () => (
  <Card className="bg-white shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold text-gray-900">Recent User Activity</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`} />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button variant="link" className="text-blue-600 p-0 h-auto font-normal">
          View All Activity
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default RecentActivityCard;

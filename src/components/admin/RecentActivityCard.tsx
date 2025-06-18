
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RecentActivityCard = () => {
  const activities = [
    {
      id: 1,
      message: 'Robert Manager added a new team member',
      time: '2 hours ago',
      color: 'bg-green-500'
    },
    {
      id: 2,
      message: 'Sarah Lead updated performance ratings',
      time: '5 hours ago',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      message: 'New user registered: Emily Davis',
      time: '1 day ago',
      color: 'bg-purple-500'
    },
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
              <p className="text-sm">{activity.message}</p>
              <span className="text-xs text-gray-500 ml-auto">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/admin/audit-log" className="text-blue-600 hover:underline text-sm">
            View All Activity
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;

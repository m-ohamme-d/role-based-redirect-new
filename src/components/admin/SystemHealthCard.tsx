
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemHealthCard = () => {
  const healthMetrics = [
    { label: 'Server Uptime', value: '99.9%', color: 'bg-green-500' },
    { label: 'Database Load', value: '45%', color: 'bg-blue-500' },
    { label: 'Storage Usage', value: '72%', color: 'bg-yellow-500' },
    { label: 'API Request Rate', value: '28%', color: 'bg-purple-500' },
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm font-medium">{metric.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${metric.color} h-2 rounded-full`} 
                  style={{ width: metric.value }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCard;

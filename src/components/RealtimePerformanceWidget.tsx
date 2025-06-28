
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRealtimePerformance } from '@/hooks/useRealtimePerformance';
import RealtimeIndicator from './RealtimeIndicator';

const RealtimePerformanceWidget = () => {
  const { performanceUpdates, isConnected } = useRealtimePerformance();

  const getTrendIcon = (oldRating: number, newRating: number) => {
    if (newRating > oldRating) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (newRating < oldRating) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getRatingChange = (oldRating: number, newRating: number) => {
    const change = newRating - oldRating;
    if (change > 0) return `+${change}`;
    return change.toString();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Performance Updates</CardTitle>
          <RealtimeIndicator isConnected={isConnected} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {performanceUpdates.length > 0 ? (
            performanceUpdates.slice(0, 8).map((update) => (
              <div key={update.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{update.memberName}</span>
                    <Badge variant="outline" className="text-xs">
                      {update.department}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {update.category} rating updated by {update.updatedBy}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {getTrendIcon(update.oldRating, update.newRating)}
                  <span className="font-medium">
                    {update.oldRating}% → {update.newRating}%
                  </span>
                  <span className={`text-xs ${
                    update.newRating > update.oldRating ? 'text-green-600' : 
                    update.newRating < update.oldRating ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    ({getRatingChange(update.oldRating, update.newRating)})
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(update.timestamp)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="text-sm">No performance updates yet</div>
              <div className="text-xs mt-1">Live updates will appear here</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimePerformanceWidget;

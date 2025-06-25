
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  className?: string;
}

const RealtimeIndicator = ({ isConnected, className = '' }: RealtimeIndicatorProps) => {
  const [pulseClass, setPulseClass] = useState('');

  useEffect(() => {
    if (isConnected) {
      setPulseClass('animate-pulse');
      const timer = setTimeout(() => setPulseClass(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <Badge 
      variant={isConnected ? "default" : "secondary"} 
      className={`flex items-center gap-1 ${pulseClass} ${className}`}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          Live
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline
        </>
      )}
    </Badge>
  );
};

export default RealtimeIndicator;

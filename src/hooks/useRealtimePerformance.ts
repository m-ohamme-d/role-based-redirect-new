
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PerformanceUpdate {
  id: string;
  memberId: string;
  memberName: string;
  category: string;
  oldRating: number;
  newRating: number;
  updatedBy: string;
  timestamp: string;
  department: string;
}

export const useRealtimePerformance = () => {
  const { profile } = useAuth();
  const [performanceUpdates, setPerformanceUpdates] = useState<PerformanceUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!profile) return;

    console.log('[useRealtimePerformance] Setting up real-time performance tracking...');
    setIsConnected(true);

    // Set up realtime subscription for performance updates
    const channel = supabase
      .channel('performance-updates')
      .on('broadcast', { event: 'rating_update' }, (payload) => {
        console.log('Real-time performance update received:', payload);
        
        const update: PerformanceUpdate = {
          id: Date.now().toString(),
          memberId: payload.memberId || 'unknown',
          memberName: payload.memberName || 'Unknown Member',
          category: payload.category || 'overall',
          oldRating: payload.oldRating || 0,
          newRating: payload.newRating || 0,
          updatedBy: payload.updatedBy || 'System',
          timestamp: new Date().toISOString(),
          department: payload.department || 'Unknown'
        };

        setPerformanceUpdates(prev => [update, ...prev.slice(0, 19)]);
      })
      .subscribe((status) => {
        console.log('[useRealtimePerformance] Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Simulate real-time performance updates
    const interval = setInterval(() => {
      const mockUpdates = [
        {
          memberName: 'John Smith',
          category: 'productivity',
          oldRating: 75,
          newRating: 80,
          updatedBy: 'Team Lead',
          department: 'Engineering'
        },
        {
          memberName: 'Sarah Johnson',
          category: 'collaboration',
          oldRating: 85,
          newRating: 90,
          updatedBy: 'Manager',
          department: 'Marketing'
        },
        {
          memberName: 'Mike Wilson',
          category: 'timeliness',
          oldRating: 70,
          newRating: 75,
          updatedBy: 'Team Lead',
          department: 'Sales'
        }
      ];

      const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
      const update: PerformanceUpdate = {
        id: Date.now().toString(),
        memberId: Date.now().toString(),
        memberName: randomUpdate.memberName,
        category: randomUpdate.category,
        oldRating: randomUpdate.oldRating,
        newRating: randomUpdate.newRating,
        updatedBy: randomUpdate.updatedBy,
        timestamp: new Date().toISOString(),
        department: randomUpdate.department
      };

      setPerformanceUpdates(prev => [update, ...prev.slice(0, 19)]);
    }, 20000); // New update every 20 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [profile]);

  const broadcastRatingUpdate = async (update: Omit<PerformanceUpdate, 'id' | 'timestamp'>) => {
    try {
      await supabase.channel('performance-updates').send({
        type: 'broadcast',
        event: 'rating_update',
        payload: update
      });
      console.log('[useRealtimePerformance] Rating update broadcasted:', update);
    } catch (error) {
      console.error('[useRealtimePerformance] Error broadcasting update:', error);
    }
  };

  return {
    performanceUpdates,
    isConnected,
    broadcastRatingUpdate
  };
};

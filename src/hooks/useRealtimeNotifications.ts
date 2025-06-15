
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RealtimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'performance' | 'system' | 'team' | 'rating';
  timestamp: string;
  read: boolean;
  userId?: string;
}

export const useRealtimeNotifications = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile) return;

    // Simulate initial notifications
    const initialNotifications: RealtimeNotification[] = [
      {
        id: '1',
        title: 'Performance Rating Updated',
        message: 'Team member John Smith\'s rating has been updated',
        type: 'performance',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'New Team Member',
        message: 'Sarah Johnson joined the Engineering team',
        type: 'team',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        read: false
      }
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);

    // Set up realtime subscription for notifications
    const channel = supabase
      .channel('notifications-channel')
      .on('broadcast', { event: 'notification' }, (payload) => {
        console.log('Real-time notification received:', payload);
        const newNotification: RealtimeNotification = {
          id: Date.now().toString(),
          title: payload.title || 'New Notification',
          message: payload.message || 'You have a new update',
          type: payload.type || 'system',
          timestamp: new Date().toISOString(),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    // Simulate periodic updates
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          title: 'Performance Update',
          message: 'Team productivity increased by 5%',
          type: 'performance' as const
        },
        {
          title: 'Rating Submitted',
          message: 'New performance rating submitted for review',
          type: 'rating' as const
        },
        {
          title: 'Team Alert',
          message: 'Weekly team meeting scheduled',
          type: 'team' as const
        }
      ];

      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      const newNotification: RealtimeNotification = {
        id: Date.now().toString(),
        title: randomNotification.title,
        message: randomNotification.message,
        type: randomNotification.type,
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    }, 15000); // New notification every 15 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [profile]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};

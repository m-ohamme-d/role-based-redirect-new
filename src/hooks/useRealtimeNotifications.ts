
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'system' | 'performance' | 'team' | 'rating';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with some mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'performance',
        title: 'Performance Alert',
        message: 'Team productivity has increased by 15% this week',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'team',
        title: 'New Team Member',
        message: 'John Doe has joined the Engineering team',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    setLoading(false);

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('Notification received:', payload);
        
        if (payload.eventType === 'INSERT') {
          const newNotification = payload.new as Notification;
          // Only allow valid notification types
          if (['system', 'performance', 'team', 'rating'].includes(newNotification.type)) {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast(newNotification.title, {
              description: newNotification.message,
              duration: 5000,
            });
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
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

  const deleteNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

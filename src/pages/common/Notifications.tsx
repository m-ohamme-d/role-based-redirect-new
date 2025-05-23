
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: 'Report Due',
    message: 'Monthly report is due today',
    time: '2025-05-23T08:30:00',
    type: 'report',
    read: false
  },
  {
    id: 2,
    title: 'New Task Assigned',
    message: 'You have been assigned a new task by manager',
    time: '2025-05-22T15:45:00',
    type: 'task',
    read: false
  },
  {
    id: 3,
    title: 'Meeting Reminder',
    message: 'Team meeting in 30 minutes',
    time: '2025-05-21T09:00:00',
    type: 'meeting',
    read: true
  },
  {
    id: 4,
    title: 'System Update',
    message: 'The system will undergo maintenance tonight',
    time: '2025-05-20T18:00:00',
    type: 'system',
    read: true
  },
  {
    id: 5,
    title: 'Document Updated',
    message: 'The project documentation has been updated',
    time: '2025-05-19T14:20:00',
    type: 'document',
    read: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <Button onClick={handleMarkAllAsRead} variant="outline">
          Mark all as read
        </Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'unread' ? 'default' : 'outline'} 
          onClick={() => setFilter('unread')}
        >
          Unread
        </Button>
        <Button 
          variant={filter === 'read' ? 'default' : 'outline'} 
          onClick={() => setFilter('read')}
        >
          Read
        </Button>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      {notification.read ? (
                        <Badge variant="outline" className="bg-gray-100">Read</Badge>
                      ) : (
                        <Badge className="bg-blue-500">New</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell>{notification.message}</TableCell>
                    <TableCell>{formatDate(notification.time)}</TableCell>
                    <TableCell>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No notifications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;

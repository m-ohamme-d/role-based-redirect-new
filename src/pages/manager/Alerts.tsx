
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Bell, AlertTriangle, Info, Clock } from 'lucide-react';

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    title: 'Performance Report Due',
    message: 'Quarterly performance reports are due by end of week',
    recipient: 'Team Leads',
    priority: 'high',
    status: 'sent',
    sentAt: '2024-01-15 10:30',
    department: 'All'
  },
  {
    id: 2,
    title: 'New Department Added',
    message: 'IT Security department has been created and needs approval',
    recipient: 'Admin',
    priority: 'medium',
    status: 'pending',
    sentAt: '2024-01-15 09:15',
    department: 'IT'
  },
  {
    id: 3,
    title: 'Client Meeting Reminder',
    message: 'TechCorp client meeting scheduled for tomorrow at 2 PM',
    recipient: 'Sarah Lead',
    priority: 'low',
    status: 'sent',
    sentAt: '2024-01-14 16:45',
    department: 'IT'
  }
];

const departments = ['All', 'IT', 'HR', 'Sales', 'Marketing', 'Finance'];
const recipients = ['Team Leads', 'Admin', 'Specific Person', 'Department'];
const priorities = ['low', 'medium', 'high'];

const ManagerAlerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    recipient: '',
    priority: 'medium',
    department: 'All',
    specificPerson: ''
  });

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.message || !newAlert.recipient) {
      toast.error('Please fill in all required fields');
      return;
    }

    const alert = {
      ...newAlert,
      id: Math.max(...alerts.map(a => a.id)) + 1,
      status: 'sent',
      sentAt: new Date().toLocaleString()
    };

    setAlerts([alert, ...alerts]);
    setNewAlert({
      title: '', message: '', recipient: '', priority: 'medium',
      department: 'All', specificPerson: ''
    });
    setShowCreateDialog(false);
    toast.success('Alert sent successfully');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-gray-600">Send custom alerts to team members and track communications</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alert-title">Alert Title</Label>
                <Input
                  id="alert-title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  placeholder="Enter alert title"
                />
              </div>

              <div>
                <Label htmlFor="alert-message">Message</Label>
                <Textarea
                  id="alert-message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  placeholder="Enter alert message"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="alert-recipient">Recipient</Label>
                  <Select value={newAlert.recipient} onValueChange={(value) => setNewAlert({...newAlert, recipient: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients.map(recipient => (
                        <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="alert-priority">Priority</Label>
                  <Select value={newAlert.priority} onValueChange={(value) => setNewAlert({...newAlert, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>
                          <div className="flex items-center gap-2 capitalize">
                            {getPriorityIcon(priority)}
                            {priority}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newAlert.recipient === 'Specific Person' && (
                <div>
                  <Label htmlFor="specific-person">Person Name</Label>
                  <Input
                    id="specific-person"
                    value={newAlert.specificPerson}
                    onChange={(e) => setNewAlert({...newAlert, specificPerson: e.target.value})}
                    placeholder="Enter person's name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="alert-department">Department</Label>
                <Select value={newAlert.department} onValueChange={(value) => setNewAlert({...newAlert, department: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAlert}>
                  Send Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-sm text-gray-600">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{alerts.filter(a => a.priority === 'high').length}</p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'sent').length}</p>
              <p className="text-sm text-gray-600">Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    {getPriorityIcon(alert.priority)}
                    <h3 className="text-lg font-semibold">{alert.title}</h3>
                    <Badge 
                      className={getPriorityColor(alert.priority)}
                    >
                      {alert.priority.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant={alert.status === 'sent' ? 'default' : 'secondary'}
                      className={alert.status === 'sent' ? 'bg-green-500' : 'bg-gray-500'}
                    >
                      {alert.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-700">{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>To: <strong>{alert.recipient}</strong></span>
                    <span>Department: <strong>{alert.department}</strong></span>
                    <span>Sent: <strong>{alert.sentAt}</strong></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManagerAlerts;

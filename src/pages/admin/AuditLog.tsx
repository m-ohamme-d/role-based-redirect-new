
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileEdit, Trash, UserPlus, UserMinus, Shield } from 'lucide-react';

// Mock audit log data with more comprehensive tracking
const mockAuditLogs = [
  { 
    id: 1, 
    action: 'edit', 
    user: 'Sarah Lead', 
    role: 'teamlead', 
    description: 'Modified employee performance rating', 
    target: 'John Smith', 
    timestamp: '2025-05-20T10:30:00',
    details: 'Changed rating from 7/10 to 8/10'
  },
  { 
    id: 2, 
    action: 'delete', 
    user: 'Robert Manager', 
    role: 'manager', 
    description: 'Removed project record', 
    target: 'Project Alpha', 
    timestamp: '2025-05-19T14:15:00',
    details: 'Project marked as cancelled'
  },
  { 
    id: 3, 
    action: 'create', 
    user: 'Admin User', 
    role: 'admin', 
    description: 'Created new department', 
    target: 'Research & Development', 
    timestamp: '2025-05-18T09:45:00',
    details: 'Department added with 5 initial members'
  },
  { 
    id: 4, 
    action: 'edit', 
    user: 'Sarah Lead', 
    role: 'teamlead', 
    description: 'Updated team member information', 
    target: 'Emily Davis', 
    timestamp: '2025-05-18T11:20:00',
    details: 'Updated contact information and designation'
  },
  { 
    id: 5, 
    action: 'create', 
    user: 'Robert Manager', 
    role: 'manager', 
    description: 'Added new team member', 
    target: 'Alex Johnson', 
    timestamp: '2025-05-17T16:30:00',
    details: 'New hire assigned to IT department'
  },
  {
    id: 6,
    action: 'client_update',
    user: 'Sarah Lead',
    role: 'teamlead',
    description: 'Updated client profile',
    target: 'TechCorp Solutions',
    timestamp: '2025-05-26T01:05:00',
    details: 'Added new tags and updated contact information'
  },
  {
    id: 7,
    action: 'department_create',
    user: 'Robert Manager',
    role: 'manager',
    description: 'Created new department',
    target: 'DevOps',
    timestamp: '2025-05-26T01:10:00',
    details: 'New department created for infrastructure management'
  }
];

const ActionIcon = ({ action }: { action: string }) => {
  switch (action) {
    case 'edit':
    case 'client_update':
      return <FileEdit className="h-4 w-4" />;
    case 'delete':
      return <Trash className="h-4 w-4" />;
    case 'create':
    case 'department_create':
      return <UserPlus className="h-4 w-4" />;
    default:
      return <UserMinus className="h-4 w-4" />;
  }
};

const ActionBadge = ({ action }: { action: string }) => {
  const getActionConfig = (action: string) => {
    switch (action) {
      case 'edit':
      case 'client_update':
        return { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200", label: "Edit" };
      case 'delete':
        return { variant: "destructive", className: "bg-red-50 text-red-700 border-red-200", label: "Delete" };
      case 'create':
      case 'department_create':
        return { variant: "outline", className: "bg-green-50 text-green-700 border-green-200", label: "Create" };
      default:
        return { variant: "outline", className: "bg-gray-50 text-gray-700 border-gray-200", label: action };
    }
  };

  const config = getActionConfig(action);

  return (
    <Badge 
      variant={config.variant as any}
      className={`flex items-center gap-1 w-fit ${config.className}`}
    >
      <ActionIcon action={action} />
      {config.label}
    </Badge>
  );
};

const AdminAuditLog = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        console.log('Access denied to audit log - user role:', parsedUser.role);
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      console.log('Admin accessing audit log:', parsedUser.name);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  const filteredLogs = mockAuditLogs
    .filter(log => {
      if (filter === 'all') return true;
      if (filter === 'action') return log.action.includes('edit') || log.action.includes('create') || log.action.includes('delete');
      return log.action === filter || log.role === filter;
    })
    .filter(log => 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  console.log('Audit log filtered results:', filteredLogs.length, 'entries');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
        <Badge variant="destructive" className="ml-2">Admin Only</Badge>
      </div>
      <p className="text-gray-600">Comprehensive tracking of all system changes by team leads and managers</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search audit logs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="edit">Edits</SelectItem>
            <SelectItem value="delete">Deletions</SelectItem>
            <SelectItem value="create">Creations</SelectItem>
            <SelectItem value="teamlead">Team Lead Actions</SelectItem>
            <SelectItem value="manager">Manager Actions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Changes & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell className="font-medium">{log.target}</TableCell>
                  <TableCell className="text-sm text-gray-600">{log.details}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No audit logs found matching your criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            <strong>Security Notice:</strong> This audit log is restricted to administrators only. 
            All actions are automatically tracked and cannot be modified or deleted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLog;

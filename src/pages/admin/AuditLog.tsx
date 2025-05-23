
import { useState } from 'react';
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
import { Search, FileEdit, Trash, UserPlus, UserMinus } from 'lucide-react';

// Mock audit log data
const mockAuditLogs = [
  { 
    id: 1, 
    action: 'edit', 
    user: 'Sarah Lead', 
    role: 'teamlead', 
    description: 'Modified employee performance rating', 
    target: 'John Smith', 
    timestamp: '2025-05-20T10:30:00' 
  },
  { 
    id: 2, 
    action: 'delete', 
    user: 'Robert Manager', 
    role: 'manager', 
    description: 'Removed project record', 
    target: 'Project Alpha', 
    timestamp: '2025-05-19T14:15:00' 
  },
  { 
    id: 3, 
    action: 'create', 
    user: 'Admin User', 
    role: 'admin', 
    description: 'Created new department', 
    target: 'Research & Development', 
    timestamp: '2025-05-18T09:45:00' 
  },
  { 
    id: 4, 
    action: 'edit', 
    user: 'Sarah Lead', 
    role: 'teamlead', 
    description: 'Updated team member information', 
    target: 'Emily Davis', 
    timestamp: '2025-05-18T11:20:00' 
  },
  { 
    id: 5, 
    action: 'create', 
    user: 'Robert Manager', 
    role: 'manager', 
    description: 'Added new team member', 
    target: 'Alex Johnson', 
    timestamp: '2025-05-17T16:30:00' 
  },
];

const ActionIcon = ({ action }: { action: string }) => {
  switch (action) {
    case 'edit':
      return <FileEdit className="h-4 w-4" />;
    case 'delete':
      return <Trash className="h-4 w-4" />;
    case 'create':
      return <UserPlus className="h-4 w-4" />;
    default:
      return <UserMinus className="h-4 w-4" />;
  }
};

const ActionBadge = ({ action }: { action: string }) => {
  const variants: Record<string, any> = {
    edit: { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200" },
    delete: { variant: "destructive", className: "bg-red-50 text-red-700 border-red-200" },
    create: { variant: "outline", className: "bg-green-50 text-green-700 border-green-200" },
  };

  const variant = variants[action] || variants.edit;

  return (
    <Badge 
      variant={variant.variant} 
      className={`flex items-center gap-1 w-fit ${variant.className}`}
    >
      <ActionIcon action={action} />
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </Badge>
  );
};

const AdminAuditLog = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockAuditLogs
    .filter(log => filter === 'all' || log.action === filter)
    .filter(log => 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
      <p className="text-gray-600">Track changes made by team leads and managers</p>

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
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="create">Create</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>System Changes</CardTitle>
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
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="capitalize">{log.role}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No audit logs found
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

export default AdminAuditLog;

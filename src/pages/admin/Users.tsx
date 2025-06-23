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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Users, Shield, Key, RotateCcw, Building } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';

// Mock users data with departments
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', department: 'IT', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', department: 'HR', status: 'active' },
  { id: 3, name: 'Robert Manager', email: 'robert@example.com', role: 'manager', department: 'IT', status: 'active' },
  { id: 4, name: 'Sarah Lead', email: 'sarah@example.com', role: 'teamlead', department: 'IT', status: 'active' },
  { id: 5, name: 'Tom Wilson', email: 'tom@example.com', role: 'user', department: 'Sales', status: 'inactive' },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'admin', department: 'Administration', status: 'active' },
];

const AdminUsers = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const [users, setUsers] = useState(mockUsers);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [passwordAction, setPasswordAction] = useState<'set' | 'reset'>('set');
  const [newPassword, setNewPassword] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    status: 'active'
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const user = {
      ...newUser,
      id: Math.max(...users.map(u => u.id)) + 1
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user', department: '', status: 'active' });
    setShowCreateDialog(false);
    toast.success('User created successfully');
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    setShowEditDialog(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
  };

  const handlePasswordAction = (user: any, action: 'set' | 'reset') => {
    setSelectedUser(user);
    setPasswordAction(action);
    setNewPassword('');
    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = () => {
    if (!newPassword.trim()) {
      toast.error('Password cannot be empty');
      return;
    }

    console.log(`Password ${passwordAction} for user:`, selectedUser?.email, 'New password:', newPassword);
    toast.success(`Password ${passwordAction === 'set' ? 'set' : 'reset'} successfully for ${selectedUser?.name}`);
    setShowPasswordDialog(false);
    setNewPassword('');
    setSelectedUser(null);
  };

  const handleAddDepartment = () => {
    if (addDepartment(newDepartmentName)) {
      setNewDepartmentName('');
      toast.success('Department added successfully - changes synced to Manager dashboard');
    } else {
      toast.error('Department already exists or invalid name');
    }
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment && updateDepartment(editingDepartment, editDepartmentName)) {
      // Update users with old department name to new name
      setUsers(users.map(user => 
        user.department === editingDepartment 
          ? { ...user, department: editDepartmentName }
          : user
      ));
      setEditingDepartment(null);
      setEditDepartmentName('');
      toast.success('Department updated successfully - changes synced to Manager dashboard');
    } else {
      toast.error('Department already exists or invalid name');
    }
  };

  const handleDeleteDepartment = (deptName: string) => {
    const usersInDept = users.filter(user => user.department === deptName);
    if (usersInDept.length > 0) {
      toast.error(`Cannot delete department with ${usersInDept.length} users. Please reassign users first.`);
      return;
    }

    if (deleteDepartment(deptName)) {
      toast.success('Department deleted successfully - changes synced to Manager dashboard');
    } else {
      toast.error('Failed to delete department');
    }
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole } 
        : user
    ));
    toast.success(`User role updated to ${newRole}`);
  };

  const handleDepartmentChange = (userId: number, newDepartment: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, department: newDepartment } 
        : user
    ));
    toast.success(`User department updated to ${newDepartment}`);
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
    toast.success('User status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Create, edit, and manage user roles and departments</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Manage Departments
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Department Management</DialogTitle>
                <DialogDescription>
                  Add, edit, or delete departments. Changes will sync to Manager dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    placeholder="Enter new department name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
                  />
                  <Button onClick={handleAddDepartment}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center justify-between p-2 border rounded">
                      {editingDepartment === dept ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={editDepartmentName}
                            onChange={(e) => setEditDepartmentName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateDepartment()}
                            autoFocus
                          />
                          <Button size="sm" onClick={handleUpdateDepartment}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingDepartment(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">{dept}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDepartment(dept);
                                setEditDepartmentName(dept);
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDepartment(dept)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="teamlead">Team Lead</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
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
                  <Button onClick={handleCreateUser}>
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{Array.isArray(users) ? users.length : 0}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.status === 'active').length : 0}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0}</p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{Array.isArray(users) ? users.filter(u => u.role === 'manager').length : 0}</p>
              <p className="text-sm text-gray-600">Managers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => {
                        setUsers(users.map(u => 
                          u.id === user.id ? { ...u, role: value } : u
                        ));
                        toast.success(`User role updated to ${value}`);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="teamlead">Team Lead</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.department}
                      onValueChange={(value) => {
                        setUsers(users.map(u => 
                          u.id === user.id ? { ...u, department: value } : u
                        ));
                        toast.success(`User department updated to ${value}`);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className={`cursor-pointer ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                      onClick={() => {
                        setUsers(users.map(u => 
                          u.id === user.id 
                            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } 
                            : u
                        ));
                        toast.success('User status updated');
                      }}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasswordAction(user, 'set')}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasswordAction(user, 'reset')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setUsers(users.filter(u => u.id !== user.id));
                          toast.success('User deleted successfully');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Password Management Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {passwordAction === 'set' ? 'Set Password' : 'Reset Password'} for {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              {passwordAction === 'set' 
                ? 'Set a new password for this user account.'
                : 'Reset the password for this user account.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit}>
                {passwordAction === 'set' ? 'Set Password' : 'Reset Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditUser}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;

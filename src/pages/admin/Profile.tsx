
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Mail, Phone, Building, Calendar, Save } from 'lucide-react';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    joinDate: ''
  });

  useEffect(() => {
    if (!loading) {
      if (!profile) {
        console.log('No profile found, redirecting to login');
        navigate('/login');
        return;
      }
      
      if (profile.role !== 'admin') {
        console.log('Access denied to admin profile - user role:', profile.role);
        navigate('/login');
        return;
      }
      
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: '+1 (555) 123-4567',
        department: 'Administration',
        joinDate: '2024-01-01'
      });
      
      console.log('Admin accessing profile:', profile.name);
    }
  }, [profile, loading, navigate]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleImageUpdate = (newImageUrl: string | null) => {
    setProfileImageUrl(newImageUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <ProfilePictureUpload
              userId={profile.id}
              currentImageUrl={profileImageUrl}
              userName={profile.name || 'Admin'}
              onImageUpdate={handleImageUpdate}
              disabled={!isEditing}
            />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Administrator
            </Badge>
            <p className="text-center text-gray-600">
              System Administrator with full access privileges
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  ) : (
                    <span className="text-gray-900">{profileData.name}</span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  ) : (
                    <span className="text-gray-900">{profileData.email}</span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  ) : (
                    <span className="text-gray-900">{profileData.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{profileData.department}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Privileges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">User Management</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Department Control</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">System Settings</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Audit Logs</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Reports & Analytics</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Full System Access</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;

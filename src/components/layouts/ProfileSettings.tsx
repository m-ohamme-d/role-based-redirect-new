
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
    role: string;
  };
}

const ProfileSettings = ({ userData }: ProfileSettingsProps) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Update localStorage with new profile data
    const updatedUserData = {
      ...userData,
      name: formData.name,
      email: formData.email,
    };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    toast.success('Profile updated successfully!');
  };

  const handleChangeProfile = () => {
    // Create a file input element to allow profile picture selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, this would upload to a server
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          // Store the image in localStorage for demo purposes
          localStorage.setItem('userAvatar', imageUrl);
          toast.success('Profile picture updated successfully!');
          // Force a page refresh to show the new avatar
          window.location.reload();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    
    if (!formData.currentPassword) {
      toast.error('Please enter your current password!');
      return;
    }
    
    // In a real app, this would make an API call to change the password
    toast.success('Password updated successfully!');
    
    // Reset password fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Get avatar from localStorage or use default
  const storedAvatar = localStorage.getItem('userAvatar');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={storedAvatar || `https://i.pravatar.cc/150?u=${userData.email}`} />
                <AvatarFallback>{userData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button size="sm" onClick={handleChangeProfile}>Change Profile</Button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    disabled
                  />
                </div>
              </div>
              <Button type="submit">Update Profile</Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;

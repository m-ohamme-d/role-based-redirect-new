
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsLayoutProps {
  role: string;
}

const SettingsLayout = ({ role }: SettingsLayoutProps) => {
  const [notifications, setNotifications] = useState({
    email: true,
    updates: false,
    marketing: false,
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange('email')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="updates" className="text-base">System Updates</Label>
              <p className="text-sm text-gray-500">Get notified about system updates</p>
            </div>
            <Switch
              id="updates"
              checked={notifications.updates}
              onCheckedChange={() => handleNotificationChange('updates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing" className="text-base">Marketing Emails</Label>
              <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
            </div>
            <Switch
              id="marketing"
              checked={notifications.marketing}
              onCheckedChange={() => handleNotificationChange('marketing')}
            />
          </div>
          
          <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleSaveAppearance}>Save Appearance Settings</Button>
        </CardContent>
      </Card>

      {role === 'manager' && (
        <Card>
          <CardHeader>
            <CardTitle>Manager Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Additional settings specific to managers.</p>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="team-reports" className="text-base">Automated Team Reports</Label>
                <p className="text-sm text-gray-500">Receive weekly team performance reports</p>
              </div>
              <Switch
                id="team-reports"
                defaultChecked={true}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {role === 'teamlead' && (
        <Card>
          <CardHeader>
            <CardTitle>Team Lead Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Additional settings specific to team leads.</p>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="performance-updates" className="text-base">Performance Updates</Label>
                <p className="text-sm text-gray-500">Receive alerts when team member performance changes</p>
              </div>
              <Switch
                id="performance-updates"
                defaultChecked={true}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsLayout;

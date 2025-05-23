
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SettingsLayout from '@/components/layouts/SettingsLayout';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    enableUserRegistration: true,
    enableAuditLogging: true,
    dataRetentionDays: 90,
    autoLockReports: true,
    notifyAdminsOnRoleChange: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success('Setting updated successfully');
  };

  const handleNumberChange = (key: keyof typeof settings, value: string) => {
    const numValue = parseInt(value) || 0;
    setSettings({ ...settings, [key]: numValue });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
      
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global system behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableUserRegistration" className="text-base">Enable User Registration</Label>
                  <p className="text-sm text-gray-500">Allow new users to register for accounts</p>
                </div>
                <Switch
                  id="enableUserRegistration"
                  checked={settings.enableUserRegistration}
                  onCheckedChange={() => handleToggle('enableUserRegistration')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAuditLogging" className="text-base">Enable Audit Logging</Label>
                  <p className="text-sm text-gray-500">Record all user actions for auditing purposes</p>
                </div>
                <Switch
                  id="enableAuditLogging"
                  checked={settings.enableAuditLogging}
                  onCheckedChange={() => handleToggle('enableAuditLogging')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetention" className="text-base">Data Retention Period (days)</Label>
                <p className="text-sm text-gray-500 mb-2">Number of days to retain audit log data</p>
                <Input
                  id="dataRetention"
                  type="number"
                  min="1"
                  value={settings.dataRetentionDays}
                  onChange={(e) => handleNumberChange('dataRetentionDays', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Record Management Settings</CardTitle>
              <CardDescription>
                Configure how records are managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoLockReports" className="text-base">Auto-Lock Reports</Label>
                  <p className="text-sm text-gray-500">Automatically lock reports after finalization</p>
                </div>
                <Switch
                  id="autoLockReports"
                  checked={settings.autoLockReports}
                  onCheckedChange={() => handleToggle('autoLockReports')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifyAdminsOnRoleChange" className="text-base">Notify on Role Changes</Label>
                  <p className="text-sm text-gray-500">Send notifications when user roles are modified</p>
                </div>
                <Switch
                  id="notifyAdminsOnRoleChange"
                  checked={settings.notifyAdminsOnRoleChange}
                  onCheckedChange={() => handleToggle('notifyAdminsOnRoleChange')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Save Settings</Button>
        </div>
      </form>

      <div className="mt-8">
        <SettingsLayout role="admin" />
      </div>
    </div>
  );
};

export default AdminSettings;

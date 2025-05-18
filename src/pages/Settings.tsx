
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Volume2,
  Trash2,
  HelpCircle,
  Info,
  LogOut,
  Moon,
  Sun,
  Shield,
  Download,
  Database,
  BarChart3,
  Languages
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import LanguageSelector from '@/components/LanguageSelector';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const Settings = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [audioSettings, setAudioSettings] = useLocalStorage('aaj_audio_settings', {
    quality: 'high',
    autoDownload: true,
    backgroundPlay: true
  });

  const [notificationSettings, setNotificationSettings] = useLocalStorage('aaj_notification_settings', {
    tourUpdates: true,
    newReleases: true,
    recommendations: true,
    nearbyTours: false,
    appUpdates: true
  });
  
  const [privacySettings, setPrivacySettings] = useLocalStorage('aaj_privacy_settings', {
    locationSharing: true,
    usageAnalytics: true,
    personalization: true,
    shareTourProgress: true
  });
  
  const [storageSettings, setStorageSettings] = useLocalStorage('aaj_storage_settings', {
    autoDelete: false,
    downloadOnlyWifi: true,
    maxStorageUsage: 500 // MB
  });
  
  const [passwordInputs, setPasswordInputs] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [themePreference, setThemePreference] = useLocalStorage('aaj_theme_preference', 'light');
  
  // For the storage usage visualization
  const [storageUsage] = useState({
    used: 105, // MB
    total: storageSettings.maxStorageUsage // MB
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your new password and confirmation match.",
        variant: "destructive"
      });
      return;
    }
    
    // In real app, would call API to change password
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed."
    });
    
    setPasswordInputs({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== user?.email) {
      toast({
        title: "Confirmation failed",
        description: "Please type your email correctly to confirm account deletion.",
        variant: "destructive"
      });
      return;
    }
    
    // In real app, would call API to delete account
    try {
      toast({
        title: "Account deleted",
        description: "Your account has been scheduled for deletion."
      });
      await logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const updateAudioSetting = (key, value) => {
    setAudioSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Settings updated",
      description: `Audio ${key} setting has been updated.`
    });
  };
  
  const updateNotificationSetting = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const updatePrivacySetting = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const updateStorageSetting = (key, value) => {
    setStorageSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearCache = () => {
    // In real app, would clear cache
    toast({
      title: "Cache cleared",
      description: "Application cache has been successfully cleared."
    });
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <main className="flex-1 py-6 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Button variant="ghost" onClick={() => navigate(-1)}>
                Back to Profile
              </Button>
            </div>
            
            {/* Account Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-desert" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account information and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Change Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Email Address</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                      type="email"
                      defaultValue={user.email}
                      className="flex-1"
                      disabled
                    />
                    <Button variant="outline">
                      Change Email
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Password Change Section */}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordInputs.currentPassword}
                        onChange={(e) => setPasswordInputs({...passwordInputs, currentPassword: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordInputs.newPassword}
                        onChange={(e) => setPasswordInputs({...passwordInputs, newPassword: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordInputs.confirmPassword}
                        onChange={(e) => setPasswordInputs({...passwordInputs, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Update Password
                    </Button>
                  </div>
                </form>
                
                <Separator />
                
                {/* Account Deletion */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. It will permanently delete your account and remove your data from our servers.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* App Preferences */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-desert" />
                  App Preferences
                </CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select your preferred language for the app interface
                  </p>
                  <LanguageSelector />
                </div>
                
                <Separator />
                
                {/* Theme Selection */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose your preferred app appearance
                  </p>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroup 
                        value={themePreference}
                        onValueChange={(value) => setThemePreference(value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light" className="flex items-center gap-1">
                            <Sun className="h-4 w-4" /> Light
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label htmlFor="dark" className="flex items-center gap-1">
                            <Moon className="h-4 w-4" /> Dark
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system" />
                          <Label htmlFor="system">System</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Notification Preferences */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Control what notifications you receive from the app
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tour-updates">Tour Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Updates about tours you've started
                        </p>
                      </div>
                      <Switch 
                        id="tour-updates" 
                        checked={notificationSettings.tourUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting('tourUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-releases">New Releases</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about new tours
                        </p>
                      </div>
                      <Switch 
                        id="new-releases" 
                        checked={notificationSettings.newReleases}
                        onCheckedChange={(checked) => updateNotificationSetting('newReleases', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="recommendations">Recommendations</Label>
                        <p className="text-sm text-muted-foreground">
                          Personalized tour recommendations
                        </p>
                      </div>
                      <Switch 
                        id="recommendations" 
                        checked={notificationSettings.recommendations}
                        onCheckedChange={(checked) => updateNotificationSetting('recommendations', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="nearby-tours">Nearby Tours</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about tours near your location
                        </p>
                      </div>
                      <Switch 
                        id="nearby-tours" 
                        checked={notificationSettings.nearbyTours}
                        onCheckedChange={(checked) => updateNotificationSetting('nearbyTours', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-updates">App Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Information about new features and updates
                        </p>
                      </div>
                      <Switch 
                        id="app-updates" 
                        checked={notificationSettings.appUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting('appUpdates', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Audio Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-desert" />
                  Audio Settings
                </CardTitle>
                <CardDescription>Customize your listening experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Audio Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Higher quality uses more data when streaming
                  </p>
                  <RadioGroup 
                    value={audioSettings.quality}
                    onValueChange={(value) => updateAudioSetting('quality', value)}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <div>
                        <Label htmlFor="standard" className="font-medium">Standard</Label>
                        <p className="text-sm text-muted-foreground">
                          64 kbps - Uses less data, suitable for slower connections
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <div>
                        <Label htmlFor="high" className="font-medium">High</Label>
                        <p className="text-sm text-muted-foreground">
                          128 kbps - Balanced quality and data usage
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="premium" id="premium" />
                      <div>
                        <Label htmlFor="premium" className="font-medium">Premium</Label>
                        <p className="text-sm text-muted-foreground">
                          256 kbps - Highest quality audio, uses more data
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Download Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-download">Auto-download Tours</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically download tours for offline listening
                      </p>
                    </div>
                    <Switch 
                      id="auto-download" 
                      checked={audioSettings.autoDownload}
                      onCheckedChange={(checked) => updateAudioSetting('autoDownload', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wifi-only">Download on Wi-Fi Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Only download content when connected to Wi-Fi
                      </p>
                    </div>
                    <Switch 
                      id="wifi-only" 
                      checked={storageSettings.downloadOnlyWifi}
                      onCheckedChange={(checked) => updateStorageSetting('downloadOnlyWifi', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="background-play">Background Playback</Label>
                      <p className="text-sm text-muted-foreground">
                        Continue playing audio when app is in background
                      </p>
                    </div>
                    <Switch 
                      id="background-play" 
                      checked={audioSettings.backgroundPlay}
                      onCheckedChange={(checked) => updateAudioSetting('backgroundPlay', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Privacy Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-desert" />
                  Privacy Controls
                </CardTitle>
                <CardDescription>Manage your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location-sharing">Location Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow app to access your location for nearby tour recommendations
                      </p>
                    </div>
                    <Switch 
                      id="location-sharing" 
                      checked={privacySettings.locationSharing}
                      onCheckedChange={(checked) => updatePrivacySetting('locationSharing', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="usage-analytics">Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Share anonymous usage data to help improve the app
                      </p>
                    </div>
                    <Switch 
                      id="usage-analytics" 
                      checked={privacySettings.usageAnalytics}
                      onCheckedChange={(checked) => updatePrivacySetting('usageAnalytics', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personalization">Content Personalization</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow app to personalize content based on your preferences
                      </p>
                    </div>
                    <Switch 
                      id="personalization" 
                      checked={privacySettings.personalization}
                      onCheckedChange={(checked) => updatePrivacySetting('personalization', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="progress-sharing">Tour Progress Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Share your tour progress with other users
                      </p>
                    </div>
                    <Switch 
                      id="progress-sharing" 
                      checked={privacySettings.shareTourProgress}
                      onCheckedChange={(checked) => updatePrivacySetting('shareTourProgress', checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-3">
                  <Button variant="outline" className="w-full">
                    Export My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Storage Management */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-desert" />
                  Storage Management
                </CardTitle>
                <CardDescription>Manage app storage and downloads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Storage Usage</h3>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{storageUsage.used} MB used</span>
                    <span>{storageUsage.total} MB allowed</span>
                  </div>
                  <Progress value={(storageUsage.used / storageUsage.total) * 100} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {(storageUsage.total - storageUsage.used).toFixed(0)} MB available
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Storage Limits</h3>
                  <div className="space-y-1">
                    <Label htmlFor="storage-limit" className="text-sm">
                      Maximum storage use: {storageSettings.maxStorageUsage} MB
                    </Label>
                    <Slider
                      id="storage-limit"
                      min={100}
                      max={2000}
                      step={100}
                      value={[storageSettings.maxStorageUsage]}
                      onValueChange={([value]) => updateStorageSetting('maxStorageUsage', value)}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>100 MB</span>
                      <span>2 GB</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-delete">Auto-delete Listened Tours</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically remove downloaded tours after listening
                      </p>
                    </div>
                    <Switch 
                      id="auto-delete" 
                      checked={storageSettings.autoDelete}
                      onCheckedChange={(checked) => updateStorageSetting('autoDelete', checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-3 space-y-3">
                  <Button variant="outline" className="w-full" onClick={clearCache}>
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Help & Support */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-desert" />
                  Help & Support
                </CardTitle>
                <CardDescription>Get help and learn more about the app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQs & Help Center
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <Info className="h-4 w-4 mr-2" />
                    About Arabian Audio
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">App Version 1.0.0</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Logout Button */}
            <div className="flex justify-center mb-10">
              <Button 
                variant="destructive" 
                size="lg"
                className="px-8"
                onClick={() => setLogoutDialog(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Dialog for logout confirmation */}
      <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Yes, Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for account deletion confirmation */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium mb-2">
              To confirm, type your email address: <span className="font-bold">{user.email}</span>
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Enter your email address"
              className="mb-4"
            />
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialog(false);
                setDeleteConfirmation('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleAccountDeletion}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

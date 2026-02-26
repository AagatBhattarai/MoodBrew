import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, Activity, FileText } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PrivacySettings } from '@/types';

export function PrivacySecurityView() {
  const { user, setView, setUser, showToast } = useStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  if (!user) return null;

  const privacy = user.privacySettings || {
    profileVisibility: 'friends',
    activityStatus: true,
    dataSharing: false,
  };

  const handleToggle = (key: keyof PrivacySettings) => {
    // For boolean toggles
    if (typeof privacy[key] === 'boolean') {
      const updatedPrivacy = { ...privacy, [key]: !privacy[key] };
      setUser({ ...user, privacySettings: updatedPrivacy as PrivacySettings });
      showToast(`${key} updated`, 'info');
    }
  };

  const handleVisibilityChange = () => {
    const options: PrivacySettings['profileVisibility'][] = ['public', 'friends', 'private'];
    const currentIndex = options.indexOf(privacy.profileVisibility);
    const nextIndex = (currentIndex + 1) % options.length;
    const updatedPrivacy = { ...privacy, profileVisibility: options[nextIndex] };
    setUser({ ...user, privacySettings: updatedPrivacy as PrivacySettings });
    showToast(`Profile visibility set to ${options[nextIndex]}`, 'info');
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
        showToast('New passwords do not match', 'error');
        return;
    }
    if (passwords.new.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    // Simulate API call
    showToast('Password changed successfully', 'success');
    setIsChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white hover:bg-white/10 mb-6 pl-0"
          onClick={() => setView('profile')}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </Button>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card p-6 md:p-8 space-y-8"
        >
           <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
               </div>
               <div>
                 <h1 className="text-2xl font-bold text-white">Privacy & Security</h1>
                 <p className="text-white/60 text-sm">Control your account access and data</p>
               </div>
           </div>

           {/* Security Section */}
           <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2 border-b border-white/10 pb-2">
                 <Lock className="w-5 h-5 text-amber-400" />
                 Account Security
              </h2>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                 <div>
                    <h3 className="font-medium text-white">Password</h3>
                    <p className="text-white/50 text-sm">Last changed 3 months ago</p>
                 </div>
                 
                 <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogTrigger asChild>
                       <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                          Change
                       </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10 text-white">
                       <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                       </DialogHeader>
                       <div className="space-y-4 py-4">
                          <div className="space-y-2">
                             <Label>Current Password</Label>
                             <Input 
                                type="password"
                                value={passwords.current}
                                onChange={e => setPasswords({...passwords, current: e.target.value})}
                                className="bg-white/5 border-white/10"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label>New Password</Label>
                             <Input 
                                type="password"
                                value={passwords.new}
                                onChange={e => setPasswords({...passwords, new: e.target.value})}
                                className="bg-white/5 border-white/10"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label>Confirm New Password</Label>
                             <Input 
                                type="password"
                                value={passwords.confirm}
                                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                className="bg-white/5 border-white/10"
                             />
                          </div>
                          <Button onClick={handleChangePassword} className="w-full bg-amber-500 hover:bg-amber-600 mt-2">
                             Update Password
                          </Button>
                       </div>
                    </DialogContent>
                 </Dialog>
              </div>
           </div>

           {/* Privacy Section */}
           <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2 border-b border-white/10 pb-2">
                 <Eye className="w-5 h-5 text-amber-400" />
                 Privacy Settings
              </h2>
              
              <div className="space-y-4">
                 {/* Profile Visibility */}
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white flex items-center gap-2">
                           Profile Visibility
                        </h3>
                        <p className="text-white/50 text-sm">Control who can see your profile stats</p>
                    </div>
                    <Button 
                       variant="ghost" 
                       onClick={handleVisibilityChange}
                       className="text-amber-400 hover:text-amber-300 capitalize"
                    >
                       {privacy.profileVisibility}
                    </Button>
                 </div>

                 {/* Activity Status */}
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                       <div className="mt-1 p-2 rounded-lg bg-green-500/10 text-green-400">
                          <Activity className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="font-medium text-white">Activity Status</h3>
                          <p className="text-white/50 text-sm">Show when you're active</p>
                       </div>
                    </div>
                    <Switch 
                       checked={privacy.activityStatus}
                       onCheckedChange={() => handleToggle('activityStatus')}
                       className="data-[state=checked]:bg-green-500"
                    />
                 </div>

                 {/* Data Sharing */}
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                       <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-400">
                          <FileText className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="font-medium text-white">Data Usage</h3>
                          <p className="text-white/50 text-sm">Allow analysis to improve recommendations</p>
                       </div>
                    </div>
                    <Switch 
                       checked={privacy.dataSharing}
                       onCheckedChange={() => handleToggle('dataSharing')}
                       className="data-[state=checked]:bg-blue-500"
                    />
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t border-white/10 text-center">
              <Button variant="link" className="text-red-400/60 hover:text-red-400 text-sm">
                 Delete Account
              </Button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

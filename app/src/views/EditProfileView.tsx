import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Coffee, Save, Heart, CreditCard } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Helper function just for display
const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export function EditProfileView() {
  const { user, setView, showToast, setUser } = useStore();
  
  if (!user) return null;

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    defaultMilk: user.preferences.defaultMilk,
    defaultSweetness: user.preferences.defaultSweetness,
  });

  const handleSave = () => {
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      preferences: {
        ...user.preferences,
        defaultMilk: formData.defaultMilk,
        defaultSweetness: formData.defaultSweetness,
      }
    });
    
    showToast('Profile updated successfully!', 'success');
    // Optional: navigate back
    // setView('profile');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-2xl mx-auto">
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 font-medium">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2 border-b border-white/10 pb-2">
              <User className="w-5 h-5 text-amber-400" />
              Personal Information
            </h2>
            
            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/70">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-9 bg-white/5 border-white/10 text-white focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-9 bg-white/5 border-white/10 text-white focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+977"
                    className="pl-9 bg-white/5 border-white/10 text-white focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coffee Preferences */}
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2 border-b border-white/10 pb-2">
              <Coffee className="w-5 h-5 text-amber-400" />
              Coffee Preferences
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white/70">Default Milk Choice</Label>
                <Select 
                  value={formData.defaultMilk} 
                  onValueChange={(value) => setFormData({...formData, defaultMilk: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select milk type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="regular">Regular Milk</SelectItem>
                    <SelectItem value="skim">Skim Milk</SelectItem>
                    <SelectItem value="oat">Oat Milk (+Rs. 50)</SelectItem>
                    <SelectItem value="almond">Almond Milk (+Rs. 50)</SelectItem>
                    <SelectItem value="soy">Soy Milk (+Rs. 50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white/70">Default Sweetness Level</Label>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded text-sm">
                    {formData.defaultSweetness * 10}%
                  </span>
                </div>
                <Slider
                  value={[formData.defaultSweetness]}
                  onValueChange={([val]) => setFormData({...formData, defaultSweetness: val})}
                  max={10}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-white/40 font-medium px-1">
                  <span>UNSWEETENED</span>
                  <span>EXTRA SWEET</span>
                </div>
              </div>
            </div>
          </div>
            
          {/* Stats Summary */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2 border-b border-white/10 pb-2">
              <Heart className="w-5 h-5 text-amber-400" />
              Account Status
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">Total Orders</p>
                  <p className="text-white text-xl font-bold">{user.stats.totalOrders}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">Member Since</p>
                  <p className="text-white text-xl font-bold">{joinDate}</p>
                </div>
            </div>
          </div>
        </motion.div>
    </div>
  );
}

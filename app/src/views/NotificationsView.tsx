import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Tag, Coffee, MapPin, Newspaper, Megaphone } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { NotificationPreferences } from '@/types';

export function NotificationsView() {
  const { user, setView, setUser, showToast } = useStore();

  if (!user) return null;

  const preferences = user.notificationPreferences || {
    offers: true,
    orders: true,
    news: false,
    moodAlerts: true,
    nearbyCafes: true,
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    const updatedPreferences = { ...preferences, [key]: !preferences[key] };
    setUser({ ...user, notificationPreferences: updatedPreferences });
    
    // Show toast for feedback
    const status = updatedPreferences[key] ? 'enabled' : 'disabled';
    const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    showToast(`${label} notifications ${status}`, 'info');
  };

  const notificationTypes = [
    {
      id: 'orders',
      title: 'Order Updates',
      description: 'Get notified about your order status and delivery',
      icon: Coffee,
      color: 'text-amber-400'
    },
    {
      id: 'offers',
      title: 'Special Offers',
      description: 'Exclusive discounts and personalized promotions',
      icon: Tag,
      color: 'text-green-400'
    },
    {
      id: 'moodAlerts',
      title: 'Mood Recommendations',
      description: 'Daily coffee suggestions based on your mood',
      icon: Bell,
      color: 'text-purple-400'
    },
    {
      id: 'nearbyCafes',
      title: 'Nearby Cafes',
      description: 'Alerts when you are near your favorite coffee spots',
      icon: MapPin,
      color: 'text-blue-400'
    },
    {
      id: 'news',
      title: 'Coffee News',
      description: 'Latest trends, brewing tips, and community stories',
      icon: Newspaper,
      color: 'text-orange-400'
    }
  ];

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
           className="glass-card p-6 md:p-8"
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-amber-400" />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-white">Notifications</h1>
               <p className="text-white/60 text-sm">Manage how we communicate with you</p>
             </div>
          </div>

          <div className="space-y-6">
            {notificationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg bg-white/5 ${type.color}`}>
                    <type.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{type.title}</h3>
                    <p className="text-white/50 text-sm">{type.description}</p>
                  </div>
                </div>

                <Switch
                  checked={preferences[type.id as keyof NotificationPreferences]}
                  onCheckedChange={() => handleToggle(type.id as keyof NotificationPreferences)}
                  className="data-[state=checked]:bg-amber-500"
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
             <p className="text-blue-400 text-sm font-medium mb-1">Note</p>
             <p className="text-white/60 text-xs">
                Important account/security alerts will always be sent to your email regardless of these settings.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

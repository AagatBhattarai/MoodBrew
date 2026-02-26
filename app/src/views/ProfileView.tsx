import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  LogOut,
  Edit2,
  Award,
  Coffee,
  TrendingUp,
  ChevronRight,
  Flame,
  Star,
  Heart,
  Leaf,
  Users,
  Calendar,
  Mountain,
  Target,
} from "lucide-react";
import { useStore } from "@/store";
import { moodConfigs, coffeeProducts, cafes } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileView() {
  const { user, logout, setView, showToast } = useStore();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) return null;

  const achievements = [
    {
      id: 1,
      name: "First Sip",
      description: "Place your first order",
      icon: Coffee,
      unlocked: true,
      date: "Jan 2024",
    },
    {
      id: 2,
      name: "Streak Starter",
      description: "3-day ordering streak",
      icon: Flame,
      unlocked: true,
      date: "Feb 2024",
    },
    {
      id: 3,
      name: "Cafe Explorer",
      description: "Visit 5 different cafes",
      icon: MapPin,
      unlocked: true,
      date: "Feb 2024",
    },
    {
      id: 4,
      name: "Nepali Origin Explorer",
      description: "Try 5 different Nepali origin coffees",
      icon: Mountain,
      unlocked: false,
      progress: 3,
      total: 5,
    },
    {
      id: 5,
      name: "Loyal Customer",
      description: "Place 50 orders",
      icon: Heart,
      unlocked: false,
      progress: 42,
      total: 50,
    },
    {
      id: 6,
      name: "Top 10",
      description: "Reach top 10 on leaderboard",
      icon: Award,
      unlocked: false,
      progress: 5,
      total: 10,
    },
    {
      id: 7,
      name: "Eco Warrior",
      description: "Save 10kg CO2 by choosing local",
      icon: Leaf,
      unlocked: false,
      progress: 12.5,
      total: 20,
    },
    {
      id: 8,
      name: "Farmer Supporter",
      description: "Support 10 local farmers",
      icon: Users,
      unlocked: false,
      progress: 8,
      total: 10,
    },
  ];

  const spendingData = [
    { month: "Jan", amount: 2400 },
    { month: "Feb", amount: 3200 },
    { month: "Mar", amount: 2800 },
    { month: "Apr", amount: 4100 },
    { month: "May", amount: 3600 },
    { month: "Jun", amount: 2900 },
  ];

  // Mock mood history
  const moodHistory = [
    { date: "Today", mood: "energized", drink: "Himalayan Arabica" },
    { date: "Yesterday", mood: "cozy", drink: "Palpa Honey Latte" },
    { date: "2 days ago", mood: "focused", drink: "Everest Sunrise Drip" },
    { date: "3 days ago", mood: "relaxed", drink: "Annapurna Cold Brew" },
    { date: "4 days ago", mood: "adventurous", drink: "Nepali Spice Coffee" },
  ];

  const menuItems = [
    {
      icon: Edit2,
      label: "Edit Profile",
      action: () => setView("edit-profile"),
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      action: () => setView("payment-methods"),
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      action: () => setView("saved-addresses"),
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => setView("notifications"),
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      action: () => setView("privacy-security"),
    },
    { icon: Settings, label: "Settings", action: () => setView("settings") },
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-amber-500/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-3xl font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user.stats.level}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {user.name}
              </h1>
              <p className="text-white/60 mb-3">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge className="bg-amber-500/20 text-amber-400">
                  <Award className="w-3 h-3 mr-1" />
                  Level {user.stats.level}
                </Badge>
                <Badge className="bg-white/10 text-white/80">
                  <Star className="w-3 h-3 mr-1" />
                  {user.stats.points} Points
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400">
                  <Flame className="w-3 h-3 mr-1" />
                  {user.stats.currentStreak} Day Streak
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              className="glass border-white/10 text-white hover:bg-white/10"
              onClick={() => setView("edit-profile")}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Level Progress */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">
                Progress to Level {user.stats.level + 1}
              </span>
              <span className="text-white text-sm">
                {user.stats.points % 500}/500 XP
              </span>
            </div>
            <Progress
              value={(user.stats.points % 500) / 5}
              className="h-2 bg-white/10"
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {user.stats.totalOrders}
            </p>
            <p className="text-white/50 text-sm">Orders</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              Rs. {user.stats.totalSpent.toLocaleString()}
            </p>
            <p className="text-white/50 text-sm">Total Spent</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {user.stats.currentStreak}
            </p>
            <p className="text-white/50 text-sm">Current Streak</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {achievements.filter((a) => a.unlocked).length}
            </p>
            <p className="text-white/50 text-sm">Achievements</p>
          </div>
        </motion.div>

        {/* Nepali Impact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-6 border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Mountain className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Your Nepali Impact
              </h3>
              <p className="text-white/50 text-sm">
                By choosing local, you're making a difference
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-green-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-400" />
                <span className="text-white/60 text-sm">CO₂ Saved</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {user.stats.co2Saved}kg
              </p>
              <p className="text-white/40 text-xs">
                By choosing local over imported
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-white/60 text-sm">Farmers Supported</span>
              </div>
              <p className="text-2xl font-bold text-amber-400">
                {user.stats.farmersSupported}
              </p>
              <p className="text-white/40 text-xs">Local farming families</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-white/60 text-sm">Nepali Drinks</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">18</p>
              <p className="text-white/40 text-xs">Origin coffees tried</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass border-white/10 mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-amber-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-amber-500"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="mood"
                className="data-[state=active]:bg-amber-500"
              >
                Mood History
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-amber-500"
              >
                Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              {/* Favorites */}
              <div className="glass-card p-5 mb-6">
                <h3 className="font-semibold text-white mb-4">
                  Your Favorites
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    {user.stats.favoriteDrink && (
                      <img
                        src={
                          coffeeProducts.find((p) =>
                            p.name.includes(user.stats.favoriteDrink || ""),
                          )?.image ||
                          "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=600&fit=crop"
                        }
                        alt={user.stats.favoriteDrink || "Favorite Drink"}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    )}
                    <div className="relative z-20">
                      <p className="text-white/70 text-sm mb-1">
                        Favorite Drink
                      </p>
                      <p className="text-white text-lg font-bold flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-amber-400" />
                        {user.stats.favoriteDrink || "Not set yet"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    {user.stats.favoriteCafe && (
                      <img
                        src={
                          cafes.find((c) => c.name === user.stats.favoriteCafe)
                            ?.image ||
                          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop"
                        }
                        alt={user.stats.favoriteCafe || "Favorite Cafe"}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    )}
                    <div className="relative z-20">
                      <p className="text-white/70 text-sm mb-1">
                        Favorite Cafe
                      </p>
                      <p className="text-white text-lg font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-400" />
                        {user.stats.favoriteCafe || "Not set yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card overflow-hidden">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <span className="flex-1 text-white text-left">
                      {item.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </motion.button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass-card p-5 ${
                      achievement.unlocked
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          achievement.unlocked
                            ? "bg-amber-500/20"
                            : "bg-white/5"
                        }`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 ${
                            achievement.unlocked
                              ? "text-amber-400"
                              : "text-white/40"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">
                            {achievement.name}
                          </h4>
                          {achievement.unlocked && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/50 text-sm mb-2">
                          {achievement.description}
                        </p>

                        {!achievement.unlocked && "progress" in achievement && (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-white/40">Progress</span>
                              <span className="text-white/60">
                                {achievement.progress}/{achievement.total}
                              </span>
                            </div>
                            <Progress
                              value={
                                (achievement.progress! / achievement.total!) *
                                100
                              }
                              className="h-1.5 bg-white/10"
                            />
                          </div>
                        )}

                        {achievement.unlocked && (
                          <p className="text-white/40 text-xs">
                            Unlocked {achievement.date}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mood" className="mt-0">
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-4">
                  Your Mood Journey
                </h3>
                <div className="space-y-4">
                  {moodHistory.map((entry, index) => {
                    const moodConfig = moodConfigs.find(
                      (m) => m.id === entry.mood,
                    );
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{
                            backgroundColor: moodConfig?.color
                              .replace("hsl", "hsla")
                              .replace(")", " / 0.2)"),
                          }}
                        >
                          {moodConfig?.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {moodConfig?.label}
                          </p>
                          <p className="text-white/50 text-sm">{entry.drink}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-sm">{entry.date}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              {/* Monthly Spending */}
              <div className="glass-card p-5 mb-6">
                <h3 className="font-semibold text-white mb-4">
                  Monthly Spending
                </h3>
                <div className="flex items-end justify-between h-40 gap-2">
                  {spendingData.map((data, index) => (
                    <div
                      key={data.month}
                      className="flex-1 flex flex-col items-center"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.amount / 5000) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-amber-500 to-amber-400"
                      />
                      <span className="text-white/50 text-xs mt-2">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 font-medium mb-1">
                      Money Saver!
                    </p>
                    <p className="text-white/70 text-sm">
                      You saved Rs. 420 this month by choosing medium roasts
                      over dark roasts. Keep it up!
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 font-medium mb-1">
                      Nepali Coffee Lover!
                    </p>
                    <p className="text-white/70 text-sm">
                      75% of your orders are Nepali origin coffees. You're
                      supporting local farmers!
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-400 font-medium mb-1">
                      Cafe Loyalty
                    </p>
                    <p className="text-white/70 text-sm">
                      You've visited Himalayan Java 12 times this month. They
                      must be doing something right!
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-purple-400 font-medium mb-1">
                      Flavor Profile
                    </p>
                    <p className="text-white/70 text-sm">
                      You love floral and citrus notes! Try our Ilam Floral
                      Espresso Martini (87% match).
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={logout}
            variant="outline"
            className="w-full glass border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

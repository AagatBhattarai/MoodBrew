import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Coffee, Star, Flame, Award, ChevronRight } from 'lucide-react';
import { useStore } from '@/store';
import { leaderboardData } from '@/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function RankingsView() {
  const { user } = useStore();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-white/40 font-semibold">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400/20 to-amber-500/20 border-yellow-400/30';
      case 2:
        return 'from-slate-300/20 to-slate-400/20 border-slate-300/30';
      case 3:
        return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default:
        return 'from-white/5 to-white/10 border-white/10';
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Pokhara <span className="text-gradient">Coffee Champions</span>
          </h1>
          <p className="text-white/60">See who's leading the coffee culture in our city</p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="glass p-1 rounded-xl inline-flex">
            {(['weekly', 'monthly', 'alltime'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  timeRange === range
                    ? 'bg-amber-500 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {range === 'alltime' ? 'All Time' : range}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-end justify-center gap-4 md:gap-8">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-3">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 p-1">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                      <Avatar className="w-full h-full">
                        <AvatarFallback className="bg-slate-700 text-white text-2xl font-bold">
                          {topThree[1].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-sm">2</span>
                  </div>
                </div>
                <p className="text-white font-semibold text-center">{topThree[1].name}</p>
                <p className="text-slate-300 text-sm">{topThree[1].points.toLocaleString()} pts</p>
                <div className="mt-2 w-24 md:w-32 h-24 md:h-32 glass-card rounded-t-xl bg-gradient-to-b from-slate-300/20 to-slate-400/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-slate-300" />
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center -mt-4"
              >
                <div className="relative mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                  >
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-1">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                      <Avatar className="w-full h-full">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-3xl font-bold">
                          {topThree[0].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-slate-800 font-bold">1</span>
                  </div>
                </div>
                <p className="text-white font-bold text-lg text-center">{topThree[0].name}</p>
                <p className="text-amber-400 text-sm font-semibold">{topThree[0].points.toLocaleString()} pts</p>
                <Badge className="mt-1 bg-amber-500/20 text-amber-400">
                  <Coffee className="w-3 h-3 mr-1" />
                  {topThree[0].favoriteDrink}
                </Badge>
                <div className="mt-2 w-28 md:w-40 h-32 md:h-40 glass-card rounded-t-xl bg-gradient-to-b from-yellow-400/20 to-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-3">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 p-1">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                      <Avatar className="w-full h-full">
                        <AvatarFallback className="bg-amber-800 text-white text-2xl font-bold">
                          {topThree[2].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <p className="text-white font-semibold text-center">{topThree[2].name}</p>
                <p className="text-amber-600 text-sm">{topThree[2].points.toLocaleString()} pts</p>
                <div className="mt-2 w-24 md:w-32 h-16 md:h-24 glass-card rounded-t-xl bg-gradient-to-b from-amber-600/20 to-amber-700/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-amber-600" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Leaderboard
          </h2>

          <div className="space-y-3">
            {rest.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className={`glass-card p-4 flex items-center gap-4 ${
                  entry.isCurrentUser ? 'border-amber-500/50 bg-amber-500/5' : ''
                }`}
              >
                <div className="w-10 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="w-12 h-12 border-2 border-white/20">
                  <AvatarFallback className={`bg-gradient-to-br ${
                    entry.isCurrentUser 
                      ? 'from-amber-500 to-orange-600' 
                      : 'from-slate-600 to-slate-700'
                  } text-white font-semibold`}>
                    {entry.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${entry.isCurrentUser ? 'text-amber-400' : 'text-white'}`}>
                      {entry.name}
                    </p>
                    {entry.isCurrentUser && (
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs">You</Badge>
                    )}
                  </div>
                  <p className="text-white/50 text-sm flex items-center gap-1">
                    <Coffee className="w-3 h-3" />
                    {entry.favoriteDrink}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-white font-bold">{entry.points.toLocaleString()}</p>
                  <p className="text-white/50 text-xs">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Your Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Your Journey
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-white">{user.stats.totalOrders}</p>
                <p className="text-white/50 text-sm">Total Orders</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-amber-400">{user.stats.points}</p>
                <p className="text-white/50 text-sm">Points</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-white">{user.stats.currentStreak}</p>
                <p className="text-white/50 text-sm">Day Streak</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-bold text-white">{user.stats.level}</p>
                <p className="text-white/50 text-sm">Level</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium mb-1">Keep the streak alive!</p>
                  <p className="text-white/60 text-sm">
                    Order today to maintain your {user.stats.currentStreak}-day streak
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

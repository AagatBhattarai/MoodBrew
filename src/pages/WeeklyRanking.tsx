import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api, type RankingEntry } from '../lib/api';

const LEVEL_TITLES = ['', 'Newcomer', 'Regular', 'Connoisseur', 'Expert', 'Master Brewer', 'Legend'];
const RANK_MEDALS = ['🥇', '🥈', '🥉'];

interface WeeklyRankingProps { onBack?: () => void; }

export function WeeklyRanking({ onBack }: WeeklyRankingProps) {
    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.ranking.getAll()
            .then(({ ranking: rows, currentUserId: uid }) => {
                setRanking(rows);
                setCurrentUserId(uid);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="flex flex-col gap-lg">
            {onBack && (
                <Button variant="outline" onClick={onBack} className="self-start">← Back to Home</Button>
            )}

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Card glass className="relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="text-6xl">🏆</div>
                        <div>
                            <h2 className="text-3xl font-black gradient-text">Weekly Ranking</h2>
                            <p className="text-text-secondary text-sm">Pokhara's top MoodBrew explorers this week</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Podium (top 3) */}
            {!isLoading && ranking.length >= 3 && (
                <motion.div
                    className="grid grid-cols-3 gap-3 items-end"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* 2nd */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="text-3xl">🥈</div>
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-gray-400/20 to-gray-300/10 border border-gray-400/20 py-4 px-2 h-28 flex flex-col items-center justify-end">
                            <p className="font-bold text-text-primary text-sm">{ranking[1]?.name}</p>
                            <p className="text-primary font-black">{ranking[1]?.xp.toLocaleString()} XP</p>
                        </div>
                    </div>
                    {/* 1st */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <motion.div className="text-4xl" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>🥇</motion.div>
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-amber-400/30 to-yellow-300/10 border border-amber-400/30 py-4 px-2 h-36 flex flex-col items-center justify-end">
                            <p className="font-bold text-text-primary text-sm">{ranking[0]?.name}</p>
                            <p className="text-amber-500 font-black text-lg">{ranking[0]?.xp.toLocaleString()} XP</p>
                        </div>
                    </div>
                    {/* 3rd */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="text-3xl">🥉</div>
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-orange-700/20 to-orange-600/10 border border-orange-600/20 py-4 px-2 h-20 flex flex-col items-center justify-end">
                            <p className="font-bold text-text-primary text-sm">{ranking[2]?.name}</p>
                            <p className="text-orange-500 font-black">{ranking[2]?.xp.toLocaleString()} XP</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Full leaderboard */}
            <Card glass glowOnHover>
                <h3 className="text-lg font-bold text-text-primary mb-4">Full Leaderboard</h3>

                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 rounded-xl bg-background/50 animate-pulse" />
                        ))}
                    </div>
                ) : ranking.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">No rankings yet. Place your first order!</div>
                ) : (
                    <AnimatePresence>
                        {ranking.map((entry, i) => {
                            const isCurrentUser = entry.userId === currentUserId;
                            const medal = RANK_MEDALS[i] || null;
                            return (
                                <motion.div
                                    key={entry.userId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`flex items-center gap-4 p-4 rounded-xl mb-2 transition ${isCurrentUser
                                        ? 'bg-primary/15 border-2 border-primary/40 ring-1 ring-primary/20'
                                        : 'bg-background/50 hover:bg-background'
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="w-8 text-center">
                                        {medal ? (
                                            <span className="text-xl">{medal}</span>
                                        ) : (
                                            <span className="text-body-sm font-bold text-text-secondary">#{entry.rank}</span>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isCurrentUser ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                                        }`}>
                                        {entry.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-bold text-sm truncate ${isCurrentUser ? 'text-primary' : 'text-text-primary'}`}>
                                                {entry.name} {isCurrentUser && '(You)'}
                                            </p>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold flex-shrink-0">
                                                Lv.{entry.level}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-secondary truncate">📍 {entry.cafe}</p>
                                    </div>

                                    {/* XP */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-black text-text-primary">{entry.xp.toLocaleString()}</p>
                                        <p className="text-xs text-text-secondary">XP</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </Card>

            {/* Level guide */}
            <Card glass>
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Level Guide</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LEVEL_TITLES.slice(1).map((title, i) => (
                        <div key={title} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background">
                            <span className="text-xs font-black text-primary">Lv.{i + 1}</span>
                            <span className="text-xs text-text-secondary">{title}</span>
                            <span className="text-xs text-text-secondary ml-auto">{i * 500}+ XP</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

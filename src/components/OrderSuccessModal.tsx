import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    earnedXP: number;
    earnedPoints: number;
    levelUp: boolean;
    newLevel: number;
    orderTotal: number;
    productName: string;
    onViewOrders: () => void;
}

export function OrderSuccessModal({
    isOpen, onClose, earnedXP, earnedPoints, levelUp, newLevel, orderTotal, productName, onViewOrders
}: OrderSuccessModalProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            const t = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}

                    <motion.div
                        className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl text-center max-w-sm w-full mx-4"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 30 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Animated background glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-primary/20 rounded-3xl"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        <div className="relative z-10">
                            {/* Checkmark */}
                            <motion.div
                                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-5xl"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
                            >
                                ✅
                            </motion.div>

                            <motion.h2
                                className="text-3xl font-black text-white mb-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Brewing Success!
                            </motion.h2>
                            <motion.p
                                className="text-white/60 mb-5 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Your <strong className="text-white">{productName}</strong> is being prepared.
                            </motion.p>

                            {/* XP & Points earned */}
                            <motion.div
                                className="flex items-center gap-4 justify-center rounded-2xl bg-white/5 p-4 border border-white/10 mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">XP Gained</p>
                                    <p className="text-2xl font-black text-amber-400">+{earnedXP} XP</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Points</p>
                                    <p className="text-2xl font-black text-primary">+{earnedPoints}</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-2xl font-black text-white">${orderTotal.toFixed(2)}</p>
                                </div>
                            </motion.div>

                            {/* Level up banner */}
                            <AnimatePresence>
                                {levelUp && (
                                    <motion.div
                                        className="mb-4 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/30 to-orange-500/30 border border-amber-400/30"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7, type: 'spring' }}
                                    >
                                        <p className="text-amber-300 font-black text-lg">🎉 Level Up! You're now Level {newLevel}!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-3 mt-2">
                                <motion.button
                                    className="flex-1 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition"
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => { onClose(); onViewOrders(); }}
                                >
                                    My Orders →
                                </motion.button>
                                <motion.button
                                    className="px-4 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition"
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                >
                                    Done
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

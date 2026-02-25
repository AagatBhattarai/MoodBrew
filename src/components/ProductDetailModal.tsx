import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, type Product } from '../lib/api';
import { OrderSuccessModal } from './OrderSuccessModal';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailModalProps {
    product: Product | null;
    selectedMood: string | null;
    onClose: () => void;
    onViewOrders: () => void;
}

export function ProductDetailModal({ product, selectedMood, onClose, onViewOrders }: ProductDetailModalProps) {
    const { session } = useAuth();
    const [isOrdering, setIsOrdering] = useState(false);
    const [successData, setSuccessData] = useState<{
        earnedXP: number; earnedPoints: number; levelUp: boolean; newLevel: number;
    } | null>(null);

    if (!product) return null;

    const handleOrder = async () => {
        if (!session?.token) return;
        setIsOrdering(true);
        try {
            const orderItem = {
                productId: String(product.id),
                name: product.name,
                basePrice: product.price,
                quantity: 1,
                moodContext: selectedMood || undefined,
                totalItemPrice: product.price,
            };
            const result = await api.orders.create({
                items: [orderItem],
                total_amount: product.price,
            });
            const g = result.gamification || { earnedXP: 20, earnedPoints: 10, levelUp: false, newLevel: 1 };
            setSuccessData({ earnedXP: g.earnedXP, earnedPoints: g.earnedPoints, levelUp: g.levelUp, newLevel: g.newLevel });
        } catch (e) {
            console.error('Order failed:', e);
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {!successData && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-2xl border border-white/10"
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Product image */}
                            <div className="relative h-52 w-full overflow-hidden">
                                <motion.img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Badge */}
                                {product.badge && (
                                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">
                                        {product.badge}
                                    </span>
                                )}

                                {/* Close button */}
                                <motion.button
                                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center text-lg"
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                >
                                    ✕
                                </motion.button>

                                {/* Price */}
                                <div className="absolute bottom-4 right-4">
                                    <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h2 className="text-2xl font-black text-text-primary mb-1">{product.name}</h2>
                                <p className="text-sm text-text-secondary mb-3">{product.description}</p>

                                {/* Flavor profile chips */}
                                {product.flavor_profile && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {product.flavor_profile.split(',').map(f => (
                                            <span key={f} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                                {f.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Mood match indicator */}
                                {selectedMood && (
                                    <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
                                        <span className="text-sm">✨</span>
                                        <p className="text-sm text-secondary font-semibold capitalize">
                                            Perfect for your <strong>{selectedMood}</strong> mood
                                        </p>
                                    </div>
                                )}

                                {/* XP preview */}
                                <div className="mb-5 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/20">
                                    <span>⚡</span>
                                    <p className="text-sm text-amber-600 font-semibold">
                                        Earn ~{20 + Math.floor(product.price * 2)} XP with this order
                                    </p>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    className={`w-full py-4 rounded-2xl font-black text-lg transition ${isOrdering
                                            ? 'bg-primary/50 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30'
                                        }`}
                                    whileHover={isOrdering ? {} : { scale: 1.02 }}
                                    whileTap={isOrdering ? {} : { scale: 0.98 }}
                                    onClick={handleOrder}
                                    disabled={isOrdering}
                                >
                                    {isOrdering ? '☕ Placing Order...' : `Order Now · $${product.price.toFixed(2)}`}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success modal */}
            {successData && (
                <OrderSuccessModal
                    isOpen={!!successData}
                    onClose={() => { setSuccessData(null); onClose(); }}
                    earnedXP={successData.earnedXP}
                    earnedPoints={successData.earnedPoints}
                    levelUp={successData.levelUp}
                    newLevel={successData.newLevel}
                    orderTotal={product.price}
                    productName={product.name}
                    onViewOrders={onViewOrders}
                />
            )}
        </>
    );
}

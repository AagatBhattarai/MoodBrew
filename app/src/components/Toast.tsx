import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useStore } from '@/store';

export function Toast() {
  const { toast, hideToast } = useStore();

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };

  const colors = {
    success: 'text-green-400 bg-green-500/10 border-green-500/20',
    error: 'text-red-400 bg-red-500/10 border-red-500/20',
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <AnimatePresence>
      {toast?.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className={`glass px-4 py-3 rounded-xl flex items-center gap-3 border ${colors[toast.type]}`}>
            {(() => {
              const Icon = icons[toast.type];
              return <Icon className="w-5 h-5" />;
            })()}
            <span className="text-sm font-medium text-white">{toast.message}</span>
            <button
              onClick={hideToast}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

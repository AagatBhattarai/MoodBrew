import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { modalOverlayVariants, modalContentVariants, scaleIn } from './animations';

interface CheckInButtonProps {
  cafeId: string;
  cafeName: string;
  onCheckIn?: () => void;
  className?: string;
}

export function CheckInButton({ cafeId, cafeName, onCheckIn, className = '' }: CheckInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Would call actual API here
    console.log('Check-in:', { cafeId, cafeName, notes });
    
    setIsCheckedIn(true);
    setIsLoading(false);
    
    if (onCheckIn) {
      onCheckIn();
    }
    
    // Close after showing success
    setTimeout(() => {
      setIsOpen(false);
      setIsCheckedIn(false);
      setNotes('');
    }, 2000);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <span className="text-lg mr-2">📍</span>
        Check In
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              variants={modalOverlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => !isLoading && setIsOpen(false)}
            />
            
            <motion.div
              variants={modalContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative z-10 w-full max-w-md"
            >
              <Card glass className="p-lg">
                {!isCheckedIn ? (
                  <div className="flex flex-col gap-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-h3 text-text-primary">Check In</h3>
                        <p className="text-body-md font-semibold text-primary mt-1">{cafeName}</p>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-text-secondary hover:text-text-primary transition"
                        disabled={isLoading}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col gap-xs">
                      <label htmlFor="notes" className="text-body-sm font-semibold text-text-primary">
                        Add a note (optional)
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="How's the coffee? Any thoughts?"
                        className="rounded-lg border border-background bg-surface px-md py-3 text-body-md text-text-primary focus:border-primary focus:outline-none resize-none"
                        rows={3}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center gap-sm p-sm rounded-lg bg-primary/5">
                      <span className="text-body-sm">📍</span>
                      <p className="text-body-sm text-text-secondary">
                        Location will be verified for this check-in
                      </p>
                    </div>

                    <Button
                      onClick={handleCheckIn}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            className="h-4 w-4 rounded-full border-2 border-surface border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          <span>Checking in...</span>
                        </div>
                      ) : (
                        'Check In Now'
                      )}
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col items-center gap-md py-xl"
                  >
                    <motion.div
                      className="text-6xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    >
                      ✅
                    </motion.div>
                    <div className="text-center">
                      <h3 className="text-h3 text-text-primary">Checked In!</h3>
                      <p className="text-body-md text-text-secondary mt-1">
                        Enjoy your time at {cafeName}
                      </p>
                    </div>
                    <motion.div
                      className="flex items-center gap-2 text-primary"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-body-sm font-semibold">+10 XP</span>
                      <span className="text-body-sm">✨</span>
                    </motion.div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

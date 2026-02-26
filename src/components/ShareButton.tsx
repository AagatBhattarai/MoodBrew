import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { modalOverlayVariants, modalContentVariants } from './animations';

interface ShareButtonProps {
  shareableType: 'cafe' | 'product' | 'check_in' | 'review';
  shareableId: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButton({ shareableType, shareableId, title, description, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/${shareableType}/${shareableId}`;

  const handleShare = (platform: string) => {
    const text = `Check out ${title} on MoodBrew!`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
    
    // Log share (would call API)
    console.log('Shared:', { shareableType, shareableId, platform });
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <span className="text-lg mr-2">🔗</span>
        Share
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
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              variants={modalContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative z-10 w-full max-w-md"
            >
              <Card glass className="p-lg">
                <div className="flex flex-col gap-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-h3 text-text-primary">Share</h3>
                      <p className="text-body-sm text-text-secondary mt-1">{title}</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-text-secondary hover:text-text-primary transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <motion.button
                      onClick={() => handleShare('twitter')}
                      className="flex flex-col items-center gap-2 p-md rounded-lg bg-surface hover:bg-primary/5 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl">🐦</span>
                      <span className="text-body-sm font-semibold">Twitter</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleShare('facebook')}
                      className="flex flex-col items-center gap-2 p-md rounded-lg bg-surface hover:bg-primary/5 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl">📘</span>
                      <span className="text-body-sm font-semibold">Facebook</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleShare('whatsapp')}
                      className="flex flex-col items-center gap-2 p-md rounded-lg bg-surface hover:bg-primary/5 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl">💬</span>
                      <span className="text-body-sm font-semibold">WhatsApp</span>
                    </motion.button>

                    <motion.button
                      onClick={handleCopyLink}
                      className="flex flex-col items-center gap-2 p-md rounded-lg bg-surface hover:bg-primary/5 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl">{copied ? '✓' : '🔗'}</span>
                      <span className="text-body-sm font-semibold">
                        {copied ? 'Copied!' : 'Copy Link'}
                      </span>
                    </motion.button>
                  </div>

                  {description && (
                    <div className="mt-2 p-sm rounded-lg bg-primary/5">
                      <p className="text-body-sm text-text-secondary">{description}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

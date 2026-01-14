import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element (in production, use actual cafe ambiance sound file)
    const ambiance = new Audio();
    // ambiance.src = '/sounds/cafe-ambiance.mp3';
    ambiance.loop = true;
    ambiance.volume = 0.3;
    setAudio(ambiance);

    return () => {
      ambiance.pause();
    };
  }, []);

  const toggleSound = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // audio.play().catch(console.error); // Uncomment when you have actual audio file
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={toggleSound}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-surface shadow-lg flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isPlaying ? {
        boxShadow: [
          '0 4px 20px rgba(74, 44, 42, 0.3)',
          '0 4px 30px rgba(74, 44, 42, 0.5)',
          '0 4px 20px rgba(74, 44, 42, 0.3)',
        ],
      } : {}}
      transition={{
        duration: 2,
        repeat: isPlaying ? Infinity : 0,
      }}
    >
      <motion.span
        className="text-2xl"
        animate={isPlaying ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: isPlaying ? Infinity : 0,
        }}
      >
        {isPlaying ? '🔊' : '🔇'}
      </motion.span>
    </motion.button>
  );
}

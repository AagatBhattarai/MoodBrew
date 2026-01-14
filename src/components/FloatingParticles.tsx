import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

interface FloatingParticlesProps {
  mood?: string;
  count?: number;
}

// Single coffee bean for pure, clean cafe aesthetic
const cafeParticles = ['🫘']; // Just the coffee bean!

const moodParticles = {
  energized: cafeParticles,
  relaxed: cafeParticles,
  creative: cafeParticles,
  social: cafeParticles,
  cozy: cafeParticles,
  default: cafeParticles,
};

export function FloatingParticles({ mood = 'default', count = 15 }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const emojis = moodParticles[mood as keyof typeof moodParticles] || moodParticles.default;
    
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      // Position only in side margins: 0-12% (left) or 88-100% (right)
      x: i % 2 === 0 
        ? Math.random() * 12  // Left margin
        : 88 + Math.random() * 12,  // Right margin
      y: Math.random() * 100,
      size: 40, // Larger size for better visibility
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, [mood, count]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => {
        // Calculate distance from mouse
        const dx = (particle.x / 100) * window.innerWidth - mousePos.x;
        const dy = (particle.y / 100) * window.innerHeight - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelStrength = Math.max(0, 100 - distance) / 100;

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size * 1.4}px`, // Oval shape (taller than wide)
              borderRadius: '45% 45% 48% 48% / 48% 48% 45% 45%', // Coffee bean shape
              backgroundColor: '#6F4E37', // Coffee brown color
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(111,78,55,0.4)', // 3D effect
              position: 'relative',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.6, 0.85, 0.6], // More visible opacity range
              y: [0, -30, 0],
              x: repelStrength > 0 ? (dx > 0 ? 20 : -20) * repelStrength : 0,
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          >
            {/* Center crease line (characteristic of coffee bean) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                height: '2px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '2px',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

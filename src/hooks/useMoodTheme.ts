import { useEffect } from 'react';

export const moodThemes = {
  energized: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#FFC857',
    background: '#FFF8E7',
    gradient: 'from-orange-400 via-yellow-400 to-red-400',
  },
  relaxed: {
    primary: '#4A7C59',
    secondary: '#6B9080',
    accent: '#A4C3B2',
    background: '#F0F4F0',
    gradient: 'from-green-400 via-teal-400 to-blue-400',
  },
  creative: {
    primary: '#9B59B6',
    secondary: '#E74C3C',
    accent: '#F39C12',
    background: '#FDF6FF',
    gradient: 'from-purple-400 via-pink-400 to-red-400',
  },
  social: {
    primary: '#E91E63',
    secondary: '#FF4081',
    accent: '#FFB3D9',
    background: '#FFF0F5',
    gradient: 'from-pink-400 via-rose-400 to-red-400',
  },
  cozy: {
    primary: '#4A2C2A',
    secondary: '#6F4E37',
    accent: '#D4A574',
    background: '#F5E6D3',
    gradient: 'from-amber-600 via-orange-500 to-yellow-600',
  },
};

export function useMoodTheme(mood: string | null) {
  useEffect(() => {
    if (!mood) return;

    const theme = moodThemes[mood as keyof typeof moodThemes] || moodThemes.cozy;
    const root = document.documentElement;

    // Apply theme colors with smooth transition
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    
    // Add transition class
    root.style.transition = 'background-color 0.8s ease, color 0.8s ease';

    return () => {
      // Reset to default cozy theme
      const defaultTheme = moodThemes.cozy;
      root.style.setProperty('--color-primary', defaultTheme.primary);
      root.style.setProperty('--color-secondary', defaultTheme.secondary);
      root.style.setProperty('--color-accent', defaultTheme.accent);
      root.style.setProperty('--color-background', defaultTheme.background);
    };
  }, [mood]);

  return moodThemes[mood as keyof typeof moodThemes] || moodThemes.cozy;
}

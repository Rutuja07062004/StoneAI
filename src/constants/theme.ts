const sharedColors = {
  primary: '#D4AF37', // Gold
  accent: '#FFD700',  // Bright Gold
  surface: '#121212',
  card: '#1A1A1A',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(212, 175, 55, 0.2)',
};

export const COLORS = {
  light: {
    text: '#FFFFFF',
    background: '#000000',
    tint: sharedColors.primary,
    icon: '#A0A0A0',
    tabIconDefault: '#666666',
    tabIconSelected: sharedColors.primary,
    ...sharedColors,
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: sharedColors.primary,
    icon: '#A0A0A0',
    tabIconDefault: '#666666',
    tabIconSelected: sharedColors.primary,
    ...sharedColors,
  },
  // Keep flat versions for convenience in custom components
  ...sharedColors,
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  background: '#000000',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 20,
  extraLarge: 24,
  title: 32,
  radius: 16,
  padding: 20,
};

export const SHADOWS = {
  gold: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};

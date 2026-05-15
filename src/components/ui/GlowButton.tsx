import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';

interface GlowButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  onPress,
  loading,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      style={[styles.container, style]} 
      {...props}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{loading ? 'Processing...' : title}</Text>
      </LinearGradient>
      <View style={styles.glow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    position: 'relative',
    marginVertical: SIZES.base,
    ...SHADOWS.gold,
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
  },
  text: {
    color: COLORS.background,
    fontSize: SIZES.font,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
    zIndex: -1,
    transform: [{ scale: 1.05 }],
  },
});

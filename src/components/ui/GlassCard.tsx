import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/constants/theme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  borderRadius = SIZES.radius,
  borderWidth = 1,
  borderColor = COLORS.glassBorder,
  backgroundColor = COLORS.glass,
  padding = SIZES.padding,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderWidth,
          borderColor,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : backgroundColor,
        },
        style,
      ]}
      {...props}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={intensity}
          tint="dark"
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      )}
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    padding: SIZES.padding,
  },
});

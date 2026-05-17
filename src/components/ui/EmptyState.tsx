import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  minHeight?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  minHeight = 150,
}) => {
  return (
    <View style={[styles.container, { minHeight }]}>
      <View style={styles.iconContainer}>
        <Icon size={32} color={COLORS.primary} opacity={0.8} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderStyle: 'dashed',
    marginVertical: SIZES.base,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    color: COLORS.textMuted,
    fontSize: SIZES.font,
    textAlign: 'center',
    marginTop: SIZES.base,
    maxWidth: '80%',
  },
});

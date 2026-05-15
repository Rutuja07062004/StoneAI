import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MapPin } from 'lucide-react-native';

interface SafeMapProps {
  latitude: number;
  longitude: number;
  style?: ViewStyle;
}

export const SafeMap: React.FC<SafeMapProps> = ({ latitude, longitude, style }) => {
  return (
    <View style={[styles.mapPlaceholder, style]}>
      <MapPin color={COLORS.primary} size={32} style={{ marginBottom: 8 }} />
      <Text style={styles.text}>Map View (Web)</Text>
      <Text style={styles.coords}>{latitude.toFixed(4)}, {longitude.toFixed(4)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mapPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  coords: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  }
});

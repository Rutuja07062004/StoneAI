import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { COLORS } from '@/constants/theme';

interface SafeMapProps {
  latitude: number;
  longitude: number;
  style?: ViewStyle;
}

export const SafeMap: React.FC<SafeMapProps> = ({ latitude, longitude, style }) => {
  return (
    <MapView
      style={[styles.map, style]}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      userInterfaceStyle="dark"
    >
      <Marker coordinate={{ latitude, longitude }}>
        <View style={styles.markerContainer}>
          <View style={styles.markerCircle}>
            <View style={styles.markerInner} />
          </View>
        </View>
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

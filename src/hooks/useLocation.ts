import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      // Reverse geocoding
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let addressData = {};
      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        addressData = {
          city: place.city || place.subregion,
          state: place.region,
          country: place.country,
          address: `${place.city || ''}, ${place.region || ''}`.trim().replace(/^, |, $/g, ''),
        };
      }

      const fullLocation = {
        latitude,
        longitude,
        ...addressData,
      };

      setLocation(fullLocation);
      return fullLocation;
    } catch (error) {
      console.error('Error fetching location:', error);
      setErrorMsg('Could not fetch location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { location, errorMsg, loading, getLocation };
};

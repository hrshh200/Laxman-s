// components/LocationChecker.tsx
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LocationChecker({ children }: { children: React.ReactNode }) {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [isKolkata, setIsKolkata] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationAllowed(false);
          return;
        }

        setLocationAllowed(true);

        const loc = await Location.getCurrentPositionAsync({});
        const [place] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const city = place?.city?.toLowerCase();
        setIsKolkata(city?.includes('kolkata') ?? false);
      } catch (err) {
        console.error('Location error:', err);
        setIsKolkata(false);
      }
    };

    checkLocation();
  }, []);

  if (isKolkata === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text>Checking your city...</Text>
      </View>
    );
  }

  if (!isKolkata) {
    return (
      <View style={styles.center}>
        <Text style={styles.notInCity}>🚫 Service not available in your city</Text>
        <Text>{isKolkata}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notInCity: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigationContainerRef } from '@react-navigation/native';

const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE';

function AppLayout() {
  const { loading } = useAuth(); // Access loading
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useNavigationContainerRef();

  // Restore saved navigation state on mount
  useEffect(() => {
    const restoreNavState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
        if (savedState) {
          setInitialState(JSON.parse(savedState));
        }
      } catch (e) {
        console.warn('Failed to load navigation state:', e);
      } finally {
        setIsReady(true);
      }
    };
    restoreNavState();
  }, []);

  // Save navigation state on change
  const handleNavStateChange = (state: any) => {
    AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
  };

  if (!isReady || loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
        initialState={initialState}
        onStateChange={handleNavStateChange}
        ref={navigationRef}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

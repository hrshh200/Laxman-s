// hooks/useFrameworkReady.ts
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export function useFrameworkReady() {
  useEffect(() => {
    async function prepare() {
      try {
        // ✅ Load fonts used by GlobalText
        await Font.loadAsync({
          'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
}

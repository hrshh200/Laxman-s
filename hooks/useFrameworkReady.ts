import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export function useFrameworkReady() {
  useEffect(() => {
    async function prepare() {
      try {
        // ✅ Load custom fonts if you have any
        await Font.loadAsync({
          // Example font
          'Inter-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
        });

        // 🟢 Any other async init logic here
        // await somethingElse();
      } catch (e) {
        console.warn('Error loading assets', e);
      } finally {
        // ✅ Hide splash screen when ready
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
}

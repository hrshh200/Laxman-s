import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Platform, StatusBar, Dimensions } from 'react-native';

export default function TabLayout() {
  useFrameworkReady();

  const screenHeight = Dimensions.get('window').height;
  const isAndroid = Platform.OS === 'android';

  const dynamicBottom = isAndroid
    ? Math.max(10, screenHeight * 0.02) // 2% of screen height (min 10)
    : 10; // iOS fixed spacing

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: dynamicBottom,
          left: 20,
          right: 20,
          backgroundColor: '#fff',
          borderRadius: 16,
          height: 60,
          paddingBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home-filled" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

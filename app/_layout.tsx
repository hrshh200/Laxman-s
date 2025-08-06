import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AdminOrderBanner from './AdminOrderBanner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function AppLayout() {
   const { loading, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  useFrameworkReady();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data();
          setIsAdmin(userData?.role === 'admin');
        } catch (error) {
          console.error('Error checking admin role:', error);
        }
      }
      setCheckingRole(false);
    };

    checkAdminRole();
  }, [user?.uid]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isAdmin && <AdminOrderBanner />}
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
        animation: Platform.OS === 'ios' ? 'default' : 'fade'
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" backgroundColor="#fff" translucent={false} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: screenHeight,
    width: screenWidth,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: screenHeight,
    width: screenWidth,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
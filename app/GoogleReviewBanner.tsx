import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MapPin } from 'lucide-react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

// This persists in memory until app restarts
let bannerAlreadyShown = false;

export default function NotificationBanner() {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkDeliveredOrders = async () => {
      if (!user?.uid || bannerAlreadyShown) return;

      try {
        const ordersRef = collection(db, 'users', user.uid, 'orders');
        const querySnapshot = await getDocs(ordersRef);

        const hasDeliveredOrder = querySnapshot.docs.some(doc => {
          const data = doc.data();
          return data.deliveryStatus?.toLowerCase() === 'delivered';
        });

        if (hasDeliveredOrder) {
          bannerAlreadyShown = true; // prevent future renders
          setVisible(true);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    checkDeliveredOrders();
  }, [user?.uid]);

  if (!visible) return null;

  const reviewLink =
    'https://www.google.com/search?q=Laxman%27s+%28The+Refreshment+Shop+%29,Pan+shop+Reviews';

  return (
    <View style={styles.banner}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => Linking.openURL(reviewLink)}>
        <MapPin size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.messageContainer}
        activeOpacity={0.8}
        onPress={() => Linking.openURL(reviewLink)}
      >
        <Text style={styles.title}>Share Your Experience</Text>
        <Text style={styles.message}>
          Your last order was successfully delivered. Please give the review.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    padding: 12,
    backgroundColor: '#00C853',
    borderRadius: 12,
    zIndex: 9999,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  iconContainer: {
    padding: 6,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  messageContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  closeButton: {
    marginLeft: 12,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
});

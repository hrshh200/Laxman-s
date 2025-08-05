import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { onSnapshot, collection, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Audio } from 'expo-av';
import { useAuth } from '@/context/AuthContext';
import { LockedWindowDimensions } from '@/utils/dimensions';

const { width } = LockedWindowDimensions;

export default function AdminOrderBanner() {
  const { user } = useAuth();
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchAndSubscribe = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();

      if (userData?.role === 'admin') {
        setIsAdmin(true);
        const pendingRef = collection(db, 'pendingorders');

        const unsubscribe = onSnapshot(pendingRef, async (snapshot) => {
          const updatedOrders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setNewOrders(updatedOrders);

          if (updatedOrders.length > 0 && !soundRef.current) {
            const { sound } = await Audio.Sound.createAsync(
              require('@/assets/sounds/notification.mp3')
            );
            soundRef.current = sound;
            await sound.playAsync();
            await sound.setIsLoopingAsync(true);
          } else if (updatedOrders.length === 0 && soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        });

        return () => {
          unsubscribe();
          if (soundRef.current) {
            soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        };
      }
    };

    fetchAndSubscribe();
  }, [user?.uid]);

  const handleAccept = async (orderId: string) => {
    const order = newOrders.find(o => o.id === orderId);
    if (!order || !order.userId || !order.orderId) return;

    await updateDoc(doc(db, 'users', order.userId, 'orders', order.orderId), {
      deliveryStatus: 'Order Placed',
      orderAccepted: true
    });
    await deleteDoc(doc(db, 'pendingorders', orderId));
  };

  const handleDecline = async (orderId: string) => {
    const order = newOrders.find(o => o.id === orderId);
    if (!order || !order.userId || !order.orderId) return;

    await updateDoc(doc(db, 'users', order.userId, 'orders', order.orderId), {
      deliveryStatus: 'Cancelled',
      orderAccepted: false
    });
    await deleteDoc(doc(db, 'pendingorders', orderId));
  };

  if (!isAdmin || newOrders.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scrollArea}>
        {newOrders.map((order, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>New Order #{order.id.slice(-6).toUpperCase()}</Text>
            <Text style={[styles.subText, { fontWeight: 'bold' }]}>
              Customer: {order.orderName || 'Unknown'}
            </Text>
            <Text style={styles.subText}>Method: {order.deliveryMethod}</Text>
            <Text style={styles.subText}>Mobile: {order.orderMobileNumber}</Text>
            <Text style={styles.subText}>Total: ₹{order.grandTotal}</Text>

            <View style={styles.itemList}>
              {order.cartItems?.map((item: any, i: number) => (
                <Text key={i} style={[styles.item, { fontWeight: 'bold', color: '#000' }]}>
                  {item.name} × {item.quantity}
                </Text>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleAccept(order.id)} style={styles.acceptBtn}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDecline(order.id)} style={styles.declineBtn}>
                <Text style={styles.btnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0, // You can increase if you have a header (like 50 or 80)
    left: 0,
    right: 0,
    zIndex: 999,
    maxHeight: 400,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  scrollArea: {
    maxHeight: 400,
    paddingVertical: 8,
  },

  card: {
    width: width - 40,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subText: {
    fontSize: 13,
    color: '#444',
  },
  itemList: {
    marginVertical: 8,
  },
  item: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

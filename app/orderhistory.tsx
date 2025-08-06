import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';
import { collection, getDocs, Timestamp, doc, setDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Linking } from 'react-native';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, Truck, ChefHat, Package, MapPin, Calendar, CreditCard } from 'lucide-react-native';
import { XCircle as CrossCircle } from 'lucide-react-native'; // ✅ Correct name


interface CartItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  isVeg?: boolean;
}

interface Order {
  id: string;
  cartItems: CartItem[];
  deliveryMethod: string;
  deliveryStatus: string;
  createdAt: Timestamp;
  grandTotal: number;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  paymentStatus?: string;
}
const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20;
const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;

      try {
        const orderRef = collection(db, 'users', user.uid, 'orders');
        const orderSnap = await getDocs(orderRef);
        const orderList = orderSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Order, 'id'>),
        }));

        // Sort orders by date (newest first)
        orderList.sort((a, b) => b.createdAt?.toDate().getTime() - a.createdAt?.toDate().getTime());
        setOrders(orderList);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'Waiting for your order to accept':
      case 'waitingtoaccept':
        return {
          icon: Package,
          color: '#e74c3c',
          bgColor: '#E3F2FD',
          text: 'Waiting for confirmation',
          description: ' Confirmation Status Pending'
        };
      case 'order placed':
      case 'orderplaced':
        return {
          icon: Package,
          color: '#2196F3',
          bgColor: '#E3F2FD',
          text: 'Order Placed',
          description: 'Your order has been confirmed'
        };
      case 'processing':
      case 'processing your order':
        return {
          icon: ChefHat,
          color: '#FF9800',
          bgColor: '#FFF3E0',
          text: 'Processing Your Order',
          description: 'Restaurant is preparing your food'
        };
      case 'ready':
      case 'your order is ready':
        return {
          icon: CheckCircle,
          color: '#4CAF50',
          bgColor: '#E8F5E8',
          text: 'Your Order is Ready',
          description: 'Food is ready for pickup/delivery'
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: '#4CAF50',
          bgColor: '#E8F5E8',
          text: 'Delivered',
          description: 'Order delivered successfully'
        };
      case 'cancelled':
        return {
          icon: CrossCircle,
          color: '#e74c3c',
          bgColor: '#E8F5E8',
          text: 'Cancelled',
          description: 'Your order has been cancelled by the store'
        };

      default:
        return {
          icon: Clock,
          color: '#757575',
          bgColor: '#F5F5F5',
          text: status,
          description: 'Order status update'
        };
    }
  };

  const addItemstoCart = async (order: Order) => {
    if (!user?.uid) return;

    try {
      const cartRef = collection(db, 'users', user.uid, 'cart');

      for (const item of order.cartItems) {
        // Check if item already exists (based on name)
        const existingQuery = query(cartRef, where('name', '==', item.name));
        const existingSnap = await getDocs(existingQuery);

        if (!existingSnap.empty) {
          // Item already exists, update its quantity and total
          const existingDoc = existingSnap.docs[0];
          const existingData = existingDoc.data();
          const updatedQuantity = existingData.quantity + item.quantity;
          const updatedTotal = (item.price ?? 0) * updatedQuantity;

          await setDoc(existingDoc.ref, {
            ...existingData,
            quantity: updatedQuantity,
            total: updatedTotal,
            updatedAt: new Date()
          });
        } else {
          // Item doesn't exist, create a new one
          const itemRef = doc(cartRef); // Auto ID
          const unitPrice = item.price ?? 0;
          await setDoc(itemRef, {
            name: item.name,
            quantity: item.quantity,
            price: unitPrice,
            image: item.image || '',
            isVeg: item.isVeg || false,
            createdAt: new Date(),
            total: unitPrice * item.quantity
          });
        }
      }

      router.push('/cart');
      console.log('Reordered items added to cart.');
    } catch (error) {
      console.error('Error adding items to cart:', error);
    }
  };


  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp?.toDate();
    if (!date) return 'Unknown date';

    const now = new Date();

    // Remove time part for both dates
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = currentDate.getTime() - inputDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };


  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp?.toDate();
    if (!date) return '';

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.emptyContainer}>
          <Package size={64} color="#e74c3c" />
          <Text style={styles.emptyTitle}>Please Sign In</Text>
          <Text style={styles.emptySubtitle}>Sign in to view your order history</Text>
          <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyContainer}>
          <Package size={64} color="#e74c3c" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>Start ordering your favorite food!</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusInfo = getStatusInfo(item.deliveryStatus);
    const StatusIcon = statusInfo.icon;

    return (

      <View style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.orderTotal}>₹{item.grandTotal}</Text>
        </View>

        {/* Status */}
        <TouchableOpacity onPress={() => router.push(`/orderdetails?orderId=${item.id}`)}>
          <View style={[styles.statusContainer, { backgroundColor: statusInfo.bgColor }]}>
            <StatusIcon size={20} color={statusInfo.color} />
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
              <Text style={styles.statusDescription}>{statusInfo.description}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatDate(item.createdAt)} at {formatTime(item.createdAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Truck size={16} color="#666" />
            <Text style={styles.detailText}>{item.deliveryMethod || 'Home Delivery'}</Text>
          </View>

          <View style={styles.detailRow}>
            <CreditCard size={16} color="#666" />
            <Text style={styles.detailText}>Payment: </Text>
            <Text style={[
              styles.paymentStatus,
              item.paymentStatus?.toLowerCase() === 'paid'
                ? styles.paymentPaid
                : styles.paymentPending
            ]}>
              {item.paymentStatus || 'Pending'}
            </Text>
          </View>
          {item.deliveryAddress && (
            <View style={styles.detailRow}>
              <MapPin size={16} color="#666" />
              <Text style={styles.detailText}>{item.deliveryAddress}</Text>
            </View>
          )}
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Items ({item.cartItems?.length || 0})</Text>
          {item.cartItems?.slice(0, 3).map((cartItem, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                {cartItem.isVeg && <View style={styles.vegIndicator} />}
                <Text style={styles.itemName}>{cartItem.name}</Text>
              </View>
              <Text style={styles.itemQuantity}>×{cartItem.quantity}</Text>
              <Text style={styles.itemPrice}>₹{cartItem.price * cartItem.quantity}</Text>
            </View>
          ))}

          {item.cartItems?.length > 3 && (
            <Text style={styles.moreItems}>
              +{item.cartItems.length - 3} more items
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.reorderButton} onPress={() => addItemstoCart(item)}>
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/')}>
            <Text style={styles.helpButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {item.deliveryStatus.toLowerCase() === 'delivered' && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => {
              // Replace with your actual Google Maps or Business review link
              const googleReviewLink = 'https://www.google.com/search?client=ms-android-motorola-rvo3&sca_esv=e948bafec9f39f8c&hl=en-IN&cs=1&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E83EsvHTi5S9xnptOAwCO9Vqpt8xutW21f8meb9NRdRqBcsgP6AB5IRUYZ_fr9ZAJNYP5hize-wG57rn3NyJGvSCQnY5XnjzAKFhkDMh_1W_8d214Q3y5GQBLHd5zpGUuysqiB8%3D&q=Laxman%27s+%28The+Refreshment+Shop+%29,Pan+shop+Reviews&sa=X&ved=2ahUKEwiuxYir8uGOAxWVRWwGHUQLG20Q0bkNegQIJxAD&biw=1324&bih=760&dpr=2';
              Linking.openURL(googleReviewLink);
            }}
          >
            <Text style={styles.rateButtonText}>Please Rate Us on Google</Text>
          </TouchableOpacity>
        )}

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Orders Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //paddingTop: topPadding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  rateButton: {
    backgroundColor: '#0F9D58', // Google green
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  placeholder: {
    width: 34,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    color: '#666',
  },
  orderDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 0,
  },
  paymentPaid: {
    color: '#4CAF50',
  },
  paymentPending: {
    color: '#e74c3c',
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vegIndicator: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    minWidth: 30,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 60,
    textAlign: 'right',
  },
  moreItems: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  reorderButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  helpButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  helpButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderHistory;
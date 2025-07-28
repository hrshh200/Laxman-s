import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Truck, 
  ChefHat, 
  Package, 
  MapPin, 
  Phone, 
  User,
  Calendar,
  CreditCard,
  Star,
  Navigation
} from 'lucide-react-native';

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
  paymentStatus: string;
  createdAt: any;
  grandTotal: number;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  orderManName?: string;
  orderManPhone?: string;
  pickupTime?: string;
  deliveryTime?: string;
}

const OrderDetails = () => {
  const { orderId } = useLocalSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user?.uid || !orderId) return;

      try {
        const orderRef = doc(db, 'users', user.uid, 'orders', orderId as string);
        const orderSnap = await getDoc(orderRef);
        
        if (orderSnap.exists()) {
          setOrder({
            id: orderSnap.id,
            ...orderSnap.data()
          } as Order);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, orderId]);

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed':
      case 'orderplaced':
        return {
          icon: Package,
          color: '#2196F3',
          bgColor: '#E3F2FD',
          title: 'Order Placed',
          subtitle: 'Your order has been confirmed'
        };
      case 'processing':
      case 'processing your order':
        return {
          icon: ChefHat,
          color: '#FF9800',
          bgColor: '#FFF3E0',
          title: 'Processing Your Order',
          subtitle: 'Our chef is preparing your delicious food'
        };
      case 'ready':
      case 'your order is ready':
        return {
          icon: CheckCircle,
          color: '#4CAF50',
          bgColor: '#E8F5E8',
          title: 'Your Order is Ready',
          subtitle: 'Food is ready for pickup/delivery'
        };
      case 'out for delivery':
        return {
          icon: Truck,
          color: '#9C27B0',
          bgColor: '#F3E5F5',
          title: 'Out for Delivery',
          subtitle: 'Your order is on the way to you'
        };
      case 'Delivered':
        return {
          icon: CheckCircle,
          color: '#4CAF50',
          bgColor: '#E8F5E8',
          title: 'Delivered',
          subtitle: 'Order delivered successfully'
        };
      default:
        return {
          icon: Clock,
          color: '#757575',
          bgColor: '#F5F5F5',
          title: status,
          subtitle: 'Order status update'
        };
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    if (!date) return 'Unknown date';
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    if (!date) return '';
    
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderOrderPlacedContent = () => (
    <View style={styles.contentContainer}>
      {/* Order Man Info */}
      <View style={styles.orderManCard}>
        <View style={styles.orderManHeader}>
          <View style={styles.orderManAvatar}>
            <User size={32} color="#e74c3c" />
          </View>
          <View style={styles.orderManInfo}>
            <Text style={styles.orderManName}>
              {`Contact Laxman's`}
            </Text>
            <Text style={styles.orderManRole}>Your Delivery Partner</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Phone size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.pickupTimeContainer}>
          <Clock size={16} color="#FF9800" />
          <Text style={styles.pickupTimeText}>
            Pickup Time: {order?.pickupTime || '15-20 minutes'}
          </Text>
        </View>
      </View>

      {/* Estimated Delivery */}
      <View style={styles.estimatedDeliveryCard}>
        <Truck size={24} color="#e74c3c" />
        <View style={styles.estimatedDeliveryInfo}>
          <Text style={styles.estimatedDeliveryTitle}>Estimated Delivery</Text>
          <Text style={styles.estimatedDeliveryTime}>
            {order?.estimatedDelivery || '30-45 minutes'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProcessingContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.processingCard}>
        <View style={styles.processingAnimation}>
          <ChefHat size={48} color="#FF9800" />
        </View>
        <Text style={styles.processingTitle}>Kitchen is Busy!</Text>
        <Text style={styles.processingSubtitle}>
          Our skilled chefs are carefully preparing your order with fresh ingredients
        </Text>
        
        <View style={styles.processingSteps}>
          <View style={styles.processingStep}>
            <View style={[styles.stepIndicator, styles.stepCompleted]}>
              <CheckCircle size={16} color="#fff" />
            </View>
            <Text style={styles.stepText}>Order Received</Text>
          </View>
          
          <View style={styles.processingStep}>
            <View style={[styles.stepIndicator, styles.stepActive]}>
              <ChefHat size={16} color="#fff" />
            </View>
            <Text style={styles.stepText}>Preparing Food</Text>
          </View>
          
          <View style={styles.processingStep}>
            <View style={styles.stepIndicator}>
              <Package size={16} color="#ccc" />
            </View>
            <Text style={[styles.stepText, styles.stepInactive]}>Ready for Pickup</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderReadyContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.readyCard}>
        <View style={styles.readyIcon}>
          <CheckCircle size={64} color="#4CAF50" />
        </View>
        <Text style={styles.readyTitle}>Your Order is Ready!</Text>
        <Text style={styles.readySubtitle}>
          Your delicious food is packed and ready for delivery
        </Text>
        
        <View style={styles.readyActions}>
          <TouchableOpacity style={styles.trackButton}>
            <Navigation size={20} color="#fff" />
            <Text style={styles.trackButtonText}>Track Delivery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDeliveredContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.deliveredCard}>
        <View style={styles.deliveredIcon}>
          <CheckCircle size={64} color="#4CAF50" />
        </View>
        <Text style={styles.deliveredTitle}>Order Delivered!</Text>
        <Text style={styles.deliveredSubtitle}>
          Hope you enjoyed your meal. Thank you for choosing us!
        </Text>
        
        <View style={styles.deliveredInfo}>
          <View style={styles.deliveredRow}>
            <Calendar size={16} color="#666" />
            <Text style={styles.deliveredText}>
              Delivered on {formatDate(order?.createdAt)}
            </Text>
          </View>
          
          <View style={styles.deliveredRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.deliveredText}>
              At {order?.deliveryTime || formatTime(order?.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} style={styles.starButton}>
                <Star size={32} color="#FFD700" fill="#FFD700" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.reorderButton} onPress={()=>router.push('/')}>
          <Text style={styles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatusContent = () => {
    const status = order?.deliveryStatus?.toLowerCase() || '';
    
    if (status.includes('placed')) {
      return renderOrderPlacedContent();
    } else if (status.includes('processing')) {
      return renderProcessingContent();
    } else if (status.includes('ready')) {
      return renderReadyContent();
    } else if (status.includes('delivered')) {
      return renderDeliveredContent();
    } else {
      return renderProcessingContent(); // Default fallback
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <Package size={64} color="#e74c3c" />
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Text style={styles.errorSubtitle}>Unable to load order details</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(order.deliveryStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Info Card */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{order.id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.orderTotal}>₹{order.grandTotal}</Text>
          </View>
          
          <View style={styles.orderMeta}>
            <Text style={styles.orderDate}>
              {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
            </Text>
            <View style={styles.paymentStatus}>
              <CreditCard size={14} color="#666" />
              <Text style={[
                styles.paymentText,
                { color: order.paymentStatus?.toLowerCase() === 'paid' ? '#4CAF50' : '#e74c3c' }
              ]}>
                {order.paymentStatus || 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusInfo.bgColor }]}>
          <StatusIcon size={32} color={statusInfo.color} />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
              {statusInfo.title}
            </Text>
            <Text style={styles.statusSubtitle}>{statusInfo.subtitle}</Text>
          </View>
        </View>

        {/* Dynamic Content Based on Status */}
        {renderStatusContent()}

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Order Items ({order.cartItems?.length || 0})</Text>
          {order.cartItems?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image 
                source={{ 
                  uri: item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' 
                }} 
                style={styles.itemImage} 
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  {item.isVeg && <View style={styles.vegIndicator} />}
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
              </View>
              <View style={styles.itemQuantity}>
                <Text style={styles.quantityText}>×{item.quantity}</Text>
                <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <MapPin size={20} color="#e74c3c" />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.addressText}>{order.deliveryAddress}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  headerBackButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderInfoCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contentContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  orderManCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderManHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderManAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff3f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderManInfo: {
    flex: 1,
  },
  orderManName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderManRole: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
  },
  pickupTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  estimatedDeliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estimatedDeliveryInfo: {
    marginLeft: 16,
    flex: 1,
  },
  estimatedDeliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  estimatedDeliveryTime: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  processingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processingAnimation: {
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  processingSteps: {
    width: '100%',
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepActive: {
    backgroundColor: '#FF9800',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  stepInactive: {
    color: '#ccc',
  },
  readyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readyIcon: {
    marginBottom: 20,
  },
  readyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  readySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  readyActions: {
    width: '100%',
  },
  trackButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deliveredCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveredIcon: {
    marginBottom: 20,
  },
  deliveredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  deliveredSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  deliveredInfo: {
    width: '100%',
    marginBottom: 30,
  },
  deliveredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  deliveredText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  reorderButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vegIndicator: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    alignItems: 'flex-end',
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  addressCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default OrderDetails;
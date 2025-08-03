import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ScrollView, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Clock, MapPin, CreditCard, Wallet, Smartphone } from 'lucide-react-native';

// Define the type for cart items
type CartItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    instructions?: string;
    image?: string;
    isVeg?: boolean;
};

export default function Cart() {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const taxes = Math.round(subtotal * 0.05); // 5% tax
    const grandTotal = subtotal;

    useEffect(() => {
        if (user?.uid) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const cartRef = collection(db, 'users', user.uid, 'cart');
            const querySnapshot = await getDocs(cartRef);
            const items: CartItem[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as CartItem[];

            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }

        try {
            const itemRef = doc(db, 'users', user.uid, 'cart', itemId);
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                const newTotal = newQuantity * item.price;
                await updateDoc(itemRef, {
                    quantity: newQuantity,
                    total: newTotal
                });

                setCartItems(prev => prev.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity, total: newTotal }
                        : item
                ));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'cart', itemId));
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            if (!user?.uid) {
                console.error('User not authenticated');
                return;
            }

            if (!deliveryMethod) {
                Alert.alert('Missing Information', 'Please select a delivery method (Pickup or DineOut)');
                return;
            }

            setLoading(true);

            // Create base order object
            const orderData = {
                cartItems,
                deliveryMethod,
                deliveryStatus: 'Waiting for your order to accept',
                createdAt: Timestamp.now(),
                grandTotal,
                paymentStatus: 'Pending',
                orderName: user?.name,
                arrivalTime: selectedTime,
                orderMobileNumber: user?.mobile,
                orderAccepted: false
            };

            // 1️⃣ Add to user's personal orders
            const orderRef = collection(db, 'users', user.uid, 'orders');
            const orderDocRef = await addDoc(orderRef, orderData);
            const orderId = orderDocRef.id;

            // 2️⃣ Add to pending orders with reference to user + orderId
            const pendingorderData = {
                ...orderData,
                userId: user.uid,
                orderId: orderId
            };
            const pendingorderRef = collection(db, 'pendingorders');
            await addDoc(pendingorderRef, pendingorderData);

            // 3️⃣ Optional: Clear cart
            await deleteCartItems(user.uid);

            // 4️⃣ Redirect
            setTimeout(() => {
                setLoading(false);
                router.push('/orderplaced');
            }, 2000);

        } catch (error) {
            setLoading(false);
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        }
    };


    const deleteCartItems = async (uid: string) => {
        try {
            const cartRef = collection(db, 'users', uid, 'cart');
            const cartSnapshot = await getDocs(cartRef);

            const deletePromises = cartSnapshot.docs.map((docSnap) =>
                deleteDoc(doc(db, 'users', uid, 'cart', docSnap.id))
            );

            await Promise.all(deletePromises);
            console.log('Cart items deleted successfully');
        } catch (error) {
            console.error('Error deleting cart items:', error);
        }
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <Image
                source={{
                    uri: item.image
                }}
                style={styles.itemImage}
            />

            <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                    {item.isVeg && <View style={styles.vegIndicator} />}
                    <Text style={styles.itemName}>{item.name}</Text>
                </View>

                <Text style={styles.itemPrice}>₹{item.price}</Text>

                {item.instructions && (
                    <Text style={styles.instructions}>Note: {item.instructions}</Text>
                )}

                <View style={styles.itemFooter}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            style={styles.quantityButton}
                        >
                            <Minus size={16} color="#e74c3c" />
                        </TouchableOpacity>

                        <Text style={styles.quantity}>{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            style={styles.quantityButton}
                        >
                            <Plus size={16} color="#e74c3c" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.itemTotal}>₹{item.total}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
            >
                <Trash2 size={20} color="#ff6b6b" />
            </TouchableOpacity>
        </View>
    );

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>Please Sign In</Text>
                    <Text style={styles.emptySubtitle}>Sign in to view your cart items</Text>
                    <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <View style={styles.placeholder} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00C853" />
                </View>
            ) : cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add some delicious items to get started</Text>
                    <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/')}>
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.deliveryContainer}>
                        {/* Delivery Info */}
                        <View style={styles.deliveryInfo}>
                            <View style={styles.radioGroup}>
                                <Text style={styles.sectionTitle}>Select Service</Text>
                                <View style={styles.radioOptions}>
                                    <TouchableOpacity
                                        style={styles.radioOption}
                                        onPress={() => {
                                            setDeliveryMethod('pickup');
                                            setSelectedTime(''); // reset selected time
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.radioCircle,
                                                deliveryMethod === 'pickup' && styles.radioSelected,
                                            ]}
                                        />
                                        <Text style={styles.radioLabel}>Pickup</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.radioOption}
                                        onPress={() => {
                                            setDeliveryMethod('dineout');
                                            setSelectedTime('');
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.radioCircle,
                                                deliveryMethod === 'dineout' && styles.radioSelected,
                                            ]}
                                        />
                                        <Text style={styles.radioLabel}>DineOut</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Show timing options only when a method is selected */}
                            {deliveryMethod && (
                                <View style={styles.timeOptionsContainer}>
                                    <Text style={styles.sectionTitle}>
                                        When will you arrive for {deliveryMethod === 'pickup' ? 'Pickup' : 'DineOut'}?
                                    </Text>
                                    <View style={styles.radioOptions}>
                                        {['10 mins', '20 mins', '30 mins'].map((time) => (
                                            <TouchableOpacity
                                                key={time}
                                                style={styles.radioOption}
                                                onPress={() => setSelectedTime(time)}
                                            >
                                                <View
                                                    style={[
                                                        styles.radioCircle,
                                                        selectedTime === time && styles.radioSelected,
                                                    ]}
                                                />
                                                <Text style={styles.radioLabel}>{time}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* <View style={styles.deliveryRow}>
                            <Clock size={16} color="#FF9800" />
                            <Text style={styles.deliveryText}>25-35 mins</Text>
                        </View> */}
                    </View>


                    {/* Cart Items */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Items ({cartItems.length})</Text>
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item) => item.id}
                            renderItem={renderCartItem}
                            scrollEnabled={false}
                        />
                    </View>

                    {/* Bill Details */}
                    <View style={styles.billContainer}>
                        <Text style={styles.billTitle}>Bill Details</Text>

                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{subtotal}</Text>
                        </View>

                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={[styles.billValue, deliveryFee === 0 && styles.freeText]}>
                                {deliveryFee === 0 ? 'FREE' : `₹0`}
                            </Text>
                        </View>

                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Taxes & Charges</Text>
                            <Text style={styles.billValue}>₹0</Text>
                        </View>

                        {deliveryFee === 0 && (
                            <Text style={styles.freeDeliveryNote}>
                                🎉 You saved ₹40 on delivery fee!
                            </Text>
                        )}

                        <View style={styles.billDivider} />

                        <View style={styles.billRow}>
                            <Text style={styles.billTotalLabel}>Grand Total</Text>
                            <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
                        </View>
                    </View>

                    {/* Payment Options */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Options</Text>
                        {/* <View style={styles.paymentOptions}>
                            <TouchableOpacity style={styles.paymentOption}>
                                <CreditCard size={20} color="#e74c3c" />
                                <Text style={styles.paymentText}>Credit/Debit Card</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.paymentOption}>
                                <Wallet size={20} color="#e74c3c" />
                                <Text style={styles.paymentText}>Digital Wallet</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.paymentOption}>
                                <Smartphone size={20} color="#e74c3c" />
                                <Text style={styles.paymentText}>UPI Payment</Text>
                            </TouchableOpacity>
                        </View> */}
                        <Text style={styles.paymentText}>Only Cash</Text>
                    </View>
                </ScrollView>
            )}

            {/* Bottom Checkout Button */}
            {cartItems.length > 0 && (
                <View style={styles.checkoutContainer}>
                    <View style={styles.checkoutInfo}>
                        <Text style={styles.checkoutTotal}>₹{grandTotal}</Text>
                        <Text style={styles.checkoutSubtext}>Total • {cartItems.length} items</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                        <Text style={styles.checkoutButtonText}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853',
        marginTop: 12,
    },
    backButton: {
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
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
    deliveryInfo: {
        backgroundColor: '#f8f9fa',
        margin: 20,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    vegIndicator: {
        width: 12,
        height: 12,
        borderRadius: 2,
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
        marginBottom: 4,
    },
    instructions: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 12,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    removeButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    billContainer: {
        backgroundColor: '#f8f9fa',
        margin: 20,
        borderRadius: 12,
        padding: 20,
    },
    billTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    billLabel: {
        fontSize: 16,
        color: '#666',
    },
    billValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    freeText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    freeDeliveryNote: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
        marginBottom: 8,
    },
    billDivider: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    billTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    billTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    paymentOptions: {
        gap: 12,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    paymentText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    checkoutContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    checkoutInfo: {
        flex: 1,
    },
    checkoutTotal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutSubtext: {
        fontSize: 14,
        color: '#666',
    },
    checkoutButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginLeft: 16,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    radioGroup: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    radioOptions: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#e74c3c',
        marginRight: 8,
    },
    radioSelected: {
        backgroundColor: '#e74c3c',
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    timeOptionsContainer: {
        marginTop: 16,
    },
    deliveryContainer: {
        flexDirection: 'column',
        marginTop: 8
    }
});
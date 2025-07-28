import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    Image,
    Animated
} from 'react-native';
import { router } from 'expo-router';
import {
    ArrowLeft, Settings, Package, ShoppingCart, DollarSign,
    TrendingUp, CreditCard as Edit3, Save, X, Plus,
    Trash2, Clock, CircleCheck as CheckCircle, ChefHat, Truck
} from 'lucide-react-native';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';



// Types
interface MenuItem {
    id: string;
    name: string;
    description: string;
    fulldescription: string;
    price: number;
    image: string;
    isVeg: boolean;
    category: string;
}

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
    createdAt: Timestamp;
    grandTotal: number;
    deliveryAddress?: string;
    userId: string;
    orderName?: string;
    arrivalTime?: string;
    orderMobileNumber?: string
}

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('paan');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [orderFilter, setOrderFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [newOrder, setNewOrder] = useState<Order | null>(null);
    // const [bannerVisible, setBannerVisible] = useState(false);
    // const bannerAnim = useRef(new Animated.Value(-100)).current;
    // const slideAnim = useRef(new Animated.Value(-100)).current; 

    const categories = ['paan', 'chaat', 'beverages'];
    const orderStatuses = [
        { value: 'Order Placed', label: 'Order Placed', color: '#2196F3' },
        { value: 'Processing Your Order', label: 'Processing', color: '#FF9800' },
        { value: 'Your Order is Ready', label: 'Ready', color: '#4CAF50' },
        { value: 'Delivered', label: 'Delivered', color: '#4CAF50' }
    ];

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fulldescription: '',
        price: '',
        image: '',
        isVeg: true,
        category: 'paan'
    });

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const menuRef = collection(db, selectedCategory);
            const menuSnap = await getDocs(menuRef);
            const items = menuSnap.docs.map(doc => ({
                id: doc.id,
                category: selectedCategory,
                ...doc.data()
            })) as MenuItem[];
            setMenuItems(items);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            Alert.alert('Error', 'Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribeAll: (() => void)[] = [];

        const fetchRealtimeOrders = async () => {
            try {
                const usersRef = collection(db, 'users');
                const usersSnap = await getDocs(usersRef);

                usersSnap.docs.forEach(userDoc => {
                    const ordersRef = collection(db, 'users', userDoc.id, 'orders');
                    const unsubscribe = onSnapshot(ordersRef, snapshot => {
                        const updatedOrders: Order[] = [];

                        snapshot.forEach(orderDoc => {
                            updatedOrders.push({
                                id: orderDoc.id,
                                userId: userDoc.id,
                                orderName: userDoc.data().name || 'Unknown',
                                ...orderDoc.data(),
                            } as Order);
                        });

                        setOrders(prevOrders => {
                            const prevIds = prevOrders.map(o => o.id);
                            const newOnes = updatedOrders.filter(o => !prevIds.includes(o.id));
                            const filteredPrev = prevOrders.filter(o => o.userId !== userDoc.id);
                            const merged = [...filteredPrev, ...updatedOrders];
                            return merged.sort((a, b) => b.createdAt?.toDate().getTime() - a.createdAt?.toDate().getTime());
                        });
                    });

                    unsubscribeAll.push(unsubscribe);
                });

            } catch (error) {
                console.error('Error in real-time fetching:', error);
                Alert.alert('Error', 'Failed to fetch orders in real time');
            }
        };

        fetchRealtimeOrders();
        return () => {
            unsubscribeAll.forEach(unsub => unsub());
        };
    }, []);

    useEffect(() => {
        fetchMenuItems();
    }, [selectedCategory]);

    const updateMenuItem = async () => {
        if (!selectedItem) return;

        try {
            const itemRef = doc(db, selectedCategory, selectedItem.id);
            await updateDoc(itemRef, {
                name: formData.name,
                description: formData.description,
                fulldescription: formData.fulldescription,
                price: parseFloat(formData.price),
                image: formData.image,
                isVeg: formData.isVeg,
                category: formData.category
            });

            Alert.alert('Success', 'Menu item updated successfully');
            setEditModalVisible(false);
            fetchMenuItems();
        } catch (error) {
            console.error('Error updating menu item:', error);
            Alert.alert('Error', 'Failed to update menu item');
        }
    };

    const addMenuItem = async () => {
        try {
            await addDoc(collection(db, formData.category), {
                name: formData.name,
                description: formData.description,
                fulldescription: formData.fulldescription,
                price: parseFloat(formData.price),
                image: formData.image,
                isVeg: formData.isVeg,
                category: formData.category
            });

            Alert.alert('Success', 'Menu item added successfully');
            setAddModalVisible(false);
            resetForm();
            fetchMenuItems();
        } catch (error) {
            console.error('Error adding menu item:', error);
            Alert.alert('Error', 'Failed to add menu item');
        }
    };

    const deleteMenuItem = async (itemId: string) => {
        if (!selectedCategory || typeof selectedCategory !== 'string') {
            Alert.alert("Error", "Invalid category selected.");
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this menu item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, selectedCategory, itemId));
                            Alert.alert('Success', 'Menu item deleted successfully');
                            fetchMenuItems();
                        } catch (error) {
                            console.error('Error deleting menu item:', error);
                            Alert.alert('Error', 'Failed to delete menu item');
                        }
                    }
                }
            ]
        );
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const orderRef = doc(db, 'users', order.userId, 'orders', orderId);
            await updateDoc(orderRef, { deliveryStatus: status });
            Alert.alert('Success', 'Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            Alert.alert('Error', 'Failed to update order status');
        }
    };

    const updatePaymentStatus = async (orderId: string, status: string) => {
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const orderRef = doc(db, 'users', order.userId, 'orders', orderId);
            await updateDoc(orderRef, { paymentStatus: status });
            Alert.alert('Success', 'Payment status updated successfully');
        } catch (error) {
            console.error('Error updating payment status:', error);
            Alert.alert('Error', 'Failed to update payment status');
        }
    };

    const openEditModal = (item: MenuItem) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            fulldescription: item.fulldescription,
            price: item.price.toString(),
            image: item.image,
            isVeg: item.isVeg,
            category: item.category
        });
        setEditModalVisible(true);
    };

    const openAddModal = () => {
        resetForm();
        setAddModalVisible(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            fulldescription: '',
            price: '',
            image: '',
            isVeg: true,
            category: selectedCategory
        });
    };

    const getFilteredOrders = () => {
        if (orderFilter === 'all') return orders;
        return orders.filter(order => order.deliveryStatus.toLowerCase().includes(orderFilter.toLowerCase()));
    };
    
    const getDashboardStats = () => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
        const pendingOrders = orders.filter(order =>
            !order.deliveryStatus.toLowerCase().includes('delivered')
        ).length;
        const paidOrders = orders.filter(order =>
            order.paymentStatus?.toLowerCase() === 'paid'
        ).length;

        return { totalOrders, totalRevenue, pendingOrders, paidOrders };
    };

    const formatDate = (timestamp: Timestamp) => {
        const date = timestamp?.toDate();
        if (!date) return 'Unknown date';
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderFormModal = (isEdit: boolean) => (
        <Modal visible={isEdit ? editModalVisible : addModalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{isEdit ? 'Edit' : 'Add'} Menu Item</Text>
                        <TouchableOpacity onPress={() => isEdit ? setEditModalVisible(false) : setAddModalVisible(false)}>
                            <X size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <TextInput
                            style={styles.input}
                            placeholder="Item Name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Full Description"
                            value={formData.fulldescription}
                            onChangeText={(text) => setFormData({ ...formData, fulldescription: text })}
                            multiline
                            numberOfLines={3}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            value={formData.price}
                            onChangeText={(text) => setFormData({ ...formData, price: text })}
                            keyboardType="numeric"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Image URL"
                            value={formData.image}
                            onChangeText={(text) => setFormData({ ...formData, image: text })}
                        />

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={[styles.checkbox, formData.isVeg && styles.checkboxChecked]}
                                onPress={() => setFormData({ ...formData, isVeg: !formData.isVeg })}
                            >
                                {formData.isVeg && <CheckCircle size={16} color="#fff" />}
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>Vegetarian</Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={isEdit ? updateMenuItem : addMenuItem}
                    >
                        <Save size={20} color="#fff" />
                        <Text style={styles.saveButtonText}>{isEdit ? 'Save Changes' : 'Add Item'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const renderTabContent = () => {
        const stats = getDashboardStats();

        switch (activeTab) {
            case 'dashboard':
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                            <View style={styles.statsContainer}>
                                {[
                                    { icon: <ShoppingCart size={24} color="#e74c3c" />, value: stats.totalOrders, label: 'Total Orders' },
                                    { icon: <DollarSign size={24} color="#4CAF50" />, value: `₹${stats.totalRevenue}`, label: 'Revenue' },
                                    { icon: <Clock size={24} color="#FF9800" />, value: stats.pendingOrders, label: 'Pending' },
                                    { icon: <CheckCircle size={24} color="#4CAF50" />, value: stats.paidOrders, label: 'Paid Orders' }
                                ].map((stat, index) => (
                                    <View key={index} style={styles.statCard}>
                                        {stat.icon}
                                        <Text style={styles.statValue}>{stat.value}</Text>
                                        <Text style={styles.statLabel}>{stat.label}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Recent Orders</Text>
                                {orders.slice(0, 5).map((order) => (
                                    <View key={order.id} style={styles.orderCard}>
                                        <View style={styles.orderHeader}>
                                            <Text style={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</Text>
                                            <Text style={styles.orderTotal}>₹{order.grandTotal}</Text>
                                        </View>
                                        <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                                        <View style={styles.orderStatus}>
                                            <Text style={[styles.statusText, { color: '#FF9800' }]}>
                                                {order.deliveryStatus}
                                            </Text>
                                            <Text style={[
                                                styles.paymentText,
                                                { color: order.paymentStatus?.toLowerCase() === 'paid' ? '#4CAF50' : '#e74c3c' }
                                            ]}>
                                                {order.paymentStatus || 'Pending'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                );

            case 'menu':
                return (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.categoryContainer}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryButton,
                                        selectedCategory === category && styles.categoryButtonActive
                                    ]}
                                    onPress={() => setSelectedCategory(category)}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        selectedCategory === category && styles.categoryButtonTextActive
                                    ]}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                            <Plus size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Add New Item</Text>
                        </TouchableOpacity>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items
                            </Text>
                            {menuItems
                                .filter(item => item.category === selectedCategory)
                                .map(item => (
                                    <View key={item.id} style={styles.menuItemCard}>
                                        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                                        <View style={styles.menuItemDetails}>
                                            <View style={styles.menuItemHeader}>
                                                {item.isVeg && <View style={styles.vegIndicator} />}
                                                <Text style={styles.menuItemName}>{item.name}</Text>
                                            </View>
                                            <Text style={styles.menuItemDescription}>{item.description}</Text>
                                            <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                                        </View>
                                        <View style={styles.menuItemActions}>
                                            <TouchableOpacity
                                                style={styles.editButton}
                                                onPress={() => openEditModal(item)}
                                            >
                                                <Edit3 size={16} color="#e74c3c" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => deleteMenuItem(item.id)}
                                            >
                                                <Trash2 size={16} color="#ff6b6b" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    </ScrollView>
                );

            case 'orders':
                return (
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.filterContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {['all', 'placed', 'processing', 'ready', 'delivered'].map((filter) => (
                                    <TouchableOpacity
                                        key={filter}
                                        style={[
                                            styles.filterButton,
                                            orderFilter === filter && styles.filterButtonActive
                                        ]}
                                        onPress={() => setOrderFilter(filter)}
                                    >
                                        <Text style={[
                                            styles.filterButtonText,
                                            orderFilter === filter && styles.filterButtonTextActive
                                        ]}>
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Orders ({getFilteredOrders().length})</Text>
                            {getFilteredOrders().map((order) => (
                                <View key={order.id} style={styles.orderManagementCard}>
                                    <View style={styles.orderHeader}>
                                        <Text style={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</Text>
                                        <Text style={styles.orderTotal}>₹{order.grandTotal}</Text>
                                    </View>
                                    {(order.deliveryStatus !== 'Delivered' &&
                                        <Text style={styles.arrivalText}>{order.deliveryMethod.toUpperCase()} - Arriving in {order.arrivalTime}..</Text>
                                    )}
                                    <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                                    <Text style={styles.orderEmail}>{order.orderName || 'Unknown User'}</Text>
                                    <Text style={styles.orderEmail}>{order.orderMobileNumber || 'Unknown User'}</Text>

                                    <View style={styles.orderItems}>
                                        {order.cartItems?.slice(0, 2).map((item, idx) => (
                                            <Text key={idx} style={styles.orderItem}>
                                                {item.name} × {item.quantity}
                                            </Text>
                                        ))}
                                        {order.cartItems?.length > 2 && (
                                            <Text style={styles.moreItems}>
                                                +{order.cartItems.length - 2} more items
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.statusUpdateContainer}>
                                        <Text style={styles.statusLabel}>Order Status:</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            {orderStatuses.map((status) => {
                                                const isDelivered = order.deliveryStatus === 'Delivered';
                                                const isDisabled = isDelivered && status.value !== 'Delivered';

                                                return (
                                                    <TouchableOpacity
                                                        key={status.value}
                                                        style={[
                                                            styles.statusButton,
                                                            order.deliveryStatus === status.value && { backgroundColor: status.color },
                                                            isDisabled && { opacity: 0.5 } // dimmed style for disabled
                                                        ]}
                                                        onPress={() => {
                                                            if (!isDisabled) updateOrderStatus(order.id, status.value);
                                                        }}
                                                        disabled={isDisabled}
                                                    >
                                                        <Text style={[
                                                            styles.statusButtonText,
                                                            order.deliveryStatus === status.value && { color: '#fff' },
                                                            isDisabled && { color: '#999' } // text color for disabled
                                                        ]}>
                                                            {status.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </ScrollView>
                                    </View>


                                    <View style={styles.paymentUpdateContainer}>
                                        <Text style={styles.statusLabel}>Payment:</Text>
                                        <View style={styles.paymentButtons}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.paymentButton,
                                                    order.paymentStatus?.toLowerCase() === 'paid' && styles.paymentButtonPaid
                                                ]}
                                                onPress={() => updatePaymentStatus(order.id, 'Paid')}
                                            >
                                                <Text style={[
                                                    styles.paymentButtonText,
                                                    order.paymentStatus?.toLowerCase() === 'paid' && styles.paymentButtonTextPaid
                                                ]}>
                                                    Mark Paid
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.paymentButton,
                                                    order.paymentStatus?.toLowerCase() === 'pending' && styles.paymentButtonPending
                                                ]}
                                                onPress={() => updatePaymentStatus(order.id, 'Pending')}
                                            >
                                                <Text style={[
                                                    styles.paymentButtonText,
                                                    order.paymentStatus?.toLowerCase() === 'pending' && styles.paymentButtonTextPending
                                                ]}>
                                                    Mark Pending
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                );

            default:
                return null;
        }
    };

    if (!user || user?.role !== 'admin') {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.unauthorizedContainer}>
                    <Settings size={64} color="#e74c3c" />
                    <Text style={styles.unauthorizedTitle}>Access Denied</Text>
                    <Text style={styles.unauthorizedSubtitle}>You don't have admin privileges</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                        <Text style={styles.backButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.tabContainer}>
                {[
                    { key: 'dashboard', icon: <TrendingUp size={20} />, label: 'Dashboard' },
                    { key: 'menu', icon: <Package size={20} />, label: 'Menu' },
                    { key: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders' }
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        {React.cloneElement(tab.icon, { color: activeTab === tab.key ? '#e74c3c' : '#666' })}
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {renderTabContent()}
            {renderFormModal(true)}
            {renderFormModal(false)}
        </SafeAreaView>
    );
};

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
    unauthorizedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    unauthorizedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    unauthorizedSubtitle: {
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    tabActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
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
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    orderDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    orderEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    orderStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    paymentText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    categoryButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    categoryButtonActive: {
        backgroundColor: '#e74c3c',
        borderColor: '#e74c3c',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoryButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    menuItemCard: {
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
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    menuItemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    menuItemHeader: {
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
    menuItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    menuItemActions: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff3f3',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff0f0',
    },
    filterContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    filterButtonActive: {
        backgroundColor: '#e74c3c',
        borderColor: '#e74c3c',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    orderManagementCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderItems: {
        marginVertical: 8,
    },
    orderItem: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    moreItems: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    statusUpdateContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    statusButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#f8f9fa',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    statusButtonText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    paymentUpdateContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    paymentButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    paymentButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    paymentButtonPaid: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    paymentButtonPending: {
        backgroundColor: '#e74c3c',
        borderColor: '#e74c3c',
    },
    paymentButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    paymentButtonTextPaid: {
        color: '#fff',
    },
    paymentButtonTextPending: {
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        padding: 20,
        maxHeight: 400,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#e9ecef',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        padding: 16,
        margin: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    arrivalText: {
        fontSize: 16,
        color: '#D32F2F', // Material Red 700
        fontWeight: 'bold',
        backgroundColor: '#FFEBEE', // Light red background
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 12,
        marginBottom: 12,
        textAlign: 'center',
        alignSelf: 'flex-start' // or 'center' if needed
    },
    bannerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00C853',
        padding: 12,
        zIndex: 999,
        elevation: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    bannerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bannerSubText: {
        color: '#fff',
        fontSize: 14,
        marginTop: 2,
    }


});

export default AdminDashboard;
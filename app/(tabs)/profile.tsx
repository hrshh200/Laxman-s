import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { User, MapPin, Phone, Mail, Clock, Star, ShoppingBag, Heart, Settings, LogOut, ChevronRight, ArrowLeft } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    // Mock user data - replace with actual user data from your auth context
    const userData = {
        name: user?.name || 'Username',
        email: user?.email || 'useremail@example.com',
        phone: user?.mobile || '',
        address: 'Kolkata, West Bengal',
        role: user?.role || 'User',
        joinDate: user?.createdAt,
    };

    // Mock order data - replace with actual order data
    // const orderStats = {
    //     totalOrders: 24,
    //     totalSpent: 2850,
    //     favoriteItems: 8,
    //     avgRating: 4.8,
    // };

    const joinDate = new Date(userData.joinDate);
    const formattedDate = joinDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).replace(/(\d{2}) (\w+) (\d{4})/, '$1 $2, $3');


    // const recentOrders = [
    //     {
    //         id: 1,
    //         restaurant: 'Bella Italia',
    //         items: 'Margherita Pizza, Garlic Bread',
    //         date: '2 days ago',
    //         amount: 450,
    //         status: 'Delivered',
    //     },
    //     {
    //         id: 2,
    //         restaurant: 'Spice Garden',
    //         items: 'Chicken Biryani, Raita',
    //         date: '5 days ago',
    //         amount: 380,
    //         status: 'Delivered',
    //     },
    //     {
    //         id: 3,
    //         restaurant: 'Burger House',
    //         items: 'Classic Burger, Fries',
    //         date: '1 week ago',
    //         amount: 320,
    //         status: 'Delivered',
    //     },
    // ];

    const menuItems = [
        { icon: ShoppingBag, title: 'My Orders', subtitle: 'View order history', onPress: () => { router.push('/orderhistory'); } },
        {
            icon: Heart,
            title: user?.role === 'admin' ? 'Dashboard' : 'About Us',
            subtitle: user?.role === 'admin' ? 'Admin dashboard access' : 'About us section',
            onPress: () => {
                router.push(user?.role === 'admin' ? '/admin' : '/aboutus');
            }
        },

        // { icon: MapPin, title: 'Addresses', subtitle: 'Manage delivery addresses', onPress: () => { } },
        // { icon: Settings, title: 'Settings', subtitle: 'App preferences', onPress: () => { } },
    ];

    if (user == null) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.centerContainer}>
                    <View style={styles.unknownUserCard}>
                        <User size={64} color="#e74c3c" />
                        <Text style={styles.unknownUserTitle}>Welcome to Laxman's</Text>
                        <Text style={styles.unknownUserSubtitle}>Please sign in to access your profile</Text>
                        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                            <Text style={styles.backText}>← Back to Home</Text>
                        </TouchableOpacity>
                    </View>
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
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* User Info Card */}
                <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Hi, {userData.name}!</Text>
                        <Text style={styles.userRole}>{userData.role.toUpperCase()}</Text>
                        <View style={styles.userDetail}>
                            <Mail size={16} color="#666" />
                            <Text style={styles.userDetailText}>{userData.email}</Text>
                        </View>
                        <View style={styles.userDetail}>
                            <Phone size={16} color="#666" />
                            <Text style={styles.userDetailText}>{userData.phone}</Text>
                        </View>
                        <View style={styles.userDetail}>
                            <MapPin size={16} color="#666" />
                            <Text style={styles.userDetailText}>{userData.address}</Text>
                        </View>
                        <View style={styles.userDetail}>
                            <Clock size={16} color="#666" />
                            <Text style={styles.userDetailText}>Member since {formattedDate}</Text>
                        </View>
                    </View>
                </View>


                {/* Order Statistics */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Stats</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <ShoppingBag size={24} color="#e74c3c" />
                            <Text style={styles.statValue}>{orderStats.totalOrders}</Text>
                            <Text style={styles.statLabel}>Total Orders</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>₹{orderStats.totalSpent}</Text>
                            <Text style={styles.statLabel}>Total Spent</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Heart size={24} color="#e74c3c" />
                            <Text style={styles.statValue}>{orderStats.favoriteItems}</Text>
                            <Text style={styles.statLabel}>Favorites</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Star size={24} color="#FFD700" />
                            <Text style={styles.statValue}>{orderStats.avgRating}</Text>
                            <Text style={styles.statLabel}>Avg Rating</Text>
                        </View>
                    </View>
                </View> */}


                {/* Recent Orders */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {recentOrders.map((order) => (
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderRestaurant}>{order.restaurant}</Text>
                                <Text style={styles.orderAmount}>₹{order.amount}</Text>
                            </View>
                            <Text style={styles.orderItems}>{order.items}</Text>
                            <View style={styles.orderFooter}>
                                <Text style={styles.orderDate}>{order.date}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{order.status}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View> */}

                {/* Menu Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                            <View style={styles.menuItemLeft}>
                                <View style={styles.menuIconContainer}>
                                    <item.icon size={20} color="#e74c3c" />
                                </View>
                                <View style={styles.menuItemInfo}>
                                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <LogOut size={20} color="#fff" />
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Copyright */}
                <View style={styles.copyrightContainer}>
                    <Text style={styles.copyrightText}>© 2024 Laxman's Food</Text>
                    <Text style={styles.copyrightSubtext}>All rights reserved</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    unknownUserCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: 320,
        width: '100%',
    },
    unknownUserTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    unknownUserSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    signInButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        paddingHorizontal: 32,
        paddingVertical: 12,
        marginBottom: 16,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    backText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: '600',
    },
    userCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        marginBottom: 16,
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    userRole: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00C853',
        marginBottom: 12
    },
    userDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userDetailText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '48%',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    orderCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderRestaurant: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    orderItems: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
    },
    statusBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemInfo: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    copyrightContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 20,
    },
    copyrightText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    copyrightSubtext: {
        fontSize: 12,
        color: '#999',
    },
});
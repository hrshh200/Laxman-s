import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Phone, MapPin, Star, ArrowLeft, Clock, Award, Users, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { WebView } from 'react-native-webview'; // At the top with other imports


const AboutUs = () => {
    const handleCall = () => {
        Linking.openURL('tel:+918017644259');
    };

    const handleDirections = () => {
        const shopName = "Laxman's Paan Shop";
        const encodedShopName = encodeURIComponent("Laxman's (The Refreshment Shop ),Pan shop");
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedShopName}`);
    };


    // const stats = [
    //     { icon: Users, label: 'Happy Customers', value: '50K+' },
    //     { icon: Award, label: 'Years of Service', value: '5+' },
    //     { icon: Heart, label: 'Dishes Served', value: '1M+' },
    //     { icon: Clock, label: 'Avg Delivery', value: '30 min' },
    // ];

    // const reviews = [
    //     {
    //         name: 'Priya Sharma',
    //         rating: 5,
    //         comment: 'Amazing food quality and super fast delivery! The biryani was absolutely delicious.',
    //         avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    //     },
    //     {
    //         name: 'Rahul Kumar',
    //         rating: 5,
    //         comment: 'Best food delivery app in the city. Great variety and excellent customer service.',
    //         avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    //     },
    //     {
    //         name: 'Anjali Das',
    //         rating: 4,
    //         comment: 'Love the user interface and the food quality is consistently good.',
    //         avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    //     },
    // ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                color="#FFD700"
                fill={index < rating ? "#FFD700" : "transparent"}
            />
        ));
    };

    const shopLocation = {
        latitude: 22.5372, // Elgin Road, Kolkata approx
        longitude: 88.3556,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Us</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Image
                        source={{ uri: 'https://b.zmtcdn.com/data/pictures/chains/9/18420449/d970f5819a23bb3e29008080171f3215.jpg' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>Laxman's</Text>
                        <Text style={styles.heroSubtitle}>Delivering Happiness Since 1976</Text>
                    </View>
                </View>

                {/* About Section */}
                {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.description}>
            Welcome to Laxman's, your trusted food delivery partner bringing the finest cuisines right to your doorstep. 
            We started with a simple mission: to connect food lovers with their favorite restaurants while ensuring 
            quality, freshness, and timely delivery.
          </Text>
          <Text style={styles.description}>
            From humble beginnings to serving thousands of happy customers, we've grown into one of the most reliable 
            food delivery services in the city. Our commitment to excellence and customer satisfaction drives everything we do.
          </Text>
        </View> */}

                {/* Stats Section */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Impact</Text>
                    <View style={styles.statsContainer}>
                        {stats.map((stat, index) => (
                            <View key={index} style={styles.statCard}>
                                <View style={styles.statIconContainer}>
                                    <stat.icon size={24} color="#e74c3c" />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View> */}

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>
                    <View style={styles.contactContainer}>
                        <TouchableOpacity onPress={handleCall} style={styles.contactCard}>
                            <View style={styles.contactIconContainer}>
                                <Phone size={20} color="#e74c3c" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Call Us</Text>
                                <Text style={styles.contactValue}>+91 8017644259</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Directions</Text>
                            <TouchableOpacity onPress={handleDirections} style={styles.contactRow}>
                                <Ionicons name="navigate" size={20} color="green" />
                                <Text style={styles.contactText}>View Our Shop</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Location</Text>
                            <MapView style={styles.map} initialRegion={shopLocation}>
                                <Marker coordinate={shopLocation} title="Laxman's (The Refreshment Shop ),Pan shop" description="Elgin Road, Kolkata" />
                            </MapView>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Our Achievements</Text>
                            <View style={styles.videoContainer}>
                                <WebView
                                    style={styles.video}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    source={{ uri: 'https://www.youtube.com/embed/oHEo5Bkw2dk' }}
                                />
                            </View>
                        </View>


                        {/*Just kolkata as location */}

                        {/* <TouchableOpacity onPress={handleDirections} style={styles.contactCard}>
              <View style={styles.contactIconContainer}>
                <MapPin size={20} color="#e74c3c" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Visit Us</Text>
                <Text style={styles.contactValue}>Kolkata, West Bengal</Text>
              </View>
            </TouchableOpacity> */}
                    </View>
                </View>

                {/* Reviews Section */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What Our Customers Say</Text>
                    {reviews.map((review, index) => (
                        <View key={index} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                                <View style={styles.reviewInfo}>
                                    <Text style={styles.reviewName}>{review.name}</Text>
                                    <View style={styles.reviewRating}>
                                        {renderStars(review.rating)}
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.reviewComment}>"{review.comment}"</Text>
                        </View>
                    ))}
                </View> */}

                {/* Overall Rating */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overall Rating</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingLeft}>
                            <Text style={styles.ratingScore}>4.8</Text>
                            <View style={styles.ratingStars}>
                                {renderStars(5)}
                            </View>
                            <Text style={styles.ratingText}>Based on 2,500+ reviews</Text>
                        </View>
                        <View style={styles.ratingRight}>
                            <View style={styles.ratingBar}>
                                <Text style={styles.ratingBarLabel}>5★</Text>
                                <View style={styles.ratingBarTrack}>
                                    <View style={[styles.ratingBarFill, { width: '85%' }]} />
                                </View>
                                <Text style={styles.ratingBarPercent}>85%</Text>
                            </View>
                            <View style={styles.ratingBar}>
                                <Text style={styles.ratingBarLabel}>4★</Text>
                                <View style={styles.ratingBarTrack}>
                                    <View style={[styles.ratingBarFill, { width: '12%' }]} />
                                </View>
                                <Text style={styles.ratingBarPercent}>12%</Text>
                            </View>
                            <View style={styles.ratingBar}>
                                <Text style={styles.ratingBarLabel}>3★</Text>
                                <View style={styles.ratingBarTrack}>
                                    <View style={[styles.ratingBarFill, { width: '2%' }]} />
                                </View>
                                <Text style={styles.ratingBarPercent}>2%</Text>
                            </View>
                            <View style={styles.ratingBar}>
                                <Text style={styles.ratingBarLabel}>2★</Text>
                                <View style={styles.ratingBarTrack}>
                                    <View style={[styles.ratingBarFill, { width: '1%' }]} />
                                </View>
                                <Text style={styles.ratingBarPercent}>1%</Text>
                            </View>
                            <View style={styles.ratingBar}>
                                <Text style={styles.ratingBarLabel}>1★</Text>
                                <View style={styles.ratingBarTrack}>
                                    <View style={[styles.ratingBarFill, { width: '0%' }]} />
                                </View>
                                <Text style={styles.ratingBarPercent}>0%</Text>
                            </View>
                        </View>
                    </View>
                </View> */}

                {/* Footer Section */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© {new Date().getFullYear()} Laxman's. All rights reserved.</Text>
                    <Text style={styles.footerText}>Built by Harsh in Kolkata</Text>
                </View>


                {/* Back to Home Button */}
                {/* <TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutUs;

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
    videoContainer: {
        height: 200,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 10,
    },
    video: {
        flex: 1,
    },

    backButton: {
        padding: 5,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#222',
    },
    map: {
        width: '100%',
        height: 200,
        borderRadius: 10,
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
    heroSection: {
        position: 'relative',
        height: 200,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 15,
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    contactContainer: {
        gap: 15,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
    },
    contactIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    reviewCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    reviewInfo: {
        flex: 1,
    },
    reviewName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reviewRating: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 15,
        lineHeight: 22,
        color: '#666',
        fontStyle: 'italic',
    },
    ratingContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
    },
    ratingLeft: {
        flex: 1,
        alignItems: 'center',
        paddingRight: 20,
    },
    ratingScore: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 8,
    },
    ratingStars: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    ratingRight: {
        flex: 1,
    },
    ratingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingBarLabel: {
        width: 25,
        fontSize: 12,
        color: '#666',
    },
    ratingBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginHorizontal: 8,
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 4,
    },
    ratingBarPercent: {
        width: 30,
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    homeButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        padding: 16,
        margin: 20,
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 10,
    },
    footerText: {
        color: '#999',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    },

});
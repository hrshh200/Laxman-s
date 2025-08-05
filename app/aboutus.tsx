import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, Animated, Dimensions } from 'react-native';
import { Phone, MapPin, Star, ArrowLeft, Clock, Award, Users, Heart, Sparkles, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import AdminOrderBanner from './AdminOrderBanner';

const { width, height } = Dimensions.get('window');
const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20;

// Enhanced Floating Animation Component
const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000 + delay,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000 + delay,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// Shimmer Effect Component
const ShimmerEffect = ({ style }: { style?: any }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View style={[style, { opacity }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

const AboutUs = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;

    // Header animation on scroll
    useEffect(() => {
        const listener = scrollY.addListener(({ value }) => {
            const opacity = value > 50 ? 1 : value / 50;
            Animated.timing(headerAnim, {
                toValue: opacity,
                duration: 100,
                useNativeDriver: false,
            }).start();
        });

        return () => scrollY.removeListener(listener);
    }, []);

    const handleCall = () => {
        Linking.openURL('tel:+918017644259');
    };

    const handleDirections = () => {
        const shopName = "Laxman's Paan Shop";
        const encodedShopName = encodeURIComponent("Laxman's (The Refreshment Shop ),Pan shop");
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedShopName}`);
    };

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

    const achievements = [
        { icon: Users, label: 'Happy Customers', value: '10K+', color: '#FF6B6B' },
        { icon: Award, label: 'Years of Excellence', value: '48+', color: '#4ECDC4' },
        { icon: Heart, label: 'Paans Served', value: '500K+', color: '#45B7D1' },
        { icon: Clock, label: 'Avg Prep Time', value: '5 min', color: '#96CEB4' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <AdminOrderBanner />
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Enhanced Header with Gradient and Animation */}
            <Animated.View style={[styles.header, { 
                backgroundColor: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 1)']
                })
            }]}>
                <LinearGradient
                    colors={['rgba(0, 200, 83, 0.05)', 'rgba(0, 200, 83, 0.02)']}
                    style={StyleSheet.absoluteFill}
                />
                <FloatingElement>
                    <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                        <View style={styles.backButtonContainer}>
                            <ArrowLeft size={24} color="#00C853" />
                        </View>
                    </TouchableOpacity>
                </FloatingElement>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>About Us</Text>
                    <View style={styles.headerSparkle}>
                        <Sparkles size={16} color="#00C853" />
                    </View>
                </View>
                <View style={styles.placeholder} />
            </Animated.View>

            <Animated.ScrollView 
                showsVerticalScrollIndicator={false} 
                style={styles.scrollView}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Enhanced Hero Section */}
                <View style={styles.heroSection}>
                    <Image
                        source={{ uri: 'https://b.zmtcdn.com/data/pictures/chains/9/18420449/d970f5819a23bb3e29008080171f3215.jpg' }}
                        style={styles.heroImage}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.heroOverlay}
                    >
                        <FloatingElement delay={200}>
                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle}>Laxman's</Text>
                                <Text style={styles.heroSubtitle}>Delivering Happiness Since 1976</Text>
                                <View style={styles.heroBadge}>
                                    <Award size={16} color="#FFD700" />
                                    <Text style={styles.heroBadgeText}>Legacy of Excellence</Text>
                                </View>
                            </View>
                        </FloatingElement>
                    </LinearGradient>
                    <ShimmerEffect style={styles.heroShimmer} />
                </View>

                {/* Enhanced Achievements Section */}
                {/* <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Our Achievements</Text>
                        <View style={styles.trendingBadge}>
                            <TrendingUp size={14} color="#FF6B6B" />
                            <Text style={styles.trendingText}>Growing</Text>
                        </View>
                    </View>
                    <View style={styles.achievementsContainer}>
                        {achievements.map((achievement, index) => (
                            <FloatingElement key={index} delay={index * 100}>
                                <View style={styles.achievementCard}>
                                    <LinearGradient
                                        colors={[achievement.color, `${achievement.color}80`]}
                                        style={styles.achievementGradient}
                                    >
                                        <View style={styles.achievementIconContainer}>
                                            <achievement.icon size={24} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.achievementValue}>{achievement.value}</Text>
                                        <Text style={styles.achievementLabel}>{achievement.label}</Text>
                                    </LinearGradient>
                                    <ShimmerEffect style={styles.achievementShimmer} />
                                </View>
                            </FloatingElement>
                        ))}
                    </View>
                </View> */}

                {/* Enhanced Contact Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Get in Touch</Text>
                        <View style={styles.contactBadge}>
                            <Phone size={14} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.contactContainer}>
                        <FloatingElement delay={100}>
                            <TouchableOpacity onPress={handleCall} style={styles.contactCard}>
                                <LinearGradient
                                    colors={['#FF6B6B', '#FF8E53']}
                                    style={styles.contactGradient}
                                >
                                    <View style={styles.contactIconContainer}>
                                        <Phone size={20} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.contactLabel}>Call Us Now</Text>
                                        <Text style={styles.contactValue}>+91 8017644259</Text>
                                    </View>
                                    <View style={styles.contactArrow}>
                                        <Ionicons name="call" size={16} color="#FFFFFF" />
                                    </View>
                                </LinearGradient>
                                <ShimmerEffect style={styles.contactShimmer} />
                            </TouchableOpacity>
                        </FloatingElement>

                        <FloatingElement delay={200}>
                            <View style={styles.directionsSection}>
                                <View style={styles.directionsSectionHeader}>
                                    <Text style={styles.directionsSectionTitle}>Visit Our Shop</Text>
                                    <View style={styles.locationBadge}>
                                        <MapPin size={14} color="#4ECDC4" />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={handleDirections} style={styles.directionsCard}>
                                    <LinearGradient
                                        colors={['#4ECDC4', '#44A08D']}
                                        style={styles.directionsGradient}
                                    >
                                        <View style={styles.directionsIconContainer}>
                                            <Ionicons name="navigate" size={20} color="#FFFFFF" />
                                        </View>
                                        <View style={styles.directionsInfo}>
                                            <Text style={styles.directionsText}>Get Directions</Text>
                                            <Text style={styles.directionsSubtext}>15 C, Sarat Bose Road, Elgin</Text>
                                        </View>
                                        <View style={styles.directionsArrow}>
                                            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                                        </View>
                                    </LinearGradient>
                                    <ShimmerEffect style={styles.directionsShimmer} />
                                </TouchableOpacity>
                            </View>
                        </FloatingElement>
                    </View>
                </View>

                {/* Enhanced Video Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Our Journey</Text>
                        <View style={styles.videoBadge}>
                            <Ionicons name="play-circle" size={16} color="#fff" />
                        </View>
                    </View>
                    <FloatingElement delay={300}>
                        <View style={styles.videoCard}>
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.videoCardGradient}
                            >
                                <View style={styles.videoContainer}>
                                    <WebView
                                        style={styles.video}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        source={{ uri: 'https://www.youtube.com/embed/oHEo5Bkw2dk' }}
                                    />
                                </View>
                                <View style={styles.videoOverlay}>
                                    <Text style={styles.videoTitle}>Watch Our Story</Text>
                                    <Text style={styles.videoSubtitle}>Decades of tradition and taste</Text>
                                </View>
                            </LinearGradient>
                            <ShimmerEffect style={styles.videoShimmer} />
                        </View>
                    </FloatingElement>
                </View>

                {/* Enhanced Footer Section */}
                <View style={styles.footer}>
                    <LinearGradient
                        colors={['rgba(0, 200, 83, 0.05)', 'rgba(0, 200, 83, 0.02)']}
                        style={styles.footerGradient}
                    >
                        <View style={styles.footerContent}>
                            <View style={styles.footerLogo}>
                                <Text style={styles.footerLogoText}>Laxman's</Text>
                                <Sparkles size={16} color="#00C853" />
                            </View>
                            <Text style={styles.footerText}>© {new Date().getFullYear()} Laxman's. All rights reserved.</Text>
                        </View>
                    </LinearGradient>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

export default AboutUs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 200, 83, 0.1)',
        paddingTop: 45,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 5,
    },
    backButtonContainer: {
        backgroundColor: 'rgba(0, 200, 83, 0.1)',
        borderRadius: 20,
        padding: 8,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
        letterSpacing: 0.3,
    },
    headerSparkle: {
        marginLeft: 8,
    },
    placeholder: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        position: 'relative',
        height: 280,
        overflow: 'hidden',
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
        padding: 24,
        paddingBottom: 32,
    },
    heroShimmer: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        alignItems: 'flex-start',
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroSubtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: 16,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    heroBadgeText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 6,
        letterSpacing: 0.3,
    },
    section: {
        marginVertical: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#333',
        letterSpacing: 0.3,
    },
    trendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendingText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#FF6B6B',
    },
    contactBadge: {
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        padding: 6,
    },
    videoBadge: {
        backgroundColor: '#667eea',
        borderRadius: 12,
        padding: 6,
    },
    locationBadge: {
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderRadius: 12,
        padding: 6,
    },
    achievementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    achievementCard: {
        width: (width - 60) / 2,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    achievementGradient: {
        padding: 20,
        alignItems: 'center',
        minHeight: 140,
        justifyContent: 'center',
    },
    achievementShimmer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
    },
    achievementIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    achievementValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    achievementLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 18,
    },
    contactContainer: {
        paddingHorizontal: 20,
        gap: 20,
    },
    contactCard: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    contactGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    contactShimmer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
    },
    contactIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
        fontWeight: '500',
    },
    contactValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    contactSubtext: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    contactArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsSection: {
        gap: 12,
    },
    directionsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    directionsSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        letterSpacing: 0.2,
    },
    directionsCard: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    directionsGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    directionsShimmer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
    },
    directionsIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    directionsInfo: {
        flex: 1,
    },
    directionsText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    directionsSubtext: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        lineHeight: 18,
    },
    directionsArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    videoCardGradient: {
        padding: 4,
    },
    videoShimmer: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
    },
    videoContainer: {
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    video: {
        flex: 1,
    },
    videoOverlay: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    videoTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    videoSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        textAlign: 'center',
    },
    footer: {
        marginTop: 20,
        overflow: 'hidden',
    },
    footerGradient: {
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    footerContent: {
        alignItems: 'center',
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerLogoText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#00C853',
        marginRight: 8,
        letterSpacing: 0.5,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 6,
    },
    footerSubtext: {
        color: '#999',
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
    },
});
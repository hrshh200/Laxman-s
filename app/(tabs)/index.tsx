"use client"
import { Image } from "expo-image"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { User, ShoppingCart, Star, MapPin, Sparkles, TrendingUp } from "lucide-react-native"
import { useRouter } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState, useCallback, useRef } from "react"
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { onSnapshot, query } from "firebase/firestore"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import AnimatedBanner from "../AnimatedBanner";
import { LockedWindowDimensions } from '@/utils/dimensions';
const { width, height } = LockedWindowDimensions;
import { Audio } from 'expo-av';
import AdminOrderBanner from "../AdminOrderBanner"

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

const CookingAnimation = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const steamAnim1 = useRef(new Animated.Value(0)).current
  const steamAnim2 = useRef(new Animated.Value(0)).current
  const steamAnim3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Rotating pan animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    )

    // Scaling animation for cooking effect
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    )

    // Steam animations with different delays
    const steamAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(steamAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(steamAnim1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    )

    const steamAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(steamAnim2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(steamAnim2, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    )

    const steamAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(steamAnim3, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(steamAnim3, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    )

    rotateAnimation.start()
    scaleAnimation.start()
    steamAnimation1.start()
    steamAnimation2.start()
    steamAnimation3.start()

    return () => {
      rotateAnimation.stop()
      scaleAnimation.stop()
      steamAnimation1.stop()
      steamAnimation2.stop()
      steamAnimation3.stop()
    }
  }, [])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const steamTranslateY1 = steamAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  })

  const steamTranslateY2 = steamAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  })

  const steamTranslateY3 = steamAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  })

  return (
    <View style={styles.cookingContainer}>
      {/* Steam effects */}
      <Animated.View
        style={[
          styles.steam,
          styles.steam1,
          {
            opacity: steamAnim1,
            transform: [{ translateY: steamTranslateY1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.steam,
          styles.steam2,
          {
            opacity: steamAnim2,
            transform: [{ translateY: steamTranslateY2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.steam,
          styles.steam3,
          {
            opacity: steamAnim3,
            transform: [{ translateY: steamTranslateY3 }],
          },
        ]}
      />

      {/* Cooking pan */}
      <Animated.View
        style={[
          styles.cookingPan,
          {
            transform: [{ rotate }, { scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons name="restaurant" size={20} color="#FF6B35" />
      </Animated.View>
    </View>
  )
}

const ReadyAnimation = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const glowAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    )

    pulseAnimation.start()
    glowAnimation.start()

    return () => {
      pulseAnimation.stop()
      glowAnimation.stop()
    }
  }, [])

  return (
    <View style={styles.readyContainer}>
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.readyIcon,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      </Animated.View>
    </View>
  )
}

interface Order {
  id: string
  deliveryMethod: string
  deliveryStatus: string
  grandTotal: number
  deliveryAddress?: string
  estimatedDelivery?: string
  paymentStatus?: string
}

export default function HomeScreen() {
  const { user, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)
  const notificationSoundRef = useRef<Audio.Sound | null>(null);
  const [neworders, setNewOrders] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      const fetchCartCount = async () => {
        if (!user?.uid) return
        try {
          const cartRef = collection(db, "users", user.uid, "cart")
          const snapshot = await getDocs(cartRef)
          setCartCount(snapshot.size)
        } catch (error) {
          console.error("Error fetching cart count:", error)
        }
      }

      fetchCartCount()
    }, [user]),
  )

  useEffect(() => {
    if (!user?.uid) return

    const orderRef = collection(db, "users", user.uid, "orders")
    const q = query(orderRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, "id">),
      }))

      const processingOrder = orderList.find(
        (order) => order.deliveryStatus === "Processing Your Order" || order.deliveryStatus === "Your Order is Ready",
      )

      if (processingOrder) {
        setActiveOrder(processingOrder)
      } else {
        setActiveOrder(null)
      }
    })

    return () => unsubscribe()
  }, [user])

  const slideAnim = useRef(new Animated.Value(-100)).current

  const isProcessing = activeOrder?.deliveryStatus === "Processing Your Order"
  const isReady = activeOrder?.deliveryStatus === "Order Ready" || activeOrder?.deliveryStatus === "Ready for Pickup"

  useEffect(() => {
    if (activeOrder) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    }
  }, [activeOrder])

  const categories = [
    {
      id: 1,
      name: "Paan",
      image: "https://t4.ftcdn.net/jpg/01/67/17/97/360_F_167179728_Eou5mvDsorEy0SmCPngudVbzajtsBlaG.jpg",
      nav: "paan",
      gradient: ["#FF6B6B", "#FF8E53"],
      icon: "🌿"
    },
    {
      id: 2,
      name: "Chaat",
      image: "https://www.cookwithmanali.com/wp-content/uploads/2022/03/Papdi-Chaat-676x1024.jpg",
      nav: "chaat",
      gradient: ["#4ECDC4", "#44A08D"],
      icon: "🥗"
    },
    {
      id: 3,
      name: "Beverages",
      image: "https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      nav: "beverages",
      gradient: ["#667eea", "#764ba2"],
      icon: "🥤"
    },
    {
      id: 4,
      name: "Others",
      image: "https://st3.depositphotos.com/31273274/36119/i/450/depositphotos_361198124-stock-photo-banner-bitter-chocolate-wooden-board.jpg",
      nav: "others",
      gradient: ["#f093fb", "#f5576c"],
      icon: "🍽️"
    },
  ]

  const popularDishes = [
    {
      id: 1,
      name: "Kesar Meetha Paan",
      restaurant: "Laxmans",
      price: "₹100",
      rating: 4.6,
      image: "https://t4.ftcdn.net/jpg/05/39/35/93/360_F_539359381_LQsJTRIswnrEEK4S9vpsITp3qA2gUD9e.jpg",
      nav: 'paan',
      badge: "Popular"
    },
    {
      id: 2,
      name: "Mixed Papri Chaat",
      restaurant: "laxmans",
      price: "₹100",
      rating: 4.4,
      image: "https://www.cookwithmanali.com/wp-content/uploads/2022/03/Papdi-Chaat-676x1024.jpg",
      nav: 'chaat',
      badge: "Trending"
    },
  ]

  const foodBanners = [
    {
      id: 1,
      title: "Authentic Paan Collection",
      subtitle: "Traditional flavors, modern twist",
      description: "Experience the rich taste of our handcrafted paans",
      image: "https://t4.ftcdn.net/jpg/01/67/17/97/360_F_167179728_Eou5mvDsorEy0SmCPngudVbzajtsBlaG.jpg",
      colors: ["#FF6B6B", "#FF8E53", "#FFB347"],
      buttonText: "Explore Paans",
      nav: "paan",
    },
    {
      id: 2,
      title: "Street Style Chaat",
      subtitle: "Crispy, tangy, irresistible",
      description: "Savor the authentic street food experience",
      image: "https://www.cookwithmanali.com/wp-content/uploads/2022/03/Papdi-Chaat-676x1024.jpg",
      colors: ["#4ECDC4", "#44A08D", "#2E8B8B"],
      buttonText: "Order Chaat",
      nav: "chaat",
    },
    {
      id: 3,
      title: "Special Combo Offer",
      subtitle: "Paan + Chaat = Perfect Match",
      description: "Limited time special offer",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      colors: ["#667eea", "#764ba2", "#8E54E9"],
      buttonText: "Explore",
      nav: "paan",
      isOffer: true,
    },
  ]

  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <AdminOrderBanner />

      {/* Enhanced Header with Gradient and Animation */}
      <Animated.View style={[styles.header, { backgroundColor: headerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(239, 255, 240, 0.95)', 'rgba(239, 255, 240, 1)']
      })}]}>
        <LinearGradient
          colors={['rgba(0, 200, 83, 0.05)', 'rgba(0, 200, 83, 0.02)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/aboutus")}>
            <View style={styles.logoContainer}>
              <Text style={styles.headerTitle}>Laxman's</Text>
              <View style={styles.sparkleContainer}>
                <Sparkles size={16} color="#00C853" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <View style={styles.locationIconContainer}>
              <MapPin size={14} color="#666" />
            </View>
            <Text style={styles.locationText}>15 C, Sarat Bose Road, Elgin, Kolkata</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {user ? (
              <TouchableOpacity style={styles.profileCircle} onPress={() => router.push("/profile")}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.profileGradient}
                >
                  <Text style={styles.profileText}>{user?.email?.[0]?.toUpperCase() || "P"}</Text>
                </LinearGradient>
              </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/login")}>
              <View style={styles.iconContainer}>
                <User size={22} color="#333" />
              </View>
            </TouchableOpacity>
          )}
            <TouchableOpacity style={styles.cartIconContainer} onPress={() => router.push("/cart")}>
              <View style={styles.cartIconBg}>
                <ShoppingCart size={22} color="#00C853" />
                {cartCount > 0 && (
                  <Animated.View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </Animated.View>
                )}
              </View>
            </TouchableOpacity>
        </View>
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
        <AnimatedBanner />
        
        {/* Enhanced Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.sectionIcon}>
              <Sparkles size={18} color="#00C853" />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <FloatingElement key={category.id} delay={index * 100}>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => router.push(`/${category.nav}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryCard}>
                    <LinearGradient
                      colors={category.gradient}
                      style={styles.categoryGradient}
                    >
                      <View style={styles.categoryImageContainer}>
                        <Image source={{ uri: category.image }} style={styles.categoryImage} />
                        <View style={styles.categoryOverlay} />
                        <Text style={styles.categoryEmoji}>{category.icon}</Text>
                      </View>
                    </LinearGradient>
                    <ShimmerEffect style={styles.categoryShimmer} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              </FloatingElement>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Popular Dishes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Laxman's</Text>
            <View style={styles.trendingBadge}>
              <TrendingUp size={14} color="#FF6B6B" />
              <Text style={styles.trendingText}>Hot</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularDishes.map((dish, index) => (
              <FloatingElement key={dish.id} delay={index * 150}>
                <TouchableOpacity style={styles.dishCard} onPress={() => router.push(`/${dish.nav}` as any)} activeOpacity={0.9}>
                  <View style={styles.dishImageContainer}>
                    <Image source={{ uri: dish.image }} style={styles.dishImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.dishImageOverlay}
                    />
                    <View style={styles.dishBadge}>
                      <Text style={styles.dishBadgeText}>{dish.badge}</Text>
                    </View>
                  </View>
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishRestaurant}>{dish.restaurant}</Text>
                    <View style={styles.dishBottom}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.dishPrice}>{dish.price}</Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.ratingText}>{dish.rating}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </FloatingElement>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Food Banners */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special for You</Text>
            <View style={styles.specialBadge}>
              <Sparkles size={14} color="#fff" />
            </View>
          </View>
          {foodBanners.map((banner, index) => (
            <FloatingElement key={banner.id} delay={index * 200}>
              <TouchableOpacity
                style={styles.bannerCard}
                onPress={() => router.push(`/${banner.nav}` as any)}
                activeOpacity={0.95}
              >
                <LinearGradient
                  colors={banner.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bannerGradient}
                >
                  <View style={styles.bannerContent}>
                    <View style={styles.bannerTextSection}>
                      {banner.isOffer && (
                        <Animated.View style={styles.offerTag}>
                          <Sparkles size={10} color="#FFFFFF" />
                          <Text style={styles.offerTagText}>SPECIAL OFFER</Text>
                        </Animated.View>
                      )}
                      <Text style={styles.bannerTitle}>{banner.title}</Text>
                      <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                      <Text style={styles.bannerDescription}>{banner.description}</Text>
                      <View style={styles.bannerButton}>
                        <Text style={styles.bannerButtonText}>{banner.buttonText}</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
                      </View>
                    </View>
                    <View style={styles.bannerImageSection}>
                      <View style={styles.bannerImageContainer}>
                        <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                        <View style={styles.bannerImageGlow} />
                      </View>
                    </View>
                  </View>
                  <ShimmerEffect style={styles.bannerShimmer} />
                </LinearGradient>
              </TouchableOpacity>
            </FloatingElement>
          ))}
        </View>
      </Animated.ScrollView>

      {activeOrder && (
        <Animated.View
          style={[
            styles.processingBanner,
            isProcessing ? styles.bannerYellow : styles.bannerGreen,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.push(`/orderdetails?orderId=${activeOrder.id}`)}>
            <LinearGradient
              colors={isProcessing ? 
                ['rgba(255, 193, 7, 0.1)', 'rgba(255, 152, 0, 0.1)'] : 
                ['rgba(76, 175, 80, 0.1)', 'rgba(56, 142, 60, 0.1)']
              }
              style={styles.processingGradient}
            >
              <View style={styles.bannerContent}>
                <View style={styles.animationContainer}>
                  {isProcessing ? <CookingAnimation /> : <ReadyAnimation />}
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.processingText}>{activeOrder.deliveryStatus}</Text>
                  <Text style={styles.subText}>
                    {isProcessing ? "Our chefs are preparing your delicious meal" : "Your order is ready for pickup!"}
                  </Text>
                </View>

                <View style={styles.pulseIndicator}>
                  <Animated.View style={[styles.pulse, isProcessing ? styles.pulseYellow : styles.pulseGreen]} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    height: height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 200, 83, 0.1)",
    paddingTop: 45,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#00C853",
    letterSpacing: 0.5,
  },
  sparkleContainer: {
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  locationIconContainer: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
    borderRadius: 8,
    padding: 2,
    marginRight: 6,
  },
  locationText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 15,
    position: "relative",
  },
  iconContainer: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
    borderRadius: 20,
    padding: 8,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cartIconContainer: {
    position: "relative",
  },
  cartIconBg: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
    borderRadius: 20,
    padding: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 0.3,
  },
  sectionIcon: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
    borderRadius: 15,
    padding: 6,
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  specialBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    padding: 6,
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 90,
  },
  categoryCard: {
    width: 75,
    height: 75,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 10,
  },
  categoryGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 2,
  },
  categoryImageContainer: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  categoryEmoji: {
    position: "absolute",
    bottom: 4,
    right: 4,
    fontSize: 16,
  },
  categoryShimmer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  // Enhanced Banner Styles
  bannerCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bannerGradient: {
    padding: 24,
    minHeight: 160,
    position: "relative",
  },
  bannerShimmer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTextSection: {
    flex: 1,
    paddingRight: 20,
  },
  offerTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  offerTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: 8,
    fontWeight: "600",
  },
  bannerDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 16,
    lineHeight: 18,
  },
  bannerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  bannerImageSection: {
    width: 90,
    height: 90,
  },
  bannerImageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  bannerImageGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
  },

  // Enhanced Dish Card Styles
  dishCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginLeft: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: "hidden",
  },
  dishImageContainer: {
    position: "relative",
    height: 120,
  },
  dishImage: {
    width: "100%",
    height: "100%",
  },
  dishImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  dishBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dishBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  dishInfo: {
    padding: 16,
  },
  dishName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  dishRestaurant: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    fontWeight: "500",
  },
  dishBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#00C853",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  // Enhanced Processing Banner
  processingBanner: {
    width: LockedWindowDimensions.width - 20,
    marginHorizontal: 10,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    paddingBottom: 100,
    overflow: "hidden",
  },
  processingGradient: {
    borderRadius: 16,
    padding: 4,
  },
  bannerYellow: {
    backgroundColor: "#FFF8E1",
    borderLeftWidth: 5,
    borderLeftColor: "#FF9800",
  },
  bannerGreen: {
    backgroundColor: "#E8F5E8",
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  animationContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    lineHeight: 16,
  },
  pulseIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 12,
  },
  pulse: {
    width: "100%",
    height: "100%",
    borderRadius: 7,
  },
  pulseYellow: {
    backgroundColor: "#FF9800",
  },
  pulseGreen: {
    backgroundColor: "#4CAF50",
  },

  // Animation Styles
  cookingContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cookingPan: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF9800",
    elevation: 2,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  steam: {
    position: "absolute",
    width: 3,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    top: 5,
  },
  steam1: {
    left: 14,
  },
  steam2: {
    left: 20,
  },
  steam3: {
    left: 26,
  },
  readyContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  glowCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  readyIcon: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
})
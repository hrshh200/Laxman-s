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
import { User, ShoppingCart, Star, MapPin } from "lucide-react-native"
import { useRouter } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState, useCallback, useRef } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { onSnapshot, query } from "firebase/firestore"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import AnimatedBanner from "../AnimatedBanner"

const { width } = Dimensions.get("window");
const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20;

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

    return () => unsubscribe() // Clean up the listener when component unmounts
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
      image: "https://t4.ftcdn.net/jpg/01/67/17/97/360_F_167179728_Eou5mvDsorEy0SmCPngudVbzajtsBlaG.jpg", // image of meetha paan
      nav: "paan",
    },
    {
      id: 2,
      name: "Chaat",
      image: "https://www.cookwithmanali.com/wp-content/uploads/2022/03/Papdi-Chaat-676x1024.jpg", // image of aloo tikki chaat
      nav: "chaat",
    },
    {
      id: 3,
      name: "Beverages",
      image:
        "https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", // juice/smoothie
      nav: "beverages",
    },
    {
      id: 4,
      name: "Others",
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop", // salad/street food
      nav: "",
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
      nav: 'paan'
    },
    {
      id: 2,
      name: "Mixed Papri Chaat",
      restaurant: "laxmans",
      price: "₹100",
      rating: 4.4,
      image: "https://www.cookwithmanali.com/wp-content/uploads/2022/03/Papdi-Chaat-676x1024.jpg",
      nav: 'chaat'
    },
  ]

  const foodBanners = [
    {
      id: 1,
      title: "Authentic Paan Collection",
      subtitle: "Traditional flavors, modern twist",
      description: "Experience the rich taste of our handcrafted paans",
      image: "https://t4.ftcdn.net/jpg/01/67/17/97/360_F_167179728_Eou5mvDsorEy0SmCPngudVbzajtsBlaG.jpg",
      colors: ["#FF6B6B", "#FF8E53"],
      buttonText: "Explore Paans",
      nav: "paan",
    },
    {
      id: 2,
      title: "Street Style Chaat",
      subtitle: "Crispy, tangy, irresistible",
      description: "Savor the authentic street food experience",
      image: "https://www.cookwithmanali.com/wp-content/uploads/2022/03/Papdi-Chaat-676x1024.jpg",
      colors: ["#4ECDC4", "#44A08D"],
      buttonText: "Order Chaat",
      nav: "chaat",
    },
    {
      id: 3,
      title: "Special Combo Offer",
      subtitle: "Paan + Chaat = Perfect Match",
      description: "",
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      colors: ["#667eea", "#764ba2"],
      buttonText: "Explore",
      nav: "paan",
      isOffer: true,
    },
  ]

  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FFF5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/aboutus")}>
            <Text style={styles.headerTitle}>Laxman's</Text>
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>15 C, Sarat Bose Road, Elgin, Kolkata</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {user ? (
            <View>
              <TouchableOpacity style={styles.profileCircle} onPress={() => router.push("/profile")}>
                <Text style={styles.profileText}>{user?.email?.[0]?.toUpperCase() || "P"}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/login")}>
              <User size={24} color="#333" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/cart")}>
            <ShoppingCart size={24} color="#333" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/*Food Categories*/}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <AnimatedBanner />
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => router.push(`/${category.nav}` as any)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Dishes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular in Laxman's</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularDishes.map((dish) => (
              <TouchableOpacity key={dish.id} style={styles.dishCard} onPress={() => router.push(`/${dish.nav}` as any)}>
                <Image source={{ uri: dish.image }} style={styles.dishImage} />
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishRestaurant}>{dish.restaurant}</Text>
                  <View style={styles.dishBottom}>
                    <Text style={styles.dishPrice}>{dish.price}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>{dish.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Food Banners */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special for You</Text>
          {foodBanners.map((banner) => (
            <TouchableOpacity
              key={banner.id}
              style={styles.bannerCard}
              onPress={() => router.push(`/${banner.nav}` as any)}
            >
              <LinearGradient
                colors={banner.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerContent}>
                  <View style={styles.bannerTextSection}>
                    {/* {banner.isOffer && (
                      <View style={styles.offerTag}>
                        <Text style={styles.offerTagText}>SPECIAL OFFER</Text>
                      </View>
                    )} */}
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                    <Text style={styles.bannerDescription}>{banner.description}</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                      <Text style={styles.bannerButtonText}>{banner.buttonText}</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bannerImageSection}>
                    <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
            <View style={styles.bannerContent}>
              <View style={styles.animationContainer}>{isProcessing ? <CookingAnimation /> : <ReadyAnimation />}</View>

              <View style={styles.textContainer}>
                <Text style={styles.processingText}>{activeOrder.deliveryStatus}</Text>
                <Text style={styles.subText}>
                  {isProcessing ? "Our chefs are preparing your delicious meal" : "Your order is ready for pickup!"}
                </Text>
              </View>

              <View style={styles.pulseIndicator}>
                <View style={[styles.pulse, isProcessing ? styles.pulseYellow : styles.pulseGreen]} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: topPadding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#EFFFF0",
    borderBottomWidth: 1,
    borderBottomColor: "#EFFFF0",
    paddingTop: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00C853",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 20,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
    color: "#333",
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // Food Banner Styles
  bannerCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bannerGradient: {
    padding: 20,
    minHeight: 140,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTextSection: {
    flex: 1,
    paddingRight: 16,
  },
  offerTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  offerTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 6,
    fontWeight: "500",
  },
  bannerDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    lineHeight: 16,
  },
  bannerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  bannerImageSection: {
    width: 80,
    height: 80,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  dishCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dishImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  dishRestaurant: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  dishBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  processingBanner: {
    width: width - 20,
    marginHorizontal: 10,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerYellow: {
    backgroundColor: "#FFF8E1",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  bannerGreen: {
    backgroundColor: "#E8F5E8",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  animationContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
  },
  pulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  pulse: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  pulseYellow: {
    backgroundColor: "#FF9800",
  },
  pulseGreen: {
    backgroundColor: "#4CAF50",
  },

  // Cooking Animation Styles
  cookingContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cookingPan: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF9800",
  },
  steam: {
    position: "absolute",
    width: 3,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    top: 5,
  },
  steam1: {
    left: 12,
  },
  steam2: {
    left: 18,
  },
  steam3: {
    left: 24,
  },

  readyContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  glowCircle: {
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  readyIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
})

import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getFirestore, collection, addDoc, doc, updateDoc, where, query, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20;
export default function OrderInstructions() {
    const { id, name, description, fulldescription, price, image, isVeg } = useLocalSearchParams();

    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState('');

    const numericPrice = parseFloat(price as string) || 0;
    const total = quantity * numericPrice;
    const { user, logout } = useAuth();
    const db = getFirestore(getApp());

    const handleAddToCart = async () => {
    if (!user || !user.uid) {
        console.log('User not logged in');
        return;
    }

    try {
        const cartRef = collection(db, 'users', user.uid, 'cart');

        // Step 1: Check if item already exists in cart
        const q = query(cartRef, where('name', '==', name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Item exists – update its quantity and total
            const existingDoc = querySnapshot.docs[0];
            const existingData = existingDoc.data();
            const updatedQuantity = existingData.quantity + quantity;
            const updatedTotal = updatedQuantity * numericPrice;

            await updateDoc(existingDoc.ref, {
                quantity: updatedQuantity,
                total: updatedTotal,
                instructions, // Optional: Update latest instructions
                createdAt: new Date(), // Optional: Update timestamp
            });

            console.log('Cart item updated');
        } else {
            // Item does not exist – add it as new
            await addDoc(cartRef, {
                name,
                quantity,
                instructions,
                total,
                price: numericPrice,
                image: image || '',
                isVeg: isVeg === '1',
                createdAt: new Date(),
            });

            console.log('Item added to cart');
        }

        router.push('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};
    const incrementQuantity = () => {
        setQuantity(q => q + 1);
    };

    const decrementQuantity = () => {
        setQuantity(q => Math.max(1, q - 1));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image as string }} style={styles.image} />
                    {isVeg === '1' && (
                        <View style={styles.vegBadge}>
                            <View style={styles.vegDot} />
                        </View>
                    )}
                </View>

                {/* Product Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{name}</Text>

                    {description && (
                        <View style={styles.descriptionBadge}>
                            <Text style={styles.descriptionText}>{description}</Text>
                        </View>
                    )}

                    <Text style={styles.price}>₹{numericPrice}</Text>

                    {fulldescription && (
                        <Text style={styles.fullDescription}>{fulldescription}</Text>
                    )}
                </View>

                {/* Quantity Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quantity</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={decrementQuantity}
                            style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                            disabled={quantity === 1}
                        >
                            <Minus size={20} color={quantity === 1 ? "#ccc" : "#e74c3c"} />
                        </TouchableOpacity>

                        <View style={styles.quantityDisplay}>
                            <Text style={styles.quantityText}>{quantity}</Text>
                        </View>

                        <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                            <Plus size={20} color="#e74c3c" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Special Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Special Instructions</Text>
                    <TextInput
                        style={styles.instructionsInput}
                        placeholder="Add any special instructions (e.g., extra sweet, less spicy, etc.)"
                        placeholderTextColor="#999"
                        value={instructions}
                        onChangeText={setInstructions}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Order Summary */}
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Item Price</Text>
                        <Text style={styles.summaryValue}>₹{numericPrice}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Quantity</Text>
                        <Text style={styles.summaryValue}>×{quantity}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Packing</Text>
                        <Text style={styles.summaryValue}>₹0</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                        <Text style={styles.summaryTotalValue}>₹{total}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <ShoppingCart size={20} color="#fff" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: topPadding
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
    placeholder: {
        width: 34,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        margin: 20,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
    },
    vegBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    vegDot: {
        width: 12,
        height: 12,
        borderRadius: 2,
        backgroundColor: '#4CAF50',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    detailsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    descriptionBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 12,
    },
    fullDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 8,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    quantityButtonDisabled: {
        backgroundColor: '#f5f5f5',
    },
    quantityDisplay: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 16,
        minWidth: 60,
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    instructionsInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    summaryContainer: {
        backgroundColor: '#f8f9fa',
        margin: 20,
        borderRadius: 12,
        padding: 20,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    summaryTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    addToCartButton: {
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
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
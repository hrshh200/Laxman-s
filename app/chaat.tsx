import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';

export default function Chaat() {

    type ChaatItem = {
        id: string;
        name: string;
        description: string;
        fulldescription: string;
        price: number;
        image: string;
        isVeg: boolean;
    };

    const [chaatCategories, setChaatCategories] = useState<ChaatItem[]>([]);
    const { user, logout } = useAuth();

    const handleAddToCart = (item: ChaatItem) => {
        router.push({
            pathname: '/orderinstructions',
            params: {
                id: item.id,
                name: item.name,
                description: item.description,
                fulldescription: item.fulldescription,
                price: item.price.toString(), // pass as string
                image: item.image,
                isVeg: item.isVeg ? '1' : '0', // convert boolean
            }
        });
    };

    useEffect(() => {
        const fetchChaatData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'chaat'));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setChaatCategories(data);
            } catch (error) {
                console.error('Error fetching chaat data:', error);
            }
        };

        fetchChaatData();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    <Text style={styles.greenPaan}>Chaat</Text>
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Paan Items */}
                <View style={styles.section}>
                    {chaatCategories.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemContent}>
                                <View style={styles.itemLeft}>
                                    <View style={styles.itemHeader}>
                                        {item.isVeg && <View style={styles.vegIndicator} />}
                                        <Text style={styles.itemName}>{item.name}</Text>
                                    </View>

                                    <View style={styles.descriptionContainer}>
                                        <Text style={styles.itemDescription}>{item.description}</Text>
                                    </View>

                                    <Text style={styles.itemPrice}>₹{item.price}</Text>

                                    <Text style={styles.fullDescription}>{item.fulldescription}</Text>

                                    {user ? (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => handleAddToCart(item)}
                                        >
                                            <Text style={styles.addButtonText}>ADD TO CART</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.disabledButton}>
                                            <Text style={styles.disabledButtonText}>LOGIN TO ADD</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.itemRight}>
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Back to Home Button */}
                {/* <TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity> */}
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 3,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        color: '#333',
    },
    greenPaan: {
        fontSize: 26,
        color: '#2e7d32', // deep green
        fontFamily: 'DancingScript-Bold', // Or use another fancy font
        fontStyle: 'italic',
        letterSpacing: 1.5,
    },
    placeholder: {
        width: 24, // just to balance the space from backButton
    },
    scrollView: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    disabledButton: {
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
        opacity: 0.5,
    },
    disabledButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
    },
    itemContent: {
        flexDirection: 'row',
        padding: 16,
    },
    itemLeft: {
        flex: 1,
        paddingRight: 16,
    },
    itemRight: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    descriptionContainer: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    itemDescription: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    fullDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e74c3c',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    addButtonText: {
        color: '#e74c3c',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemImage: {
        width: 100,
        height: 80,
        borderRadius: 8,
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
});
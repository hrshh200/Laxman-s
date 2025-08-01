import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface FoodItem {
  id: string;
  name: string;
  type?: string;
  price: number;
  category: string;
  image?: string;
  description?: string,
  fulldescription?: string;
  isVeg?: boolean;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);

  const favorites = ['paan', 'chaat', 'beverages'];

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setResults([]);
      return;
    }

    const collections = ['paan', 'chaat', 'beverages'];
    const allResults: FoodItem[] = [];

    for (const col of collections) {
      const ref = collection(db, col);
      const snapshot = await getDocs(ref);

      // First map and cast to FoodItem[]
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          category: col,
          ...data,
        } as FoodItem;
      });

      // Then safely filter using full type
      const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(text.toLowerCase())
      );

      allResults.push(...filtered);
    }

    setResults(allResults);
  };


  const handleFavoritePress = (favorite: string) => {
    handleSearch(favorite);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  const handleAddToCart = (item: FoodItem) => {
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Search Laxman's Menu</Text>
        </View>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.favoritesContainer}>
          <Text style={styles.favoritesLabel}>Favorites:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {favorites.map((fav, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.favoriteChip,
                  searchQuery === fav && styles.favoriteChipActive,
                ]}
                onPress={() => handleFavoritePress(fav)}
              >
                <Text
                  style={[
                    styles.favoriteText,
                    searchQuery === fav && styles.favoriteTextActive,
                  ]}
                >
                  {fav}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.resultsList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultMeta}>
                {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'} • ₹{item.price}
              </Text>
              {item.fulldescription && (
                <Text style={styles.cardDescription}>{item.fulldescription}</Text>
              )}
              <Text style={styles.resultCategory}>From: {item.category}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addButtonText} onPress={() => handleAddToCart(item)}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerText: {
    marginLeft: 40,
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    color: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  favoritesContainer: {
    marginTop: 8,
  },
  favoritesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  favoriteChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  favoriteChipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  favoriteText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  favoriteTextActive: {
    color: '#fff',
  },
  resultsList: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  resultMeta: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  resultCategory: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  backButton: {
    padding: 5,
  },
  headerContainer: {
    flexDirection: 'row',

  }
});

export default Search;

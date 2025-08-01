import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

const db = getFirestore(); // Firestore instance

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) {
      return Alert.alert('Please enter your email.');
    }

    try {
      // 🔍 Check if email exists in Firestore "users" collection
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return Alert.alert('No account found with this email.');
      }

      // ✅ If email exists, send reset email
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Check your inbox for reset instructions.');
      router.back(); // Go back to login
    } catch (error) {
      console.error('Reset error:', error);
      Alert.alert('Error', 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#eee', padding: 14, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#00C853', padding: 16, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

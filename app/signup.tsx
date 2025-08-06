import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import Loader from '@/components/Loader';
import { MaterialIcons } from '@expo/vector-icons';

const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20;

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const SigningUpCustomer = async () => {
    if (!name || !email || !password || !mobile) {
      return showToast('Please fill all fields');
    }

    try {
      setLoading(true);

      // 1. Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential.user;

      // 2. Send email verification
      await sendEmailVerification(createdUser);
      await signOut(auth);

      // 3. Save user data in Firestore
      // await setDoc(doc(db, 'users', createdUser.uid), {
      //   uid: createdUser.uid,
      //   name,
      //   email,
      //   password,
      //   mobile,
      //   createdAt: new Date().toISOString(),
      //   role: '',
      // });

      // 4. Show toast and redirect to login
      showToast('Verification email sent. (Check Spam Folder) Please verify and then log in.');
      router.replace({
        pathname: '/login',
        params: {
          name,
          mobile,
        },
      });


    } catch (error: any) {
      console.error('Signup error:', error);
      showToast(error.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="#999"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
      />

      <View style={styles.inputShowContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={secure}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.icon}>
          <MaterialIcons name={secure ? 'visibility-off' : 'visibility'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={SigningUpCustomer}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: topPadding,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 40,
  },
  backText: {
    paddingTop: 30,
    textAlign: 'center',
    color: '#00C853',
    marginVertical: 10,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#666',
    marginTop: 20,
    fontSize: 14,
  },
  icon: {
        position: 'absolute',
        right: 10,
        top: '30%',
    },
    inputShowContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: 16,
    }
});

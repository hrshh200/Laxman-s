import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ToastAndroid, Alert, Platform, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, StatusBar} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Loader from '@/components/Loader';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();

const topPadding = Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20;
export default function LoginScreen() {
    const { user, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secure, setSecure] = useState(true);


    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '54124910689-lto28ot0ts6drd9r2db85vlaict3di07.apps.googleusercontent.com',
        iosClientId: '54124910689-e00o9a6f6cabdlud9ett9j19k3b1tm79.apps.googleusercontent.com',
        webClientId: '54124910689-ne7kc1vfg4a0ua9bhudb9a22e6dm4rga.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@harshsharma088/Laxmans',
    });



    const showToast = (msg: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            Alert.alert(msg);
        }
    };
    // useEffect(() => {
    //     console.log("Google request:", request);
    //     console.log("Google response:", response);
    // }, [request, response]);



    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    showToast('Logged in with Google');
                })
                .catch((error) => {
                    console.error('Google Sign-In error', error);
                    showToast('Google login failed');
                });
        }
    }, [response]);


    useEffect(() => {
        if (user) {
            // User already logged in
            router.replace('/'); // Redirect to home/dashboard
            // showToast('Logged In Successfully!');
        }
    }, [user]);

    const handleLogin = async () => {
        if (!email || !password) {
            return alert('Please enter email and password');
        }

        try {
            setLoading(true);
            await login(email, password); // ✅ Wait for login to finish
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        } finally {
            setLoading(false); // ✅ Hide loader after login attempt finishes
        }
    };


    if (loading) {
        return <Loader />;
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/p/AF1QipMDN1-i1QSAtpp4Gnjgsu3WYJrAkz-oUqpSAhLu=s1360-w1360-h1020' }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome to Laxman’s Refreshment Shop</Text>
                    <Text style={styles.subtitle}>Login to explore your favorite food</Text>

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#888"
                        style={styles.input}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View style={styles.inputShowContainer}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#888"
                            style={styles.input}
                            secureTextEntry={secure}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.icon}>
                            <MaterialIcons
                                name={secure ? 'visibility-off' : 'visibility'}
                                size={24}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={styles.backText}>← Back to Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
                        <Text style={styles.registerText}>Forgot Password?</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text style={styles.registerText}>Don’t have an account? Sign up</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: '#4285F4' }]}
                    onPress={() => promptAsync()}
                    disabled={false}
                >
                    <Text style={styles.loginButtonText}>Continue with Google</Text>
                </TouchableOpacity> */}

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

// ...styles remain same


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: topPadding
    },
    image: {
        width: '100%',
        height: 250,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#e74c3c',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backText: {
        textAlign: 'center',
        color: '#00C853',
        marginVertical: 10,
        fontWeight: '600',
    },
    registerText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 13,
        marginTop: 12,
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
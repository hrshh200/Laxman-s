// firebase/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6qHuCUkmFL2VAf-jOKB_dG3YtMU1HhM8",
  authDomain: "laxman-s.firebaseapp.com",
  projectId: "laxman-s",
  storageBucket: "laxman-s.firebasestorage.app",
  messagingSenderId: "54124910689",
  appId: "1:54124910689:web:9c2c5634b491abe87eb220",
  measurementId: "G-16C22KQF74",
};

// Ensure app is initialized once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


// Check if auth is already initialized
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}


// Firestore
const db = getFirestore(app);

export { app, auth, db };

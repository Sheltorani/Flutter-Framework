import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your exact verified web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDeJ5fAKjMU96RTtm5-5dS7LQthwOZJ8g",
  authDomain: "cipher-app-ff375.firebaseapp.com",
  databaseURL: "https://cipher-app-ff375-default-rtdb.firebaseio.com",
  projectId: "cipher-app-ff375",
  storageBucket: "cipher-app-ff375.firebasestorage.app",
  messagingSenderId: "997030976908",
  appId: "1:997030976908:web:63eae63f74ee04e6c28aa9",
  measurementId: "G-1QB76MDPZC"
};

// Initialize Firebase core services
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Handle persistent anonymous user initialization
 */
export const initializeAnonymousUser = async () => {
  try {
    // If a user is already cached locally, Firebase handles it automatically
    if (auth.currentUser) return auth.currentUser;
    
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Anonymous Auth failed:", error);
    throw error;
  }
};

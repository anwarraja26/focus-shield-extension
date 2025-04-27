// firebaseService.js - Firebase JS SDK Version
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6P_oLG0CNgv5nQyBaIuQivESagWGSF7Y",
  authDomain: "focus-ai-1ab01.firebaseapp.com",
  projectId: "focus-ai-1ab01",
  storageBucket: "focus-ai-1ab01.appspot.com",
  messagingSenderId: "695436041646",
  appId: "1:695436041646:web:76e53d63a92e5308ac3c3f",
  measurementId: "G-B6QM5514GM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensure anonymous sign-in
let authPromise = null;
function ensureAuth() {
  if (!auth.currentUser) {
    if (!authPromise) {
      authPromise = signInAnonymously(auth).catch((error) => {
        console.error("Firebase auth error:", error);
        authPromise = null;
      });
    }
    return authPromise;
  }
  return Promise.resolve();
}

/**
 * Saves session data to Firebase Firestore using SDK with auth
 * @param {Object} sessionData - Session data object 
 * @returns {Promise<boolean>} - Success status
 */
export async function saveSessionToFirestore(sessionData) {
  try {
    await ensureAuth();
    const { url, domain, category, duration, timestamp } = sessionData;
    await addDoc(collection(db, "sessions"), {
      site: domain,
      category: category,
      duration: Math.round(duration),
      fullUrl: url,
      recordedAt: timestamp
    });
    console.log("📦 Firestore: Data saved via SDK.");
    return true;
  } catch (error) {
    console.error("❌ Firestore Error:", error);
    console.warn("⚠️ Falling back to local storage only");
    return false;
  }
}

/**
 * Get all sessions from Firestore with authentication
 * @returns {Promise<Array>} - List of sessions
 */
export async function getSessionsFromFirestore() {
  try {
    await ensureAuth();
    const sessionsRef = collection(db, "sessions");
    const q = query(sessionsRef, orderBy("recordedAt", "desc"), limit(100));
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        domain: data.site || '',
        category: data.category || 'Unknown',
        duration: Number(data.duration || 0),
        url: data.fullUrl || '',
        timestamp: data.recordedAt || ''
      };
    });
    return sessions;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

/**
 * Test Firebase connectivity
 * @returns {Promise<boolean>} - Connection status
 */
export async function testFirebaseConnection() {
  try {
    await ensureAuth();
    // Try to read a small number of sessions
    const sessionsRef = collection(db, "sessions");
    const q = query(sessionsRef, limit(1));
    await getDocs(q);
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
}

export default {
  saveSessionToFirestore,
  getSessionsFromFirestore,
  testFirebaseConnection
};
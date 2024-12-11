// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "kdesom.firebaseapp.com",
    projectId: "kdesom",
    storageBucket: "kdesom.appspot.com",
    messagingSenderId: "397938242577",
    appId: "1:397938242577:web:e5f8f304f27f0a27d66db0",
    measurementId: "G-4K6STDF11E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, db};
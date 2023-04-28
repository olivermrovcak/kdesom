// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBNx2xmU-vyFO1PQx10qlwnZuBttg8Bt5Q",
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
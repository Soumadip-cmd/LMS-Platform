// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR1qXl-llbHvy3qRuo_ZeyVP2v0mDCT8Y",
  authDomain: "preplings.firebaseapp.com",
  projectId: "preplings",
  storageBucket: "preplings.firebasestorage.app",
  messagingSenderId: "805549676352",
  appId: "1:805549676352:web:89037f7757216cfd5e0ca5",
  measurementId: "G-T7L8NTB0QF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
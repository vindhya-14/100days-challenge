// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiZrXgqvlsmLpDzRkqQGEL5OjJ7QjtPLk",
  authDomain: "expense-tracker-5fd64.firebaseapp.com",
  projectId: "expense-tracker-5fd64",
  storageBucket: "expense-tracker-5fd64.firebasestorage.app",
  messagingSenderId: "512543105752",
  appId: "1:512543105752:web:8710b8bb8f26048c22edad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
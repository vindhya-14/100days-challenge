// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAWO3J7HTCXqyRKct8iVbU5_YXpkqYA2g",
  authDomain: "authentication-sample-4bdce.firebaseapp.com",
  projectId: "authentication-sample-4bdce",
 storageBucket: "authentication-sample-4bdce.appspot.com",

  messagingSenderId: "1033599157615",
  appId: "1:1033599157615:web:2b6619e0977f51d3f5d49a",
  measurementId: "G-KT677VMJ4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
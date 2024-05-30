// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "facerook-gasteac.firebaseapp.com",
  projectId: "facerook-gasteac",
  storageBucket: "facerook-gasteac.appspot.com",
  messagingSenderId: "333118237893",
  appId: "1:333118237893:web:7db225a40215088b88d4ac",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
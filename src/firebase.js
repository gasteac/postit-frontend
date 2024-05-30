// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "postit-cf654.firebaseapp.com",
  projectId: "postit-cf654",
  storageBucket: "postit-cf654.appspot.com",
  messagingSenderId: "306043314871",
  appId: "1:306043314871:web:8b64d0f24580ae22952332"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
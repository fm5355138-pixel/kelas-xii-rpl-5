// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAqNiTW1OylOW7uzpy2Clgoyvm1-GA9_Qw",
  authDomain: "chatanonim-e90d9.firebaseapp.com",
  projectId: "chatanonim-e90d9",
  storageBucket: "chatanonim-e90d9.firebasestorage.app",
  messagingSenderId: "167690987006",
  appId: "1:167690987006:web:e1cb9e2d10bd24d2d1ccaf",
  measurementId: "G-F84N6153X5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
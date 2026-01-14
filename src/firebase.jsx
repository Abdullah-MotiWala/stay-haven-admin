
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDjqnFuKOI2wtIx5NyNzY3PiO_3i0tFXzE",
    authDomain: "lmschat-e4a46.firebaseapp.com",
    projectId: "lmschat-e4a46",
    storageBucket: "lmschat-e4a46.appspot.com",
    messagingSenderId: "1097382158983",
    appId: "1:1097382158983:web:7ae240ac966387e6eb4e22",
    measurementId: "G-H5882V3SQ5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
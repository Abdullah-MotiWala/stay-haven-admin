
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

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
const app = firebase.initializeApp(firebaseConfig);
export { app };
export const auth = firebase.auth();
export const storage = firebase.storage();
export const db = firebase.firestore();

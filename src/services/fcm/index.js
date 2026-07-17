import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { app } from "../../firebase";

const messaging = firebase.messaging(app);

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      console.log("Notification permission granted.");
      
      // Get FCM token
      const token = await messaging.getToken({
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });
      
      if (token) {
        console.log("FCM Token:", token);
        // Send this token to your backend to store it
        return token;
      } else {
        console.log("No registration token available.");
        return null;
      }
    } else {
      console.log("Notification permission denied.");
      return null;
    }
  } catch (err) {
    console.error("Error getting notification permission:", err);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      console.log("Message received in foreground:", payload);
      resolve(payload);
    });
  });

// Initialize FCM
export const initializeFCM = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("Service Worker registered:", registration);
      
      // Request permission and get token
      const token = await requestNotificationPermission();
      return token;
    } catch (err) {
      console.error("Service Worker registration failed:", err);
      return null;
    }
  } else {
    console.log("Service Worker not supported");
    return null;
  }
};

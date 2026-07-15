// Firebase Cloud Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDjqnFuKOI2wtIx5NyNzY3PiO_3i0tFXzE",
  authDomain: "lmschat-e4a46.firebaseapp.com",
  projectId: "lmschat-e4a46",
  storageBucket: "lmschat-e4a46.appspot.com",
  messagingSenderId: "1097382158983",
  appId: "1:1097382158983:web:7ae240ac966387e6eb4e22",
  measurementId: "G-H5882V3SQ5"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/logo192.png",
    badge: "/logo192.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  // Navigate to notifications page
  event.waitUntil(
    clients.openWindow("/admin/notifications")
  );
});

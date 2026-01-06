/* eslint-disable no-undef */
// Firebase Cloud Messaging service worker for background notifications

// Using Firebase v11 compat version for service worker
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

console.log("🔥 Firebase Service Worker: Starting initialization...");

// IMPORTANT:
// These values should match the ones in your .env.local (they are public keys).
const firebaseConfig = {
  apiKey: "AIzaSyC5OtHXheZvdbuhBDcU-nVDLEBdbs2Tpgc",
  authDomain: "yoga-with-jen.firebaseapp.com",
  projectId: "yoga-with-jen",
  storageBucket: "yoga-with-jen.firebasestorage.app",
  messagingSenderId: "27191627723",
  appId: "1:27191627723:web:607ba72f0f71764e52304e",
  measurementId: "G-KK6GXJYS4F",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log("✅ Firebase Service Worker: Firebase initialized");

// Get messaging instance
const messaging = firebase.messaging();
console.log("✅ Firebase Service Worker: Messaging instance created");

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("📨 Firebase Service Worker: Background message received", payload);
  console.log("📨 Message details:", {
    messageId: payload.messageId,
    from: payload.from,
    collapseKey: payload.collapseKey,
    notification: payload.notification,
    data: payload.data,
  });
  
  const notificationTitle = payload.notification?.title || payload.data?.title || "New notification";
  const notificationBody = payload.notification?.body || payload.data?.body || "";
  const notificationIcon = payload.notification?.icon || "/assests/logo.png";
  
  // Include messageId and other data for click handling
  const notificationData = {
    ...(payload.data || {}),
    messageId: payload.messageId,
    from: payload.from,
    collapseKey: payload.collapseKey,
    // Add URL if provided in data, otherwise default to app root
    url: payload.data?.url || payload.fcmOptions?.link || "/",
  };
  
  const notificationOptions = {
    body: notificationBody,
    icon: notificationIcon,
    badge: "/assests/logo.png",
    image: payload.notification?.image,
    data: notificationData,
    tag: payload.data?.tag || payload.collapseKey || "notification",
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    actions: payload.data?.actions || [],
    timestamp: Date.now(),
  };

  console.log("🔔 Firebase Service Worker: Showing notification", {
    title: notificationTitle,
    body: notificationBody,
    data: notificationData,
  });

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("👆 Firebase Service Worker: Notification clicked", event);
  console.log("👆 Notification data:", event.notification.data);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  // Handle click action - try to focus existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      
      // If no matching window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log("✅ Firebase Service Worker: Setup complete");



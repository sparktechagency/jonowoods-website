import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration is read from environment variables.
// Make sure to define these in your .env.local file:
// NEXT_PUBLIC_FIREBASE_API_KEY=...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
// NEXT_PUBLIC_FIREBASE_APP_ID=...
// NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app (client-side safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Messaging
let messaging = null;

const initializeMessaging = async () => {
  if (typeof window !== "undefined") {
    // Check if Service Worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn("FCM: Service Worker not supported in this browser.");
      return null;
    }

    try {
      const m = getMessaging(app);
      console.log("FCM: Messaging initialized successfully");
      return m;
    } catch (error) {
      console.error("FCM: Messaging failed to initialize:", error);
      return null;
    }
  }
  return null;
};

// Initialize logs immediately
if (typeof window !== "undefined") {
  initializeMessaging().then(m => { messaging = m; });
}

export const requestForToken = async () => {
  if (typeof window === "undefined") return null;

  // Re-check messaging if it wasn't ready
  if (!messaging) {
    messaging = await initializeMessaging();
    if (!messaging) {
      console.error("FCM: Messaging instance is missing.");
      return null;
    }
  }

  try {
    console.log("FCM: Requesting permission...");
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("FCM: Notification permission denied.");
      return null;
    }

    console.log("FCM: Registering Service Worker...");
    // Explicitly register the service worker
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Wait for the service worker to be ready
    console.log("FCM: Waiting for Service Worker to be ready...");
    const registration = await navigator.serviceWorker.ready;
    console.log("FCM: Service Worker ready:", registration.scope);

    console.log("FCM: Getting token...");
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log("FCM: Token retrieved successfully");
      return currentToken;
    } else {
      console.log('FCM: No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('FCM: Error retrieving token:', err);
    return null;
  }
};

export { app, messaging };

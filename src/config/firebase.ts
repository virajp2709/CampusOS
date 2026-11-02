import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const rawProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Detect whether valid production Firebase credentials have been configured in .env
export const isFirebaseConfigured = Boolean(
  rawApiKey &&
  typeof rawApiKey === 'string' &&
  rawApiKey.trim() !== '' &&
  !rawApiKey.includes('YOUR_') &&
  rawProjectId &&
  typeof rawProjectId === 'string' &&
  rawProjectId.trim() !== ''
);

// Fallback configuration ensures Firebase SDK never throws invalid-api-key at startup
const firebaseConfig = {
  apiKey: isFirebaseConfigured ? rawApiKey : 'AIzaSyFakeKeyForCampusOSDevelopmentMode000000',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'campusos-dev.firebaseapp.com',
  projectId: isFirebaseConfigured ? rawProjectId : 'campusos-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'campusos-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Enable offline persistence only in browser when live Firebase is configured
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not available in this browser');
      }
    });
  } catch (e) {
    console.warn('Firestore persistence already enabled or skipped');
  }
}

export default app;

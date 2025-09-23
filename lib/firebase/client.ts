import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics (only in production and if supported)
export const analytics = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
  ? isSupported().then(supported => supported ? getAnalytics(app) : null)
  : null;

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const isEmulatorConnected = sessionStorage.getItem('firebase-emulator-connected');
  
  if (!isEmulatorConnected) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      connectFunctionsEmulator(functions, 'localhost', 5001);
      sessionStorage.setItem('firebase-emulator-connected', 'true');
    } catch (error) {
      console.log('Emulators may already be connected or not running');
    }
  }
}

export default app;
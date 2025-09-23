import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './client';

const googleProvider = new GoogleAuthProvider();

export interface BusinessUser {
  uid: string;
  email: string;
  businessName: string;
  contactName: string;
  phone: string;
  website?: string;
  businessType: string;
  expectedVolume?: string;
  createdAt: any;
  updatedAt: any;
  subscriptionStatus?: 'trial' | 'active' | 'cancelled' | 'past_due';
  apiKeys?: {
    live?: string;
    test?: string;
  };
}

/**
 * Create a new business account
 */
export async function createBusinessAccount(data: {
  email: string;
  password: string;
  businessName: string;
  contactName: string;
  phone: string;
  website?: string;
  businessType: string;
  expectedVolume?: string;
}) {
  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: data.contactName
    });
    
    // Create Firestore document for business
    const businessData: Omit<BusinessUser, 'uid'> = {
      email: data.email,
      businessName: data.businessName,
      contactName: data.contactName,
      phone: data.phone,
      website: data.website,
      businessType: data.businessType,
      expectedVolume: data.expectedVolume,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      subscriptionStatus: 'trial',
      apiKeys: {
        test: generateApiKey('test'),
        live: generateApiKey('live')
      }
    };
    
    await setDoc(doc(db, 'businesses', user.uid), businessData);
    
    // Create initial settings
    await setDoc(doc(db, 'settings', user.uid), {
      roundupEnabled: false,
      webhookUrl: null,
      emailNotifications: true,
      createdAt: serverTimestamp()
    });
    
    return { user, businessData };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
}

/**
 * Sign in business account
 */
export async function signInBusiness(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const businessDoc = await getDoc(doc(db, 'businesses', userCredential.user.uid));
    
    if (!businessDoc.exists()) {
      throw new Error('Business account not found');
    }
    
    // Update last login
    await updateDoc(doc(db, 'businesses', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });
    
    return {
      user: userCredential.user,
      businessData: businessDoc.data() as BusinessUser
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if business account exists
    const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
    
    if (!businessDoc.exists()) {
      // Create a basic business profile
      const businessData = {
        email: user.email!,
        businessName: '',
        contactName: user.displayName || '',
        phone: '',
        businessType: 'other',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        subscriptionStatus: 'trial',
        apiKeys: {
          test: generateApiKey('test'),
          live: generateApiKey('live')
        }
      };
      
      await setDoc(doc(db, 'businesses', user.uid), businessData);
      return { user, businessData, isNewUser: true };
    }
    
    return {
      user,
      businessData: businessDoc.data() as BusinessUser,
      isNewUser: false
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset email');
  }
}

/**
 * Get current business data
 */
export async function getCurrentBusiness(user: User): Promise<BusinessUser | null> {
  try {
    const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
    
    if (!businessDoc.exists()) {
      return null;
    }
    
    return {
      uid: user.uid,
      ...businessDoc.data()
    } as BusinessUser;
  } catch (error) {
    console.error('Error fetching business data:', error);
    return null;
  }
}

/**
 * Update business profile
 */
export async function updateBusinessProfile(
  uid: string,
  updates: Partial<BusinessUser>
) {
  try {
    await updateDoc(doc(db, 'businesses', uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Generate API key
 */
function generateApiKey(type: 'test' | 'live'): string {
  const prefix = type === 'test' ? 'test_' : 'live_';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = prefix;
  
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return key;
}

export { auth };
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from './config';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  authProvider: 'email' | 'google' | 'otp';
}

const actionCodeSettings = {
  url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify`,
  handleCodeInApp: true,
};

// Helper function to wait for network
async function waitForNetwork(maxRetries = 3, delayMs = 1000): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    if (navigator.onLine) {
      // Wait a bit for Firestore to connect
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return false;
}

export async function createOrUpdateUser(
  firebaseUser: FirebaseUser,
  authProvider: 'email' | 'google' | 'otp'
): Promise<User> {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  // Wait for network to be ready
  await waitForNetwork();

  const userRef = doc(db, 'users', firebaseUser.uid);
  
  // Retry logic for Firestore operations
  let retries = 3;
  let lastError: Error | null = null;

  while (retries > 0) {
    try {
      const userSnap = await getDoc(userRef);
      const now = serverTimestamp();

      if (!userSnap.exists()) {
        const newUser: Omit<User, 'createdAt' | 'updatedAt' | 'lastLoginAt'> & {
          createdAt: any;
          updatedAt: any;
          lastLoginAt: any;
        } = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          role: 'user',
          authProvider,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now,
        };

        await setDoc(userRef, newUser);

        return {
          ...newUser,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
        };
      } else {
        await setDoc(
          userRef,
          {
            lastLoginAt: now,
            updatedAt: now,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          },
          { merge: true }
        );

        return userSnap.data() as User;
      }
    } catch (error: any) {
      console.error(`Firestore operation failed (${retries} retries left):`, error);
      lastError = error;
      retries--;
      
      if (retries > 0) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, (4 - retries) * 1000));
      }
    }
  }

  // If all retries failed, throw the last error
  throw lastError || new Error('Failed to create/update user after multiple retries');
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    if (!auth) {
      return { success: false, error: 'Authentication is not initialized' };
    }
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = await createOrUpdateUser(userCredential.user, 'email');
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    if (!auth) {
      return { success: false, error: 'Authentication is not initialized' };
    }
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = await createOrUpdateUser(userCredential.user, 'email');
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    if (!auth) {
      return { success: false, error: 'Authentication is not initialized' };
    }
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('Starting Google sign-in...');
    const userCredential = await signInWithPopup(auth, provider);
    
    console.log('Google sign-in successful, creating/updating user profile...');
    const user = await createOrUpdateUser(userCredential.user, 'google');
    
    console.log('User profile created/updated successfully');
    return { success: true, user };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-blocked') {
      return { success: false, error: 'Popup was blocked. Please allow popups for this site.' };
    } else if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in was cancelled' };
    } else if (error.code === 'auth/network-request-failed') {
      return { success: false, error: 'Network error. Please check your internet connection.' };
    }
    
    return { success: false, error: error.message || 'Google sign-in failed' };
  }
}

export async function sendOTPEmail(email: string) {
  try {
    if (!auth) {
      return { success: false, error: 'Authentication is not initialized' };
    }
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('emailForSignIn', email);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithOTP(email: string, emailLink: string) {
  try {
    if (!auth) {
      return { success: false, error: 'Authentication is not initialized' };
    }
    
    if (!isSignInWithEmailLink(auth, emailLink)) {
      return { success: false, error: 'Invalid sign-in link' };
    }

    const userCredential = await signInWithEmailLink(auth, email, emailLink);
    const user = await createOrUpdateUser(userCredential.user, 'otp');

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('emailForSignIn');
    }

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    if (!auth) {
      return { success: false, error: 'Authentication is not initialized' };
    }
    
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    if (!db) {
      console.error('Firestore is not initialized');
      return null;
    }
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is complete
const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain;

let app;
let db: any;
let auth: any;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Failed to initialize Firebase, falling back to mock mode:", error);
    db = null;
    auth = null;
  }
} else {
  console.warn("Firebase configuration is incomplete. Running in Mock Offline Mode.");
}

// Custom interfaces for our storage/auth logic
export interface FirebaseSession {
  id?: string;
  userId: string;
  userEmail: string;
  structuredState: any;
  transcript: Array<{ sender: string; text: string; timestamp: number }>;
  timestamp: any;
}

// Fallback Mock Implementations
const mockAuth = {
  currentUser: null as any,
  onAuthStateChanged: (callback: (user: any) => void) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('skillpivot_mock_user');
      const userObj = stored ? JSON.parse(stored) : null;
      mockAuth.currentUser = userObj;
      callback(userObj);
      
      // Setup a window listener to notify on local storage change
      const handleStorage = () => {
        const updated = localStorage.getItem('skillpivot_mock_user');
        callback(updated ? JSON.parse(updated) : null);
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
    callback(null);
    return () => {};
  },
  signIn: async (email: string) => {
    const user = { uid: 'mock-user-123', email };
    localStorage.setItem('skillpivot_mock_user', JSON.stringify(user));
    mockAuth.currentUser = user;
    return user;
  },
  signOut: async () => {
    localStorage.removeItem('skillpivot_mock_user');
    mockAuth.currentUser = null;
  }
};

const mockFirestore = {
  addSession: async (session: FirebaseSession) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('skillpivot_sessions');
      const sessions = stored ? JSON.parse(stored) : [];
      const newSession = {
        ...session,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString()
      };
      sessions.unshift(newSession);
      localStorage.setItem('skillpivot_sessions', JSON.stringify(sessions));
      return newSession;
    }
    return session;
  },
  getSessions: async (userId: string): Promise<FirebaseSession[]> => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('skillpivot_sessions');
      const sessions = stored ? JSON.parse(stored) : [];
      return sessions.filter((s: any) => s.userId === userId);
    }
    return [];
  }
};

// Unified Exported API
export const getActiveDb = () => db;
export const getActiveAuth = () => auth;
export const isRealFirebase = () => !!(db && auth);

export async function saveConversationSession(session: Omit<FirebaseSession, 'timestamp'>) {
  if (isRealFirebase()) {
    try {
      const docRef = await addDoc(collection(db, 'sessions'), {
        ...session,
        timestamp: new Date()
      });
      return { id: docRef.id, ...session, timestamp: new Date().toISOString() };
    } catch (e) {
      console.error("Firestore save failed, saving to local mock storage as backup:", e);
      return await mockFirestore.addSession(session as any);
    }
  } else {
    return await mockFirestore.addSession(session as any);
  }
}

export async function loadConversationSessions(userId: string): Promise<FirebaseSession[]> {
  if (isRealFirebase()) {
    try {
      const q = query(
        collection(db, 'sessions'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const list: FirebaseSession[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          structuredState: data.structuredState,
          transcript: data.transcript,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp
        });
      });
      // Filter client side as backup / simplicity
      return list.filter(s => s.userId === userId);
    } catch (e) {
      console.error("Firestore read failed, loading from local mock storage:", e);
      return await mockFirestore.getSessions(userId);
    }
  } else {
    return await mockFirestore.getSessions(userId);
  }
}

export const authActions = {
  getCurrentUser: () => {
    if (isRealFirebase()) {
      return auth.currentUser;
    }
    return mockAuth.currentUser;
  },
  onAuthChange: (callback: (user: any) => void) => {
    if (isRealFirebase()) {
      return onAuthStateChanged(auth, callback);
    }
    return mockAuth.onAuthStateChanged(callback);
  },
  loginGuest: async (email: string = "guest@skillpivot.ai") => {
    if (isRealFirebase()) {
      // In production, we'll try guest sign-in. If it fails, sign up.
      try {
        const credential = await signInWithEmailAndPassword(auth, email, "GuestPass123!");
        return credential.user;
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          const credential = await createUserWithEmailAndPassword(auth, email, "GuestPass123!");
          return credential.user;
        }
        throw error;
      }
    } else {
      return await mockAuth.signIn(email);
    }
  },
  signOutUser: async () => {
    if (isRealFirebase()) {
      await signOut(auth);
    } else {
      await mockAuth.signOut();
    }
  }
};

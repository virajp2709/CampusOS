import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/config/firebase';
import { DEFAULT_PROFILE } from '@/config/constants';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  hasProfile: boolean;
  isCloudConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  createInitialProfile: (data: Partial<UserProfile>) => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'campusos_active_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync profile from Firestore or local fallback
  const fetchProfile = useCallback(async (uid: string, email: string, displayName: string, photoURL: string | null) => {
    if (!isFirebaseConfigured) {
      const offlineProfile: UserProfile = {
        uid,
        email: email || 'student.ai5@vpkbiet.org',
        displayName: displayName || 'Viraj (AI & DS)',
        photoURL,
        college: DEFAULT_PROFILE.college,
        course: DEFAULT_PROFILE.course,
        branch: DEFAULT_PROFILE.branch,
        division: DEFAULT_PROFILE.division,
        academicYear: DEFAULT_PROFILE.academicYear,
        semester: DEFAULT_PROFILE.semester,
        rollNumber: DEFAULT_PROFILE.rollNumber,
        practicalBatch: DEFAULT_PROFILE.practicalBatch,
        attendanceTarget: DEFAULT_PROFILE.attendanceTarget,
        theme: 'dark',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(offlineProfile);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(offlineProfile));
      return;
    }

    try {
      const userRef = doc(db, 'users', uid, 'profile', 'info');
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUser(data);
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(data));
      } else {
        const initialProfile: UserProfile = {
          uid,
          email: email || '',
          displayName: displayName || 'Engineering Student',
          photoURL,
          college: DEFAULT_PROFILE.college,
          course: DEFAULT_PROFILE.course,
          branch: DEFAULT_PROFILE.branch,
          division: DEFAULT_PROFILE.division,
          academicYear: DEFAULT_PROFILE.academicYear,
          semester: DEFAULT_PROFILE.semester,
          rollNumber: DEFAULT_PROFILE.rollNumber,
          practicalBatch: DEFAULT_PROFILE.practicalBatch,
          attendanceTarget: DEFAULT_PROFILE.attendanceTarget,
          theme: 'dark',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUser(initialProfile);
        try {
          await setDoc(userRef, initialProfile);
        } catch (e) {
          console.warn('Could not write initial profile to Firestore immediately:', e);
        }
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(initialProfile));
      }
    } catch (err) {
      console.warn('Firestore fetch failed, using local profile fallback:', err);
    }
  }, []);

  useEffect(() => {
    // If running in offline / local mode without live Firebase
    if (!isFirebaseConfigured) {
      const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
      setLoading(false);
      return;
    }

    // Live Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fUser) => {
        setFirebaseUser(fUser);
        if (fUser) {
          await fetchProfile(fUser.uid, fUser.email || '', fUser.displayName || '', fUser.photoURL || null);
        } else {
          const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (!stored) {
            setUser(null);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firebase onAuthStateChanged error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      // In local mode without Firebase API keys, simulate Google sign in for convenience
      demoLogin();
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await fetchProfile(result.user.uid, result.user.email || '', result.user.displayName || '', result.user.photoURL || null);
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      // In offline / local mode, accept credentials and load profile
      const localProfile: UserProfile = {
        uid: `local_${Date.now()}`,
        email,
        displayName: email.split('@')[0] || 'Student',
        photoURL: null,
        college: DEFAULT_PROFILE.college,
        course: DEFAULT_PROFILE.course,
        branch: DEFAULT_PROFILE.branch,
        division: DEFAULT_PROFILE.division,
        academicYear: DEFAULT_PROFILE.academicYear,
        semester: DEFAULT_PROFILE.semester,
        rollNumber: DEFAULT_PROFILE.rollNumber,
        practicalBatch: DEFAULT_PROFILE.practicalBatch,
        attendanceTarget: DEFAULT_PROFILE.attendanceTarget,
        theme: 'dark',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(localProfile);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(localProfile));
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await fetchProfile(result.user.uid, result.user.email || '', result.user.displayName || '', result.user.photoURL || null);
    } catch (error) {
      console.error('Email Sign-in failed:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!isFirebaseConfigured) {
      const localProfile: UserProfile = {
        uid: `local_${Date.now()}`,
        email,
        displayName: name || 'Student',
        photoURL: null,
        college: DEFAULT_PROFILE.college,
        course: DEFAULT_PROFILE.course,
        branch: DEFAULT_PROFILE.branch,
        division: DEFAULT_PROFILE.division,
        academicYear: DEFAULT_PROFILE.academicYear,
        semester: DEFAULT_PROFILE.semester,
        rollNumber: DEFAULT_PROFILE.rollNumber,
        practicalBatch: DEFAULT_PROFILE.practicalBatch,
        attendanceTarget: DEFAULT_PROFILE.attendanceTarget,
        theme: 'dark',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(localProfile);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(localProfile));
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await fbUpdateProfile(result.user, { displayName: name });
      const initialProfile: UserProfile = {
        uid: result.user.uid,
        email,
        displayName: name,
        photoURL: null,
        college: DEFAULT_PROFILE.college,
        course: DEFAULT_PROFILE.course,
        branch: DEFAULT_PROFILE.branch,
        division: DEFAULT_PROFILE.division,
        academicYear: DEFAULT_PROFILE.academicYear,
        semester: DEFAULT_PROFILE.semester,
        rollNumber: DEFAULT_PROFILE.rollNumber,
        practicalBatch: DEFAULT_PROFILE.practicalBatch,
        attendanceTarget: DEFAULT_PROFILE.attendanceTarget,
        theme: 'dark',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      try {
        await setDoc(doc(db, 'users', result.user.uid, 'profile', 'info'), initialProfile);
      } catch (err) {
        console.warn('Could not save to Firestore immediately:', err);
      }
      setUser(initialProfile);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(initialProfile));
    } catch (error) {
      console.error('Sign-up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      if (isFirebaseConfigured) {
        await fbSignOut(auth);
      }
    } catch (e) {
      console.warn('Firebase signout skipped:', e);
    }
    setUser(null);
    setFirebaseUser(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updatedAt: new Date() };
    setUser(updated);
    try {
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updated));
      if (isFirebaseConfigured && firebaseUser) {
        await updateDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'info'), data);
      }
    } catch (err) {
      console.warn('Firestore update failed, kept in local state:', err);
    }
  };

  const createInitialProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateUserProfile(data);
  };

  const demoLogin = () => {
    const demoProfile: UserProfile = {
      uid: 'student_viraj_26107337',
      email: 'student.ai5@vpkbiet.org',
      displayName: 'Viraj (AI & DS)',
      photoURL: null,
      college: DEFAULT_PROFILE.college,
      course: DEFAULT_PROFILE.course,
      branch: DEFAULT_PROFILE.branch,
      division: DEFAULT_PROFILE.division,
      academicYear: DEFAULT_PROFILE.academicYear,
      semester: DEFAULT_PROFILE.semester,
      rollNumber: DEFAULT_PROFILE.rollNumber,
      practicalBatch: DEFAULT_PROFILE.practicalBatch,
      attendanceTarget: DEFAULT_PROFILE.attendanceTarget,
      theme: 'dark',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUser(demoProfile);
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        hasProfile: !!user,
        isCloudConnected: isFirebaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateUserProfile,
        createInitialProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

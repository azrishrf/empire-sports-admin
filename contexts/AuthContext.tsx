"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { CreateUserProfileData, UserService } from "@/lib/userService";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  UserCredential,
} from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  checkingAdminStatus: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, additionalData: CreateUserProfileData) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        setCheckingAdminStatus(true);
        try {
          const adminStatus = await UserService.isUserAdmin(user.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setCheckingAdminStatus(false);
        }
      } else {
        setIsAdmin(false);
        setCheckingAdminStatus(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    const result = await signInWithPopup(auth, googleProvider);

    // Create user profile in Firestore if it's a new user
    if (result.user) {
      await UserService.createGoogleUserProfile(result.user);
    }

    return result;
  };

  const signUp = async (
    email: string,
    password: string,
    additionalData: CreateUserProfileData,
  ): Promise<UserCredential> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Create user profile in Firestore with additional data
    if (result.user) {
      // Create user profile in Firestore
      await UserService.createUserProfile(result.user, additionalData);

      // Trigger a re-render to update the user object
      setUser({ ...result.user });
    }

    return result;
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const value = {
    user,
    loading,
    isAdmin,
    checkingAdminStatus,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

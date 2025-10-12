"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

import { auth } from "@/lib/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Watch for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;
    const isLoginPage = pathname === "/login";

    if (!user && !isLoginPage) {
      router.replace("/login");
    } else if (user && isLoginPage) {
      router.replace("/");
    }
  }, [user, loading]);

  const handleEmailSignIn = async () => {
    try {
      const UserCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(UserCredentials.user);
      router.replace("/");
      return UserCredentials.user;
    } catch (err) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const handleEmailSignUp = async () => {
    try {
      const UserCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(UserCredentials.user);
      router.replace("/");
      return UserCredentials.user;
    } catch (err) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await setPersistence(
        auth,
        browserLocalPersistence,
        browserPopupRedirectResolver
      );
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        handleEmailSignIn,
        handleEmailSignUp,
        handleGoogleSignIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

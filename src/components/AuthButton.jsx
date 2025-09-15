"use client";

import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AuthButton() {
  const [user] = useAuthState(auth);

  async function handleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in error:", err);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }

  return (
    <button
      onClick={user ? handleSignOut : handleSignIn}
      className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700'
    >
      {user ? "Sign Out" : "Sign In"}
    </button>
  );
}

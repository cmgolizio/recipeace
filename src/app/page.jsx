"use client";

import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import CategoryButton from "@/components/CategoryButton";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Error signing in: " + err.message);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("Error with Google login: " + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert("Error signing out: " + err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#161611] p-6'>
      <h1 className='text-3xl font-bold mb-6'>ReciPeace</h1>

      {!user ? (
        <div className='w-full max-w-sm bg-[#161611] p-6 rounded-lg shadow'>
          {/* Email login/signup */}
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className='w-full border rounded p-2 mb-3'
          />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            className='w-full border rounded p-2 mb-3'
          />

          <div className='flex gap-2'>
            <button
              onClick={handleEmailSignIn}
              className='flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700'
            >
              Login
            </button>
            <button
              onClick={handleEmailSignUp}
              className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
            >
              Sign Up
            </button>
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleSignIn}
            className='w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600'
          >
            Continue with Google
          </button>
        </div>
      ) : (
        <div className='min-w-full h-full flex flex-row justify-center items-center text-center gap-8'>
          <CategoryButton category='Food' />
          <CategoryButton category='Drink' />
          {/* <p className='mb-4'>Logged in as {user.email || user.displayName}</p>
          <button
            onClick={handleSignOut}
            className='bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800'
          >
            Sign Out
          </button> */}
        </div>
      )}
    </div>
  );
}

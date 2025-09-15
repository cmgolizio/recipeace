"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

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

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-gray-600'>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6'>
      <h1 className='text-3xl font-bold mb-6'>Sign In / Sign Up</h1>

      <div className='w-full max-w-sm bg-white p-6 rounded-lg shadow'>
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

        <button
          onClick={handleGoogleSignIn}
          className='w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600'
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

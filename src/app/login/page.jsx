"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loading, handleEmailSignIn, handleEmailSignUp, handleGoogleSignIn } =
    useAuth();

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-gray-600'>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className='absolute top-1/4 left-3/8 flex flex-col items-center justify-center text-center p-6'>
      <form className='w-full max-w-sm p-6 rounded-lg'>
        <h1 className='text-3xl font-bold mb-6'>
          {/* <h1 className='text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200'> */}
          Sign In / Sign Up
        </h1>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='w-full border rounded p-2 mb-3'
          // className='w-full border rounded p-2 mb-3 bg-gray-800 text-gray-200 dark:bg-gray-200 dark:text-gray-800'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='w-full border rounded p-2 mb-3'
        />
        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <div className='flex gap-2'>
          <button
            onClick={() => handleEmailSignIn(email, password)}
            className='flex-1 bg-blue-400 text-gray-800 py-2 rounded hover:bg-blue-300 active:bg-blue-500'
          >
            Login
          </button>
          <button
            onClick={() => handleEmailSignUp(email, password)}
            className='flex-1 bg-teal-300 text-gray-800 py-2 rounded hover:bg-teal-200 active:bg-teal-400'
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className='min-w-full mt-2 bg-orange-500 text-gray-800 py-2 rounded hover:bg-orange-400 active:bg-orange-600'
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}

"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // redirect to /login if not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-gray-600'>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return null; // prevent flashing food content before redirect
  }

  return children;
}

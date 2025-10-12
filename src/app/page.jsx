"use client";

import { useAuth } from "@/contexts/AuthContext";
import CategoryButton from "@/components/CategoryButton";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6'>
      {user && (
        <div className='min-w-full h-full flex flex-row justify-center items-center text-center gap-8'>
          <CategoryButton category='Food' />
          <CategoryButton category='Drink' />
        </div>
      )}
    </div>
  );
}

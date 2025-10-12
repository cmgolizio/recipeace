"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <html lang='en'>
        <body className='bg-[#f8f8ff] dark:bg-[#161611] dark:text-[#f8f8ff] text-[#161611] min-h-screen flex flex-col'>
          <AuthProvider>
            <Navbar />
            <main className='flex-1 p-4'>
              {/* <AuthProvider>{children}</AuthProvider> */}
              {children}
            </main>
          </AuthProvider>
          <footer className='bg-[#242423] shadow p-4 text-center text-gray-500'>
            &copy; 2025 ReciPeace
          </footer>
        </body>
      </html>
    </ThemeProvider>
  );
}

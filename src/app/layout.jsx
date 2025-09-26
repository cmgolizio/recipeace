"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <html lang='en'>
        <body className='bg-[#161611] min-h-screen flex flex-col'>
          <Navbar />
          <main className='flex-1 p-4'>{children}</main>
          {/* Footer */}
          <footer className='bg-[#242423] shadow p-4 text-center text-gray-500'>
            &copy; 2025 ReciPeace
          </footer>
        </body>
      </html>
    </ThemeProvider>
  );
}

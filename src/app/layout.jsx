"use client";

import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <ThemeProvider>
      <html lang='en'>
        <body className='bg-(#161611) min-h-screen flex flex-col'>
          {/* Navbar */}
          <header className='bg-(#0b0b0a) shadow p-4 flex justify-between items-center'>
            <h1 className='text-xl font-bold'>ReciPeace</h1>
            <ThemeToggle />
            {pathname !== "/login" && <AuthButton />}
          </header>

          {/* Main content */}
          <main className='flex-1 p-4'>{children}</main>

          {/* Footer */}
          <footer className='bg-(#242423) shadow p-4 text-center text-gray-500'>
            &copy; {new Date().getFullYear()} ReciPeace
          </footer>
        </body>
      </html>
    </ThemeProvider>
  );
}

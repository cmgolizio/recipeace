"use client";

// import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegSun } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import { FaRegMoon } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full transition'
      aria-label='Toggle Theme'
    >
      <AnimatePresence mode='wait' initial={false}>
        {theme === "light" ? (
          <motion.div
            key='moon'
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaMoon
              className='w-6 h-6 hover:w-7 hover:h-7'
              style={{ color: "#161611" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key='sun'
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaSun
              className='w-6 h-6 hover:w-7 hover:h-7'
              style={{ color: "#f2f2f2" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

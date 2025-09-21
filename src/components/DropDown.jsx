"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import Link from "next/link";

export default function Dropdown({ label, items, isOpen, onToggle }) {
  return (
    <div className='relative inline-block text-left'>
      <button
        onClick={() => onToggle(label.toLowerCase())}
        className='inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:dark:text-gray-100 hover:text-gray-900'
      >
        {label}
        <HiChevronDown
          className={`ml-1 h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          // <div className='absolute mt-2 w-40 bg-white shadow-lg border rounded-md'>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className='absolute mt-2 w-40 bg-gray-100 dark:bg-gray-700 shadow-lg border dark:border-gray-600 rounded-md z-50'
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 bg-gray-200 dark:bg-gray-700'
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

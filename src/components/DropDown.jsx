"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import Link from "next/link";
import { ImHeart } from "react-icons/im";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaGlassMartini } from "react-icons/fa";
import { PiMartiniFill } from "react-icons/pi";

export default function Dropdown({ label, items, isOpen, onToggle, closeAll }) {
  const ref = useRef();
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAll]);

  useEffect(() => {
    if (hovering && !isOpen) {
      onToggle(); // open if hover starts
    } else if (!hovering && isOpen) {
      closeAll(); // close if hover ends
    }
  }, [hovering, isOpen, onToggle, closeAll]);

  return (
    <div
      className='relative inline-block text-left'
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        onClick={() => onToggle(label.toLowerCase())}
        // onMouseEnter={() => onToggle(label.toLowerCase())}
        className='inline-flex items-center px-3 py-2 text-md font-medium text-gray-700 dark:text-gray-300 hover:dark:text-gray-100 hover:text-gray-900'
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
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className='absolute mt-1 w-40 bg-gray-500 rounded-md z-50'
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='block px-4 py-4 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 bg-gray-200 dark:bg-gray-700'
                onClick={closeAll}
              >
                {item.label}
                {item.label === "Saved" ? (
                  <ImHeart className='inline ml-2' size={12} />
                ) : item.label === "Pantry" ? (
                  <PiForkKnifeFill className='inline ml-1.5' size={19} />
                ) : item.label === "Bar" ? (
                  <PiMartiniFill className='inline ml-1.5' size={17} />
                ) : null}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

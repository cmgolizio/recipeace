"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // const [theme, setTheme] = useState("light");

  // // On mount, check for stored theme or system preference
  // useEffect(() => {
  //   const storedTheme = localStorage.getItem("theme");
  //   if (storedTheme) {
  //     setTheme(storedTheme);
  //     document.documentElement.setAttribute("data-theme", storedTheme);
  //   } else {
  //     const prefersDark = window.matchMedia(
  //       "(prefers-color-scheme: dark)"
  //     ).matches;
  //     const initialTheme = prefersDark ? "dark" : "light";
  //     setTheme(initialTheme);
  //     document.documentElement.setAttribute("data-theme", initialTheme);
  //   }
  // }, []);

  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);
  //   document.documentElement.setAttribute("data-theme", newTheme);
  //   localStorage.setItem("theme", newTheme);
  // };

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'
      aria-label='Toggle Theme'
    >
      {theme === "light" ? (
        // Moon SVG for dark mode
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z'
          />
        </svg>
      ) : (
        // Sun SVG for light mode
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z'
          />
        </svg>
      )}
    </button>
  );
}

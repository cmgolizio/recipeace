"use client";
import { useState } from "react";
import Link from "next/link";

import Dropdown from "./DropDown";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav className='max-h-13 bg-gray-100 dark:bg-gray-600 border-b px-4 py-2 flex items-center justify-between'>
      {/* Left side (logo + menus) */}
      <div className='flex items-center space-x-6 bg-gray-100 dark:bg-gray-600'>
        <Link
          href='/'
          className='text-lg font-bold text-gray-800 dark:text-gray-100'
        >
          ReciPeace
        </Link>

        <Dropdown
          label='Food'
          items={[
            { label: "Pantry Items", href: "/dashboard" },
            { label: "Saved", href: "/favorites" },
          ]}
          isOpen={openMenu === "food"}
          onToggle={() => handleToggle("food")}
        />

        <Dropdown
          label='Drink'
          items={[
            { label: "Bar Inventory", href: "/drink" },
            { label: "Saved", href: "/bar-favorites" },
          ]}
          isOpen={openMenu === "drink"}
          onToggle={() => handleToggle("drink")}
        />
      </div>

      {/* Right side (auth + theme toggle) */}
      <div className='flex items-center space-x-4'>
        <ThemeToggle />
        <AuthButton />
      </div>
    </nav>
  );
}

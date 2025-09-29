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

  const closeAll = () => setOpenMenu(null);

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
            { label: "Pantry Items", href: "/food" },
            { label: "Saved", href: "/food/favorites" },
          ]}
          isOpen={openMenu === "food"}
          onToggle={() => handleToggle("food")}
          closeAll={closeAll}
        />

        <Dropdown
          label='Drink'
          items={[
            { label: "Bar Inventory", href: "/drink" },
            { label: "Saved", href: "/drink/favorites" },
          ]}
          isOpen={openMenu === "drink"}
          onToggle={() => handleToggle("drink")}
          closeAll={closeAll}
        />
      </div>

      {/* Right side (auth + theme toggle) */}
      <div className='flex flex-row items-center space-x-4'>
        <ThemeToggle />
        <AuthButton />
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";

const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/70 backdrop-blur-md" : "bg-transparent"} `}
    >
      <div className="container mx-auto p-4">
        <Link href="/" className="text-2xl font-bold">
          Mi Portfolio
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

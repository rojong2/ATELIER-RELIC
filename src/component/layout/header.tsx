"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? "bg-white text-[#5B3A1A]" : "bg-transparent text-white"
      }`}>
      <div className="px-12">
        <div className="flex h-[113px] items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="text-[25px] font-semibold tracking-[-0.02em]">
              ATELIER RELIC
            </div>

            <nav>
              <ul className="flex items-center gap-8 text-[12px] tracking-[0.08em]">
                <li className="cursor-pointer hover:opacity-70">MAGAZINE</li>
                <li className="cursor-pointer hover:opacity-70">SHOP</li>
                <li className="cursor-pointer hover:opacity-70">ABOUT</li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-8 text-[13px] tracking-[0.08em]">
            <span className="cursor-pointer hover:opacity-70">BAG</span>
            <span className="cursor-pointer hover:opacity-70">MY</span>
            <span className="cursor-pointer hover:opacity-70">JOIN</span>
            <span className="cursor-pointer hover:opacity-70">LOGIN</span>
          </div>
        </div>
      </div>

      <div
        className={`h-px w-full ${isScrolled ? "bg-[#D4D4D4]" : "bg-white/30"}`}
      />
    </header>
  );
}

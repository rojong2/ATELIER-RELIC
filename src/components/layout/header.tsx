"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isProductDetail = pathname.startsWith("/shop/") && pathname !== "/shop";

  useEffect(() => {
    if (isProductDetail) {
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProductDetail]);

  const isHome = pathname === "/";
  const useLightHeader = isHome && !isScrolled;

  const navLinkClass = (href: string) => {
    const isActive = pathname === href;
    return [
      "relative inline-block transition-opacity",
      isActive ? "opacity-100" : "opacity-80 hover:opacity-70",
      isActive ? "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-current after:content-['']" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <header
      className={`${isProductDetail ? "relative" : "fixed top-0 left-0"} z-50 w-full transition-colors duration-300 ${
        useLightHeader ? "bg-transparent text-white" : "bg-white text-[#5B3A1A]"
      }`}>
      <div className="px-12">
        <div className="flex h-[113px] items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-[25px] font-semibold">
              ATELIER RELIC
            </Link>

            <nav>
              <ul className="flex items-center gap-8 text-[12px]">
                <li>
                  <Link href="/magazine" className={navLinkClass("/magazine")}>
                    MAGAZINE
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className={navLinkClass("/shop")}>
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={navLinkClass("/about")}>
                    ABOUT
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-8 text-[13px]">
            <Link href="/bag" className="cursor-pointer hover:opacity-70">
              BAG
            </Link>
            <Link href="/my" className="cursor-pointer hover:opacity-70">
              MY
            </Link>
            <Link href="/join" className="cursor-pointer hover:opacity-70">
              JOIN
            </Link>
            <Link href="/login" className="cursor-pointer hover:opacity-70">
              LOGIN
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`h-px w-full ${
          useLightHeader ? "bg-white/30" : "bg-[#D4D4D4]"
        }`}
      />
    </header>
  );
}

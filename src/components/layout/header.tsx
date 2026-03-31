"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const NAV_ITEMS = [
  { href: "/magazine", label: "MAGAZINE" },
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
] as const;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.length;
  const isProductDetail = pathname.startsWith("/shop/") && pathname !== "/shop";
  const { fetchWishlist, setUserId, clearWishlist } = useWishlistStore();
  const { fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        setUserId(user.id);
        await Promise.all([fetchWishlist(user.id), fetchCart(user.id)]);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUserId(session.user.id);
        await Promise.all([
          fetchWishlist(session.user.id),
          fetchCart(session.user.id),
        ]);
      } else {
        clearWishlist();
        clearCart({ deleteFromDb: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchWishlist, fetchCart, setUserId, clearWishlist, clearCart]);

  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearWishlist();
    clearCart({ deleteFromDb: false });
    window.location.href = "/";
  };

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
      isActive
        ? "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-current after:content-['']"
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const mobileNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return [
      "block w-full px-4 py-3 text-left text-[12px] tracking-wide transition-opacity",
      isActive ? "opacity-100" : "opacity-80 hover:opacity-70",
      isActive
        ? "border-l-2 border-[#5B3A1A] pl-[14px]"
        : "border-l-2 border-transparent pl-[14px]",
    ].join(" ");
  };

  return (
    <header
      className={`${isProductDetail ? "relative" : "fixed top-0 left-0"} z-50 w-full transition-colors duration-300 ${
        useLightHeader ? "bg-transparent text-white" : "bg-white text-[#5B3A1A]"
      }`}>
      <div className="px-4 sm:px-8 md:px-12">
        <div className="flex h-16 items-center justify-between md:h-[113px]">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-10">
            <Link
              href="/"
              className="shrink-0 truncate text-[18px] font-semibold sm:text-[22px] md:text-[25px]">
              ATELIER RELIC
            </Link>

            <nav className="hidden md:block" aria-label="메인">
              <ul className="flex items-center gap-6 text-[12px] lg:gap-8">
                {NAV_ITEMS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={navLinkClass(href)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-[10px] sm:gap-4 sm:text-[12px] md:gap-8 md:text-[13px]">
            <Link
              href="/cart"
              className="relative cursor-pointer hover:opacity-70">
              BAG
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b9b0a2] text-[9px] text-white md:-right-4">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/my" className="cursor-pointer hover:opacity-70">
              MY
            </Link>
            {!isLoggedIn && (
              <Link href="/join" className="cursor-pointer hover:opacity-70">
                JOIN
              </Link>
            )}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer hover:opacity-70">
                LOGOUT
              </button>
            ) : (
              <Link href="/login" className="cursor-pointer hover:opacity-70">
                LOGIN
              </Link>
            )}

            <div ref={menuRef} className="relative md:hidden">
              <button
                type="button"
                id="mobile-menu-button"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-dropdown"
                onClick={() => setMenuOpen((open) => !open)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  useLightHeader
                    ? "border-white/40 text-white hover:bg-white/10"
                    : "border-[#D4D4D4] text-[#5B3A1A] hover:bg-[#faf9f7]"
                }`}>
                <span className="sr-only">
                  {menuOpen ? "메뉴 닫기" : "메뉴 열기"}
                </span>
                <span className="flex flex-col gap-[5px]" aria-hidden>
                  <span
                    className={`block h-px w-[18px] origin-center bg-current transition-transform ${
                      menuOpen ? "translate-y-[6px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block h-px w-[18px] bg-current transition-opacity ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-px w-[18px] origin-center bg-current transition-transform ${
                      menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>

              {menuOpen && (
                <nav
                  id="mobile-nav-dropdown"
                  role="menu"
                  aria-labelledby="mobile-menu-button"
                  className="absolute right-0 top-full z-[60] mt-2 min-w-[220px] rounded-sm border border-[#D4D4D4] bg-white py-2 text-[#5B3A1A] shadow-lg">
                  <ul className="flex flex-col">
                    {NAV_ITEMS.map(({ href, label }) => (
                      <li key={href} role="none">
                        <Link
                          href={href}
                          role="menuitem"
                          className={mobileNavLinkClass(href)}
                          onClick={() => setMenuOpen(false)}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
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

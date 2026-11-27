"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const MobileNavDrawer = lazy(() => import("./MobileNavDrawer"));
const preloadMobileDrawer = () => {
  void import("./MobileNavDrawer");
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Salary Tax", href: "/salary-tax-calculator" },
    { name: "Zakat", href: "/zakat-calculator" },
    { name: "Property Tax", href: "/property-tax-calculator" },
    { name: "GST", href: "/gst-calculator" },
    { name: "Fitrana", href: "/fitrana-calculator" },
    { name: "Ushr", href: "/ushr-calculator" },
  ];

  return (
    <>
      {/* =========================================================================
          TOP AMBIENT STATUS BAR (1-LINE CLIENT-SIDE PRIVACY & AUDIT TICKER)
          NOT STICKY: Scrolls out of view with the page naturally
         ========================================================================= */}
      <div className="print:hidden bg-gradient-to-r from-[#071B30] via-primary to-[#0A335C] text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-accent/25 shadow-xs">
        <div className="max-w-[1150px] w-full mx-auto flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="hidden md:inline-flex md:animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold text-slate-100 text-[11px] sm:text-xs leading-tight min-w-0">
              100% Client-Side Privacy: <span className="text-emerald-300 font-bold">Your numbers never leave your phone.</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-300 text-xs shrink-0 whitespace-nowrap">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Zero Server Storage
            </span>
            <span className="text-slate-500">•</span>
            <Link
              href="/methodology"
              prefetch={false}
              className="hover:text-emerald-300 transition-colors font-medium"
            >
              TY2027 Verified Rates →
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STICKY MAIN NAVIGATION BAR (GLASS EFFECT + TRANSLUCENT FROSTED BLUR)
          Sticky on scroll across all pages. Modals (z-50/z-60) open above it.
         ========================================================================= */}
      <header
        className={`sticky top-0 z-40 w-full print:hidden transition-shadow duration-200 border-b border-slate-200/80 py-2 sm:py-2.5 md:py-3 ${
          scrolled
            ? "bg-white/95 md:bg-white/85 md:backdrop-blur-md shadow-sm"
            : "bg-white/95 md:bg-white/80 md:backdrop-blur-md shadow-xs"
        }`}
      >
        <div className="max-w-[1150px] mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name (Compact on mobile, standard on desktop) */}
          <Link
            href="/"
            className="group flex items-center shrink-0 focus:outline-hidden py-0.5"
            aria-label="CalculationHub Homepage"
          >
            <img
              src="/images/CalculationHub_Logo_Full.webp"
              alt="CalculationHub"
              width={400}
              height={98}
              draggable={false}
              fetchPriority="high"
              decoding="async"
              className="h-8 sm:h-9 md:h-12 w-auto object-contain group-hover:opacity-95 transition-opacity duration-200"
            />
          </Link>

          {/* Desktop & Tablet Navigation Links (Clean, Attractive, Strictly 1 Line) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onPointerEnter={() => router.prefetch(link.href)}
                  onTouchStart={() => router.prefetch(link.href)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-xs font-bold"
                      : "text-slate-700 hover:text-primary hover:bg-slate-100/90"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu trigger button (Compact 40px+ tap target on mobile) */}
          <div className="flex md:hidden items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                preloadMobileDrawer();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              onPointerEnter={preloadMobileDrawer}
              onTouchStart={preloadMobileDrawer}
              className="p-1.5 sm:p-2 min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl bg-slate-100/90 text-primary hover:bg-slate-200 focus:outline-hidden focus:ring-2 focus:ring-accent transition-colors shadow-2xs border border-slate-200/80 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu drawer (code-split until opened) */}
        {mobileMenuOpen && (
          <Suspense fallback={null}>
            <MobileNavDrawer
              navLinks={navLinks}
              pathname={pathname}
              onClose={() => setMobileMenuOpen(false)}
            />
          </Suspense>
        )}
      </header>
    </>
  );
}

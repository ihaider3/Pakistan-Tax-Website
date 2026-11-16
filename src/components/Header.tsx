"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
    { name: "Salary Tax", href: "/salary-tax-calculator", badge: "2026–27", badgeColor: "bg-blue-100 text-blue-900 border-blue-200" },
    { name: "Zakat", href: "/zakat-calculator", badge: "2.5%", badgeColor: "bg-teal-100 text-teal-900 border-teal-200" },
    { name: "Property Tax", href: "/property-tax-calculator", badge: "236C/K", badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-200" },
    { name: "GST", href: "/gst-calculator", badge: "18%", badgeColor: "bg-amber-100 text-amber-900 border-amber-200" },
    { name: "Fitrana", href: "/fitrana-calculator", badge: "2026", badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  ];

  return (
    <header className="sticky top-0 z-50 print:hidden transition-all duration-300">
      {/* =========================================================================
          TOP AMBIENT STATUS BAR (HARDCOOKED PRIVACY & AUDIT TICKER)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#071B30] via-primary to-[#0A335C] text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-accent/25 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            </span>
            <span className="font-bold tracking-wide text-slate-100">
              100% Client-Side Privacy: <span className="text-emerald-300 font-extrabold">Your numbers never leave your phone.</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Zero Server Storage
            </span>
            <span className="text-slate-500">•</span>
            <Link
              href="/methodology"
              className="hover:text-emerald-300 transition-colors font-medium flex items-center gap-1"
            >
              <span>TY2027 Statutory Verified</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN GLASSMORPHIC NAVIGATION BAR (CINEMATIC SHADOWS & CRISP BORDERS)
         ========================================================================= */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-2xl bg-white/94 border-b border-slate-200/90 shadow-[0_12px_32px_-8px_rgba(11,42,74,0.12),0_4px_12px_rgba(0,0,0,0.04)] py-2.5"
            : "backdrop-blur-xl bg-white/96 border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(11,42,74,0.06)] py-3.5"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo & Hardcooked Emblem */}
          <Link
            href="/"
            className="group flex items-center gap-3.5 focus:outline-hidden"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-[#0C3259] to-accent text-white flex items-center justify-center font-black text-base tracking-tighter shadow-md shadow-primary/30 ring-2 ring-white/90 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent/30 group-hover:ring-accent/40 transition-all duration-300">
                <span className="drop-shadow-sm">PK</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-primary group-hover:text-primary-light transition-colors flex items-center gap-1.5 leading-tight">
                Pakistan Finance
                <span className="text-accent text-base sm:text-lg font-black">Calculators</span>
              </span>
              <span className="text-[10px] text-slate-500 font-extrabold tracking-wider uppercase hidden sm:block">
                Tax Year 2026–27 • Official Slabs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Hardcooked Pill Buttons) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-bold rounded-xl transition-all duration-200 min-h-[44px] inline-flex items-center gap-2 group relative border ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-[#0E355D] text-white border-primary shadow-md shadow-primary/25 scale-[1.03]"
                      : "bg-white/80 border-transparent text-slate-700 hover:text-primary hover:bg-slate-100 hover:border-slate-200/90 hover:scale-[1.02] hover:shadow-xs"
                  }`}
                >
                  <span className="tracking-tight">{link.name}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-all ${
                        isActive
                          ? "bg-accent text-white border-accent-light/40 shadow-xs"
                          : `${link.badgeColor} group-hover:scale-105`
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Badge & Methodology Link */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/methodology"
              className="px-4 py-2 rounded-xl text-xs font-black text-accent bg-accent-soft hover:bg-teal-100 border border-accent/30 transition-all duration-200 shadow-xs hover:shadow-md hover:scale-105 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verified Standards</span>
            </Link>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-slate-100/90 text-primary hover:bg-slate-200 focus:outline-hidden focus:ring-2 focus:ring-accent transition-all shadow-xs border border-slate-200/80 active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
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
      </div>

      {/* =========================================================================
          MOBILE NAVIGATION DRAWER (HARDCOOKED WITH ELEVATED CARDS)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-300/80 backdrop-blur-2xl bg-white/98 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-3 duration-250">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-accent px-3 py-1">
            <span>Official Calculators</span>
            <span className="text-[10px] text-slate-500 font-semibold">TY2027 Active</span>
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 text-base font-extrabold rounded-xl min-h-[48px] flex items-center justify-between transition-all border ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-[#0E355D] text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-surface text-slate-800 border-slate-200/80 hover:bg-slate-100 hover:text-primary"
                }`}
              >
                <span>{link.name}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    isActive
                      ? "bg-accent text-white border-accent-light/40"
                      : `${link.badgeColor}`
                  }`}
                >
                  {link.badge}
                </span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-surface text-center font-bold text-primary hover:bg-slate-200 transition-colors border border-slate-200/80"
            >
              About Platform
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-surface text-center font-bold text-primary hover:bg-slate-200 transition-colors border border-slate-200/80"
            >
              Sources &amp; Rules
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

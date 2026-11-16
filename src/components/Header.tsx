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
    { name: "Salary Tax", href: "/salary-tax-calculator", badge: "2026–27" },
    { name: "Zakat", href: "/zakat-calculator", badge: "2.5%" },
    { name: "Property Tax", href: "/property-tax-calculator", badge: "236C/K" },
    { name: "GST", href: "/gst-calculator", badge: "18%" },
    { name: "Fitrana", href: "/fitrana-calculator", badge: "2026" },
  ];

  return (
    <header className="sticky top-0 z-50 print:hidden transition-all duration-300">
      {/* Top Ambient Micro-Bar */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-accent/20">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-light"></span>
            </span>
            <span className="font-medium tracking-wide">
              100% Client-Side Privacy: Your numbers never leave your phone.
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300 text-[11px]">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Zero Server Storage
            </span>
            <span className="text-slate-500">•</span>
            <Link href="/methodology" className="hover:text-white transition-colors">
              FBR &amp; SBP Verified Rates
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-white/92 border-b border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(11,42,74,0.12)] py-2"
            : "backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(11,42,74,0.06)] py-3"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo & Emblem */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-hidden"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-[#0C3259] to-accent text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-md shadow-primary/25 ring-1 ring-white/40 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300">
                <span>PK</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-white"></span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-primary group-hover:text-primary-light transition-colors flex items-center gap-1.5 leading-tight">
                Pakistan Finance
                <span className="text-accent text-base sm:text-lg">Calculators</span>
              </span>
              <span className="text-[10px] text-appText-muted font-medium tracking-wider uppercase hidden sm:block">
                Tax Year 2026–27 • Official Slabs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 min-h-[44px] inline-flex items-center gap-1.5 group relative ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                      : "text-appText hover:text-primary hover:bg-slate-100/80 hover:scale-[1.02]"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-accent text-white"
                          : "bg-slate-200/80 text-appText-muted group-hover:bg-slate-300/80"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Pill */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/methodology"
              className="px-3 py-1.5 rounded-full text-xs font-bold text-accent bg-accent-soft hover:bg-teal-100/80 border border-accent/20 transition-all duration-200 hover:shadow-xs flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verified Standards</span>
            </Link>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-slate-100/80 text-primary hover:bg-slate-200/80 focus:outline-hidden focus:ring-2 focus:ring-accent transition-colors shadow-xs"
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

      {/* Mobile Navigation Drawer with Smooth Slide & Glassmorphism */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-appBorder backdrop-blur-2xl bg-white/95 px-4 pt-3 pb-5 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-accent px-3 py-1">
            Calculators
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-base font-semibold rounded-xl min-h-[44px] flex items-center justify-between transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-appText hover:bg-slate-100 hover:text-primary"
                }`}
              >
                <span>{link.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive ? "bg-accent text-white" : "bg-slate-200/80 text-appText-muted"
                  }`}
                >
                  {link.badge}
                </span>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs text-appText-muted">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-surface text-center font-medium text-appText hover:bg-slate-200 transition-colors"
            >
              About Platform
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-surface text-center font-medium text-appText hover:bg-slate-200 transition-colors"
            >
              Sources &amp; Rules
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

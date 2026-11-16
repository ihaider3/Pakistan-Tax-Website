"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Salary Tax", href: "/salary-tax-calculator" },
    { name: "Zakat", href: "/zakat-calculator" },
    { name: "Property Tax", href: "/property-tax-calculator" },
    { name: "GST", href: "/gst-calculator" },
    { name: "Fitrana", href: "/fitrana-calculator" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-appBorder shadow-xs print:hidden">
      {/* Privacy strip above navbar */}
      <div className="bg-primary text-white text-xs py-1 px-4 text-center">
        <span className="inline-flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          100% Client-Side Privacy: Your numbers never leave your phone.
        </span>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo text */}
        <Link
          href="/"
          className="text-lg sm:text-xl font-bold tracking-tight text-primary hover:text-primary-light transition-colors flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-extrabold text-sm">
            PK
          </span>
          <span>Pakistan Finance Calculators</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors min-h-[44px] inline-flex items-center ${
                  isActive
                    ? "bg-surface text-accent font-semibold"
                    : "text-appText hover:text-primary hover:bg-surface"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md text-appText hover:bg-surface focus:outline-hidden focus:ring-2 focus:ring-accent"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-appBorder bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-3 text-base font-medium rounded-md min-h-[44px] flex items-center ${
                  isActive
                    ? "bg-surface text-accent font-semibold"
                    : "text-appText hover:bg-surface hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-appBorder text-xs text-appText-muted">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-appText-muted hover:text-primary"
            >
              About Platform
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-appText-muted hover:text-primary"
            >
              Methodology & Sources
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

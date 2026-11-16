"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/content/pages";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculatorLinks = [
    { name: "Salary Tax Calculator", href: "/salary-tax-calculator", badge: "2026–27", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
    { name: "Complete Zakat Calculator", href: "/zakat-calculator", badge: "2.5%", badgeColor: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
    { name: "Property Tax (236C + 236K)", href: "/property-tax-calculator", badge: "Advance Tax", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" },
    { name: "GST Calculator (18%)", href: "/gst-calculator", badge: "Goods 18%", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30" },
    { name: "Fitrana Calculator 2026", href: "/fitrana-calculator", badge: "Eid 2026", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
  ];

  const legalLinks = [
    { name: "About Us & Mission", href: "/about" },
    { name: "Methodology & Statutory Sources", href: "/methodology" },
    { name: "100% Privacy Policy", href: "/privacy-policy" },
    { name: "Legal & Religious Disclaimer", href: "/disclaimer" },
    { name: "Contact & Bug Reports", href: "/contact" },
  ];

  return (
    <footer className="relative mt-24 print:hidden overflow-hidden bg-gradient-to-b from-[#071B30] via-[#0B2A4A] to-[#040E1A] text-white shadow-[0_-20px_50px_rgba(11,42,74,0.25)] border-t border-slate-700/60">
      {/* =========================================================================
          TOP ILLUMINATED AMBIENT GLOW BORDER (CINEMATIC HARDCOOKED EFFECT)
         ========================================================================= */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-accent-light to-emerald-400 shadow-[0_0_20px_rgba(20,184,166,0.6)]" />

      {/* Subtle Dot Mesh Background Effect */}
      <div className="absolute inset-0 bg-dot-mesh pointer-events-none opacity-15" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,_rgba(15,118,110,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[radial-gradient(circle,_rgba(20,61,105,0.25),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 pt-16 pb-12">
        {/* =========================================================================
            MAIN 3-COLUMN HARDCOOKED GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Column 1: Brand & High-Security Privacy Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-light via-accent to-emerald-500 text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-lg shadow-accent/25 ring-2 ring-white/20">
                PK
              </div>
              <div>
                <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
                  {siteConfig.brandName}
                </h3>
                <span className="text-[11px] font-bold text-accent-light uppercase tracking-widest block mt-1">
                  Statutory &amp; Islamic Calculation Platform
                </span>
              </div>
            </div>

            {/* Platform Mission Statement */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              Free, official, and completely confidential calculation utilities for Pakistan.
              All tax slabs, Nisab rates, and withholding tables are verified against official notifications.
            </p>

            {/* Hardcooked Privacy & Client-Side Security Capsule */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-xl space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-emerald-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span>Zero Server Storage Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                <strong className="text-white font-extrabold">{siteConfig.privacyClaim}</strong> Everything is computed client-side inside your browser sandbox. We do not store or transmit any input amounts.
              </p>
            </div>
          </div>

          {/* Column 2: Official Calculators (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-accent-light"></span>
              <h4 className="font-black text-white text-sm uppercase tracking-wider">
                Official Calculators
              </h4>
            </div>
            <ul className="space-y-2.5">
              {calculatorLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
                  >
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white group-hover:translate-x-1 transition-all">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform, Legal & Verification (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h4 className="font-black text-white text-sm uppercase tracking-wider">
                Platform &amp; Legal
              </h4>
            </div>
            <ul className="space-y-2">
              {legalLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
                  >
                    <span className="text-accent-light font-black group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Back to Top Floating Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-accent text-white font-extrabold text-xs transition-all duration-200 border border-white/20 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Back to Top</span>
                <span className="group-hover:-translate-y-1 transition-transform">↑</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM BAR (STATUTORY DISCLAIMER & COPYRIGHT)
           ========================================================================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[13px] text-slate-300 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-200">
              © {siteConfig.copyrightYear} {siteConfig.brandName}. All rights reserved.
            </p>
            <p className="text-[13px] text-slate-400">
              Finance Act 2026 • FBR Withholding Tax Rate Card TY2027 • SBP Zakat Notifications
            </p>
          </div>

          {/* Hardcooked Disclaimer Pill */}
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-slate-200 text-center shadow-xs text-[13px]">
            <span className="font-black text-amber-300 mr-1.5">Notice:</span>
            <span className="font-semibold">Estimates only — not tax, legal, or religious advice.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

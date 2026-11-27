import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import BackToTopButton from "./BackToTopButton";
import LiveContentText from "./LiveContentText";

export default function Footer({
  initialContent = {},
}: {
  initialContent?: Record<string, string>;
} = {}) {
  const getVal = (key: string, fallback: string) =>
    initialContent[key] !== undefined && initialContent[key] !== ""
      ? initialContent[key]
      : fallback;

  const footerMission = getVal(
    "footer_mission",
    "Free, official, and completely confidential calculation utilities for Pakistan. All tax slabs, Nisab rates, and withholding tables are verified against official notifications."
  );
  const footerPrivacyNote = getVal(
    "footer_privacy_note",
    "Everything is computed client-side inside your browser sandbox. We do not store or transmit any input amounts."
  );
  const footerCopyright = getVal(
    "footer_copyright",
    `© ${siteConfig.copyrightYear} ${siteConfig.brandName}. All rights reserved. Content, design and text on this website may not be copied, reproduced or republished without written permission.`
  );

  const calculatorLinks = [
    { name: "Salary Tax Calculator", href: "/salary-tax-calculator", badge: "2026–27", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
    { name: "Complete Zakat Calculator", href: "/zakat-calculator", badge: "2.5%", badgeColor: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
    { name: "Property Tax (236C + 236K)", href: "/property-tax-calculator", badge: "Advance Tax", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" },
    { name: "GST Calculator (18%)", href: "/gst-calculator", badge: "Goods 18%", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30" },
    { name: "Fitrana Calculator 2026", href: "/fitrana-calculator", badge: "Eid 2026", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" },
    { name: "Ushr Calculator", href: "/ushr-calculator", badge: "10% & 5%", badgeColor: "bg-lime-500/20 text-lime-300 border-lime-400/30" },
  ];

  const legalLinks = [
    { name: "About Us & Mission", href: "/about" },
    { name: "Methodology & Statutory Sources", href: "/methodology" },
    { name: "100% Privacy Policy", href: "/privacy-policy" },
    { name: "Legal & Religious Disclaimer", href: "/disclaimer" },
    { name: "Contact & Bug Reports", href: "/contact" },
  ];

  return (
    <footer className="cv-below-fold relative mt-10 md:mt-24 print:hidden overflow-hidden bg-gradient-to-b from-[#071B30] via-[#0B2A4A] to-[#040E1A] text-white shadow-[0_-20px_50px_rgba(11,42,74,0.25)] border-t border-slate-700/60">
      {/* =========================================================================
          TOP ILLUMINATED AMBIENT GLOW BORDER (CINEMATIC HARDCOOKED EFFECT)
         ========================================================================= */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-accent-light to-emerald-400 shadow-[0_0_20px_rgba(20,184,166,0.6)]" />

      {/* Subtle Dot Mesh Background Effect */}
      <div className="absolute inset-0 bg-dot-mesh pointer-events-none opacity-15" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,_rgba(15,118,110,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[radial-gradient(circle,_rgba(20,61,105,0.25),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 pt-8 pb-20 md:pt-16 md:pb-12">
        {/* =========================================================================
            MAIN 3-COLUMN HARDCOOKED GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 lg:gap-12 pb-8 md:pb-14 border-b border-white/10">
          {/* Column 1: Brand & High-Security Privacy Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Logo & Title */}
            <div className="space-y-3">
              <Link href="/" className="inline-block group" aria-label="CalculationHub Homepage">
                <div className="bg-white rounded-2xl px-4 py-2.5 shadow-lg shadow-black/20 ring-1 ring-white/30 inline-flex items-center">
                  <img
                    src="/images/CalculationHub_Logo_Full.webp"
                    alt="CalculationHub"
                    width={520}
                    height={127}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-95 transition-opacity"
                  />
                </div>
              </Link>
              <p className="text-[11px] font-bold text-accent-light uppercase tracking-widest block">
                Statutory &amp; Islamic Calculation Platform
              </p>
            </div>

            {/* Platform Mission Statement */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              <LiveContentText contentKey="footer_mission" fallback={footerMission} />
            </p>

            {/* Hardcooked Privacy & Client-Side Security Capsule */}
            <div className="bg-white/10 md:bg-white/5 md:backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-xl space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-emerald-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="hidden md:inline-flex md:animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span>Zero Server Storage Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                <strong className="text-white font-extrabold">{siteConfig.privacyClaim}</strong>{" "}
                <LiveContentText contentKey="footer_privacy_note" fallback={footerPrivacyNote} />
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
            <ul className="space-y-1.5 md:space-y-2.5">
              {calculatorLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="group min-h-[44px] md:min-h-0 flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
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
            <ul className="space-y-1.5 md:space-y-2">
              {legalLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="group min-h-[44px] md:min-h-0 flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
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
              <BackToTopButton />
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM BAR (STATUTORY DISCLAIMER & COPYRIGHT)
           ========================================================================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[13px] text-slate-300 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-200">
              <LiveContentText contentKey="footer_copyright" fallback={footerCopyright} />
            </p>
            <p className="text-[13px] text-slate-400">
              Finance Act 2026 • FBR Withholding Tax Rate Card TY2027 • SBP Zakat Notifications
            </p>
            <p className="text-[13px] text-slate-300 pt-0.5">
              Contact:{" "}
              <a
                href="mailto:contact@calculationhubs.com"
                className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors"
              >
                contact@calculationhubs.com
              </a>
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

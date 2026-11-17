"use client";

import React from "react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const offlineTools = [
    { name: "Salary Tax Calculator", href: "/salary-tax-calculator", badge: "2026–27" },
    { name: "Complete Zakat Calculator", href: "/zakat-calculator", badge: "2.5%" },
    { name: "Property Tax (236C + 236K)", href: "/property-tax-calculator", badge: "Filer / Non-Filer" },
    { name: "GST Calculator (18%)", href: "/gst-calculator", badge: "Add / Remove" },
    { name: "Fitrana Calculator", href: "/fitrana-calculator", badge: "Eid 2026" },
    { name: "Ushr Calculator (Crops)", href: "/ushr-calculator", badge: "10% / 5% / 7.5%" },
  ];

  return (
    <div className="max-w-[850px] mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-8 animate-in fade-in duration-300">
      {/* Offline Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-black uppercase tracking-wider border border-amber-300 shadow-2xs">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span>Offline Mode Active</span>
      </div>

      {/* Main Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
          You are Offline — Your Calculators Still Work
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Because this platform computes everything client-side in your device sandbox, all calculators you previously opened are ready to calculate without internet.
        </p>
      </div>

      {/* Retry Button */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRetry}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-[#071F36] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <svg className="w-4 h-4 animate-spin-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Retry Connection</span>
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 transition-all"
        >
          Return to Home
        </Link>
      </div>

      {/* Offline Available Calculators */}
      <div className="pt-8 border-t border-slate-200 text-left space-y-4">
        <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider">
          Offline-Ready Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {offlineTools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-accent shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-primary">
                {tool.name}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-accent group-hover:text-white transition-colors">
                {tool.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 text-center max-w-lg mx-auto space-y-1">
        <strong className="block font-black">100% Client-Side Private Storage</strong>
        <p className="text-teal-800">
          Your input numbers never leave your phone, whether you are online or offline in airplane mode.
        </p>
      </div>
    </div>
  );
}

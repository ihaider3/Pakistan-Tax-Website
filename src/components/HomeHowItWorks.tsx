"use client";

import React, { useState } from "react";

interface HomeHowItWorksProps {
  children: React.ReactNode;
}

/**
 * Wraps the Homepage "How It Works" 3-step guide so it folds cleanly into a
 * collapsed accordion on mobile (<768px) while remaining fully open on desktop
 * and keeping all DOM content intact for search crawlers.
 */
export default function HomeHowItWorks({ children }: HomeHowItWorksProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#F4F7FB] via-white to-[#EEF4F9] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 border-2 border-slate-200/95 shadow-[0_25px_60px_-15px_rgba(11,42,74,0.12),0_4px_20px_rgba(0,0,0,0.03)] md:space-y-10 ring-1 ring-slate-900/5">
      {/* Ambient Radial Spotlight inside container */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.12),transparent_70%)] pointer-events-none" />
      <div className="hidden md:block absolute inset-0 bg-dot-mesh pointer-events-none opacity-40" />

      {/* Mobile Accordion Trigger (<768px) */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="home-how-it-works-content"
        className="md:hidden relative w-full min-h-[48px] flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-accent rounded-xl"
      >
        <div className="space-y-0.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-accent uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            How It Works — 3 Easy Steps
          </span>
          <span className="block text-xl font-black text-primary tracking-tight">
            How It Works
          </span>
        </div>
        <span className="shrink-0 w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary shadow-2xs">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180 text-accent" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Desktop Heading (>=768px, unchanged) */}
      <div className="hidden md:block relative text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border-2 border-accent/30 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          How It Works — 3 Easy Steps
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
          How It Works
        </h2>
        <p className="text-base sm:text-lg font-semibold text-slate-700 max-w-xl mx-auto">
          Three simple steps to calculate your financial obligations with zero friction, zero signups, and 100% privacy.
        </p>
      </div>

      {/* Collapsible body on mobile via CSS grid-rows (stays in DOM, never display:none) */}
      <div
        id="home-how-it-works-content"
        className={`relative grid transition-[grid-template-rows] duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="pt-4 md:pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

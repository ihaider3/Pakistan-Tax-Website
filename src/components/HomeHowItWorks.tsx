"use client";

import React, { useState } from "react";

interface HomeHowItWorksProps {
  desktopHeader?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Wraps the Homepage "How It Works" 3-step guide so it folds cleanly into a
 * collapsed accordion on mobile (<768px) while keeping desktop header/cards
 * server-rendered.
 */
export default function HomeHowItWorks({ desktopHeader, children }: HomeHowItWorksProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#F4F7FB] via-white to-[#EEF4F9] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 border-2 border-slate-200/95 shadow-[0_25px_60px_-15px_rgba(11,42,74,0.12),0_4px_20px_rgba(0,0,0,0.03)] md:space-y-10 ring-1 ring-slate-900/5">
      {desktopHeader}

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

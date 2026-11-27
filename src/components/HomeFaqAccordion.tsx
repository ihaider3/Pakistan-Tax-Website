"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface HomeFaqSegment {
  text: string;
  tone?: "primary" | "danger" | "success";
  href?: string;
}

export interface HomeFaqCardItem {
  badge: string;
  badgeClass: string;
  topBarClass: string;
  question: string;
  answerNode?: React.ReactNode;
  answerSegments?: HomeFaqSegment[];
  href: string;
  cta: string;
}

const TONE_CLASS: Record<"primary" | "danger" | "success", string> = {
  primary: "text-primary font-black",
  danger: "text-red-700 font-black",
  success: "text-emerald-700 font-black",
};

function renderSegments(segments: HomeFaqSegment[]) {
  return segments.map((seg, sIdx) => {
    if (seg.href) {
      return (
        <Link
          key={sIdx}
          href={seg.href}
          prefetch={false}
          className="text-primary font-black underline hover:text-accent transition-colors"
        >
          {seg.text}
        </Link>
      );
    }
    if (seg.tone) {
      return (
        <strong key={sIdx} className={TONE_CLASS[seg.tone]}>
          {seg.text}
        </strong>
      );
    }
    return <React.Fragment key={sIdx}>{seg.text}</React.Fragment>;
  });
}

interface HomeFaqAccordionProps {
  items: HomeFaqCardItem[];
}

/**
 * Renders Homepage FAQ cards in a mobile-collapsed accordion (<768px) while
 * keeping all 7 cards expanded in the multi-column desktop grid (>=768px)
 * and retaining all answer text in the DOM without display:none.
 */
export default function HomeFaqAccordion({ items }: HomeFaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
      {items.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="group relative bg-white rounded-2xl md:rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-4 md:p-7 lg:p-8 md:space-y-4 shadow-[0_8px_22px_-6px_rgba(11,42,74,0.07)] md:shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] md:hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] md:hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r ${faq.topBarClass} md:group-hover:h-2 transition-all duration-300`}
            />

            <div>
              {/* Mobile trigger button (<768px) */}
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`home-faq-card-body-${idx}`}
                className="md:hidden w-full min-h-[44px] flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-accent rounded-lg pt-1"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${faq.badgeClass}`}
                  >
                    {faq.badge}
                  </span>
                  <span className="block font-black text-[15px] text-primary leading-snug">
                    {faq.question}
                  </span>
                </div>
                <span className="shrink-0 w-8 h-8 rounded-full bg-surface border border-slate-200 flex items-center justify-center text-appText-muted">
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Desktop static header (>=768px, unchanged) */}
              <div className="hidden md:block">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block shadow-2xs ${faq.badgeClass}`}
                >
                  {faq.badge}
                </span>
                <h3 className="font-black text-lg sm:text-xl text-primary group-hover:text-accent transition-colors mt-3 mb-2 leading-snug">
                  {faq.question}
                </h3>
              </div>

              {/* Answer kept in DOM via CSS grid-rows */}
              <div
                id={`home-faq-card-body-${idx}`}
                className={`grid transition-[grid-template-rows] duration-200 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <p className="text-[13px] md:text-sm text-slate-800 font-medium leading-relaxed pt-2.5 md:pt-0">
                    {faq.answerSegments ? renderSegments(faq.answerSegments) : faq.answerNode}
                  </p>
                  <div className="md:hidden pt-3 mt-3 border-t border-slate-100">
                    <Link
                      href={faq.href}
                      prefetch={false}
                      className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-slate-50 text-primary font-extrabold text-xs flex items-center justify-between shadow-2xs"
                    >
                      <span>{faq.cta}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop footer CTA link (unchanged) */}
            <div className="hidden md:block pt-4 border-t border-slate-100">
              <Link
                href={faq.href}
                prefetch={false}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-primary text-primary group-hover:text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-between shadow-xs group-hover:shadow-md"
              >
                <span>{faq.cta}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

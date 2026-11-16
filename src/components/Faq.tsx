"use client";

import React, { useState } from "react";
import { FaqItem } from "@/content/pages";

interface FaqProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export default function Faq({
  items,
  title = "Frequently Asked Questions",
  className = "",
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className={`space-y-5 ${className}`} aria-labelledby="faq-heading">
      {/* JSON-LD Schema for Google Search Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="border-b border-slate-200/80 pb-3">
        <span className="text-xs font-bold text-accent uppercase tracking-wider">Help &amp; Answers</span>
        <h2 id="faq-heading" className="text-xl sm:text-2xl font-black text-primary tracking-tight mt-0.5">
          {title}
        </h2>
        <p className="text-xs text-appText-muted mt-0.5">
          Clear answers to common questions about Pakistan tax laws and Islamic rules.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full min-h-[52px] px-5 py-4 text-left font-bold text-sm sm:text-base text-primary hover:text-accent hover:bg-slate-50/60 flex items-center justify-between gap-4 focus:outline-hidden focus:ring-2 focus:ring-accent transition-colors"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
              >
                <span>{item.question}</span>
                <span className="text-appText-muted shrink-0 w-7 h-7 rounded-full bg-surface flex items-center justify-center">
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-5 pb-5 pt-2 text-xs sm:text-sm text-appText-muted leading-relaxed border-t border-slate-100 bg-surface/40 animate-in fade-in-50 duration-150"
                >
                  <p className="text-slate-700">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

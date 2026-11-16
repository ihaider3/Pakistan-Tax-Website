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
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

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
    <section className={`space-y-4 ${className}`} aria-labelledby="faq-heading">
      {/* JSON-LD Schema for Google Search Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="border-b border-appBorder pb-2">
        <h2 id="faq-heading" className="text-xl font-bold text-primary">
          {title}
        </h2>
        <p className="text-xs text-appText-muted">
          Clear answers to common questions about Pakistan rates and rules.
        </p>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-appBorder rounded-lg overflow-hidden bg-white shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full min-h-[48px] px-4 py-3 text-left font-semibold text-sm sm:text-base text-appText hover:text-primary hover:bg-surface flex items-center justify-between gap-3 focus:outline-hidden focus:ring-2 focus:ring-accent"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
              >
                <span>{item.question}</span>
                <span className="text-appText-muted shrink-0">
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
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-4 pb-4 pt-1 text-sm text-appText-muted leading-relaxed border-t border-appBorder/50 bg-surface/30"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

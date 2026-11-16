"use client";

import React, { useState, useId } from "react";
import Link from "next/link";

interface SearchItem {
  title: string;
  href: string;
  keywords: string[];
  description: string;
  badge: string;
}

const searchableTools: SearchItem[] = [
  {
    title: "Salary Tax Calculator 2026-27",
    href: "/salary-tax-calculator",
    keywords: ["salary", "tax", "income", "fbr", "pay", "take home", "monthly", "150000", "slab", "withholding"],
    description: "FBR Section 149 salary tax slabs, monthly deduction & take-home pay.",
    badge: "Section 149",
  },
  {
    title: "Complete Zakat Calculator",
    href: "/zakat-calculator",
    keywords: ["zakat", "nisab", "gold", "silver", "cash", "bank", "2.5%", "tola", "grams", "hawl"],
    description: "2.5% Zakat on gold, silver, cash and business with Hanafi silver Nisab check.",
    badge: "Hanafi Nisab",
  },
  {
    title: "Property Transfer Tax (236C & 236K)",
    href: "/property-tax-calculator",
    keywords: ["property", "tax", "236c", "236k", "filer", "non-filer", "buy", "sell", "real estate", "fbr value"],
    description: "Advance tax on buying (1.25%) and selling (2.75%) real estate in Pakistan.",
    badge: "236C & 236K",
  },
  {
    title: "GST Calculator (18% & Custom)",
    href: "/gst-calculator",
    keywords: ["gst", "sales tax", "18%", "invoice", "add gst", "remove gst", "tax rate"],
    description: "Add or remove 18% standard GST or custom rates from any invoice amount.",
    badge: "18% Standard",
  },
  {
    title: "Fitrana Calculator 2026",
    href: "/fitrana-calculator",
    keywords: ["fitrana", "fitr", "sadqa", "ramadan", "wheat", "300", "dates", "raisins", "barley", "muneeb", "cii"],
    description: "Calculate household Sadqat-ul-Fitr per person (Wheat Rs 300 consensus rate).",
    badge: "Ramadan 2026",
  },
];

export default function SearchBox({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? searchableTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(trimmed) ||
          tool.description.toLowerCase().includes(trimmed) ||
          tool.keywords.some((k) => k.toLowerCase().includes(trimmed))
      )
    : [];

  return (
    <div className={`relative max-w-2xl mx-auto w-full ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search a calculator
      </label>

      {/* Elevated Search Card with Glow Focus */}
      <div className="relative group rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(11,42,74,0.08),0_4px_10px_-2px_rgba(11,42,74,0.03)] focus-within:shadow-[0_16px_40px_-6px_rgba(15,118,110,0.2)]">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-appText-muted group-focus-within:text-accent transition-colors">
          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-focus-within:bg-accent-soft transition-colors">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search a calculator — e.g. salary tax, zakat, 236C, GST 18%, fitrana…"
          className="w-full pl-14 pr-24 py-3.5 sm:py-4 min-h-[52px] text-sm sm:text-base rounded-2xl border border-slate-200/90 bg-white text-appText shadow-inner-soft focus:outline-hidden focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all placeholder:text-appText-subtle font-medium"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-appText-muted hover:text-appText transition-colors"
            aria-label="Clear search query"
          >
            <div className="p-1 rounded-full bg-slate-100 hover:bg-slate-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-[11px] font-semibold text-appText-muted/70 bg-surface px-2 py-0.5 rounded-md border border-appBorder">
              Instant
            </span>
          </div>
        )}
      </div>

      {/* Results Dropdown with Glassmorphism & Shadow */}
      {isOpen && query.trim() !== "" && (
        <div
          className="absolute z-40 mt-3 w-full backdrop-blur-2xl bg-white/98 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-150"
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setIsOpen(false)}
                className="block p-4 hover:bg-surface/80 transition-all group"
                role="option"
                aria-selected="false"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm group-hover:text-accent transition-colors">
                      {tool.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20">
                      {tool.badge}
                    </span>
                  </div>
                  <span className="text-xs text-accent font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open →
                  </span>
                </div>
                <p className="text-xs text-appText-muted line-clamp-1">
                  {tool.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-5 text-center text-sm text-appText-muted">
              No matching calculator found for &ldquo;<span className="font-semibold text-primary">{query}</span>&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useId } from "react";
import Link from "next/link";

interface SearchItem {
  title: string;
  href: string;
  keywords: string[];
  description: string;
}

const searchableTools: SearchItem[] = [
  {
    title: "Salary Tax Calculator 2026-27",
    href: "/salary-tax-calculator",
    keywords: ["salary", "tax", "income", "fbr", "pay", "take home", "monthly", "150000", "slab", "withholding"],
    description: "FBR Section 149 salary tax slabs, monthly deduction & take-home pay.",
  },
  {
    title: "Complete Zakat Calculator",
    href: "/zakat-calculator",
    keywords: ["zakat", "nisab", "gold", "silver", "cash", "bank", "2.5%", "tola", "grams", "hawl"],
    description: "2.5% Zakat on gold, silver, cash and business with Hanafi silver Nisab check.",
  },
  {
    title: "Property Transfer Tax (236C & 236K)",
    href: "/property-tax-calculator",
    keywords: ["property", "tax", "236c", "236k", "filer", "non-filer", "buy", "sell", "real estate", "fbr value"],
    description: "Advance tax on buying (1.25%) and selling (2.75%) real estate in Pakistan.",
  },
  {
    title: "GST Calculator (18% & Custom)",
    href: "/gst-calculator",
    keywords: ["gst", "sales tax", "18%", "invoice", "add gst", "remove gst", "tax rate"],
    description: "Add or remove 18% standard GST or custom rates from any invoice amount.",
  },
  {
    title: "Fitrana Calculator 2026",
    href: "/fitrana-calculator",
    keywords: ["fitrana", "fitr", "sadqa", "ramadan", "wheat", "300", "dates", "raisins", "barley", "muneeb", "cii"],
    description: "Calculate household Sadqat-ul-Fitr per person (Wheat Rs 300 consensus rate).",
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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-appText-muted">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
          className="w-full pl-11 pr-4 py-3 min-h-[48px] text-base rounded-xl border border-appBorder bg-white text-appText shadow-sm focus:outline-hidden focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-appText-subtle"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-appText-muted hover:text-appText"
            aria-label="Clear search query"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim() !== "" && (
        <div
          className="absolute z-30 mt-2 w-full bg-white rounded-xl border border-appBorder shadow-lg overflow-hidden divide-y divide-appBorder"
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setIsOpen(false)}
                className="block p-3.5 hover:bg-surface transition-colors"
                role="option"
                aria-selected="false"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary text-sm">
                    {tool.title}
                  </span>
                  <span className="text-xs text-accent font-medium">Open →</span>
                </div>
                <p className="text-xs text-appText-muted mt-0.5">
                  {tool.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-appText-muted">
              No matching calculator found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

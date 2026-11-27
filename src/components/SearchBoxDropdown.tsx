"use client";

import React from "react";
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

/** Lazy-loaded search index & results dropdown triggered only on search interaction. */
export default function SearchBoxDropdown({
  query,
  onSelect,
}: {
  query: string;
  onSelect: () => void;
}) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;

  const results = searchableTools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(trimmed) ||
      tool.description.toLowerCase().includes(trimmed) ||
      tool.keywords.some((k) => k.toLowerCase().includes(trimmed))
  );

  return (
    <div
      className="absolute z-40 mt-3 w-full backdrop-blur-2xl bg-white/98 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-150"
      role="listbox"
    >
      {results.length > 0 ? (
        results.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            onClick={onSelect}
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
  );
}

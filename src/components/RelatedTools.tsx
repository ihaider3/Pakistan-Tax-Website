import React from "react";
import Link from "next/link";

interface RelatedToolsProps {
  currentSlug: string;
  className?: string;
}

const allTools = [
  {
    slug: "salary-tax-calculator",
    name: "Salary Tax Calculator",
    description: "Calculate monthly income tax & take-home pay under FBR TY2027 slabs.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    slug: "zakat-calculator",
    name: "Complete Zakat Calculator",
    description: "2.5% Zakat on cash, gold, silver & trade inventory with Hanafi Nisab.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    slug: "property-tax-calculator",
    name: "Property Transfer Tax (236C / 236K)",
    description: "Calculate advance tax on buying (236K) or selling (236C) real estate.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator (18%)",
    description: "Add or remove 18% sales tax or custom rates from any invoice.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
      </svg>
    ),
  },
  {
    slug: "fitrana-calculator",
    name: "Fitrana Calculator 2026",
    description: "Household Sadqa-e-Fitr based on Mufti Muneeb and CII 2026 rates.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function RelatedTools({ currentSlug, className = "" }: RelatedToolsProps) {
  const tools = allTools.filter((t) => t.slug !== currentSlug);

  return (
    <section className={`space-y-4 ${className}`} aria-labelledby="related-tools-heading">
      <div className="border-b border-appBorder pb-2">
        <h2 id="related-tools-heading" className="text-xl font-bold text-primary">
          Other Pakistan Calculators
        </h2>
        <p className="text-xs text-appText-muted">
          Fast, accurate, and private calculators for taxes, property, and Islamic obligations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group p-4 bg-white rounded-lg border border-appBorder hover:border-accent hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-md bg-surface text-primary group-hover:bg-accent-soft group-hover:text-accent flex items-center justify-center mb-3 transition-colors">
                {tool.icon}
              </div>
              <h3 className="font-bold text-sm text-primary group-hover:text-accent transition-colors mb-1">
                {tool.name}
              </h3>
              <p className="text-xs text-appText-muted line-clamp-2">
                {tool.description}
              </p>
            </div>
            <span className="text-xs font-semibold text-accent mt-3 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
              Calculate now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | CalculationHub",
  description: "The requested page could not be found. Choose one of CalculationHub's free calculators or return home.",
  robots: {
    index: false,
    follow: false,
  },
};

const popularCalculators = [
  { name: "Salary Tax Calculator", href: "/salary-tax-calculator", badge: "TY 2026–27" },
  { name: "Complete Zakat Calculator", href: "/zakat-calculator", badge: "2.5% Nisab" },
  { name: "Property Transfer Tax", href: "/property-tax-calculator", badge: "236C / 236K" },
  { name: "GST Calculator (18%)", href: "/gst-calculator", badge: "Sales Tax" },
  { name: "Fitrana Calculator 2026", href: "/fitrana-calculator", badge: "Ramadan 2026" },
  { name: "Ushr Calculator", href: "/ushr-calculator", badge: "Zakat on Crops" },
];

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center max-w-3xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-[#0E355E] to-accent text-white flex items-center justify-center font-black text-2xl mb-6 shadow-lg shadow-primary/20">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-2">
        Page Not Found — Safha Dastiyab Nahi
      </h1>
      <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed">
        The page you are looking for does not exist or may have been moved. You can return to our homepage or use one of our verified Pakistan calculators below:
      </p>

      {/* Grid of All 6 Calculators */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-left">
        {popularCalculators.map((calc, idx) => (
          <Link
            key={idx}
            href={calc.href}
            className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent-soft px-2 py-0.5 rounded-md">
                {calc.badge}
              </span>
              <span className="text-slate-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all text-xs">
                →
              </span>
            </div>
            <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
              {calc.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-[#071F36] active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-primary/25 cursor-pointer"
        >
          <span>←</span>
          <span>Back to Homepage</span>
        </Link>
        <Link
          href="/methodology"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-primary hover:border-accent hover:text-accent font-bold text-sm transition-all shadow-2xs cursor-pointer"
        >
          <span>Statutory Methodology</span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import VerificationBadge from "./VerificationBadge";
import Faq from "./Faq";
import RelatedTools from "./RelatedTools";
import { CalculatorPageContent } from "@/content/pages";

interface CalculatorShellProps {
  content: CalculatorPageContent;
  calculatorInputs: React.ReactNode;
  resultPanel: React.ReactNode;
  breakdownTable?: React.ReactNode;
  romanUrduSummary?: React.ReactNode;
  customTopSection?: React.ReactNode;
}

export default function CalculatorShell({
  content,
  calculatorInputs,
  resultPanel,
  breakdownTable,
  romanUrduSummary,
  customTopSection,
}: CalculatorShellProps) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-12">
      {/* =========================================================================
          BLOCK 1 & 2: H1, Short Intro, Roman Urdu Box & Verification Badge
         ========================================================================= */}
      <section className="space-y-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
            Pakistan Official Calculator
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight mt-2">
            {content.h1}
          </h1>
          <p className="text-sm sm:text-base text-appText-muted mt-2 max-w-3xl leading-relaxed">
            {content.intro}
          </p>
        </div>

        {/* Roman Urdu Explanation Block */}
        <div className="bg-surface/80 border-l-4 border-accent p-3.5 sm:p-4 rounded-r-lg text-xs sm:text-sm text-appText leading-relaxed">
          <span className="font-semibold text-primary block mb-0.5">
            Roman Urdu Wazahat:
          </span>
          <p>{content.romanUrduIntro}</p>
        </div>

        {/* Verification Badge */}
        <VerificationBadge
          source={content.source}
          sourceDocument={content.sourceDocument}
          lastVerified={content.lastVerified}
        />
      </section>

      {/* Optional Custom Top Section (e.g. Bank Nisab Info Box on Zakat page) */}
      {customTopSection && <section className="print:hidden">{customTopSection}</section>}

      {/* =========================================================================
          BLOCK 3 & 4: Interactive Calculator — Inputs (Left) & ResultPanel (Right)
         ========================================================================= */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        aria-label="Calculator workspace"
      >
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-xl border border-appBorder shadow-xs space-y-6 print:hidden">
          <div className="border-b border-appBorder pb-3">
            <h2 className="text-lg font-bold text-primary">Enter Your Details</h2>
            <p className="text-xs text-appText-muted">
              Live calculation updates instantly with zero page reloads.
            </p>
          </div>
          {calculatorInputs}
        </div>

        {/* Right Column: Live Result Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          {resultPanel}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 5: Line-by-Line / Slab-by-Slab Breakdown Table
         ========================================================================= */}
      {breakdownTable && (
        <section className="bg-white p-5 sm:p-7 rounded-xl border border-appBorder shadow-xs print:p-0 print:border-none print:shadow-none">
          {breakdownTable}
          {romanUrduSummary && (
            <div className="mt-4 pt-4 border-t border-appBorder text-xs sm:text-sm text-appText-muted">
              {romanUrduSummary}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          BLOCK 6: How to Use — Numbered Steps
         ========================================================================= */}
      <section className="bg-surface p-5 sm:p-7 rounded-xl border border-appBorder print:hidden">
        <h2 className="text-lg font-bold text-primary mb-3">How to Use This Calculator</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-appText">
          {content.howToUseSteps.map((step, idx) => (
            <li
              key={idx}
              className="bg-white p-3.5 rounded-lg border border-appBorder flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug text-appText">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* =========================================================================
          BLOCK 7: Exact Formula in Plain Text
         ========================================================================= */}
      <section className="bg-white p-5 sm:p-7 rounded-xl border border-appBorder print:hidden">
        <h2 className="text-lg font-bold text-primary mb-2">{content.formulaTitle}</h2>
        <div className="bg-surface p-4 rounded-lg border border-appBorder font-mono text-xs sm:text-sm text-primary leading-relaxed">
          {content.formulaDescription}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 8: Worked Example with Real Numbers
         ========================================================================= */}
      <section className="bg-white p-5 sm:p-7 rounded-xl border border-appBorder print:hidden">
        <h2 className="text-lg font-bold text-primary mb-2">
          {content.workedExample.title}
        </h2>
        <p className="text-sm text-appText-muted mb-3">
          {content.workedExample.description}
        </p>
        <ul className="space-y-2 text-sm text-appText bg-surface p-4 rounded-lg border border-appBorder">
          {content.workedExample.bulletPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* =========================================================================
          BLOCK 9: FAQs, Related Tools, and Official Disclaimer Box
         ========================================================================= */}
      <section className="space-y-10 print:hidden">
        {/* FAQs */}
        <Faq items={content.faqs} />

        {/* Related Tools */}
        <RelatedTools currentSlug={content.slug} />

        {/* Disclaimer Box */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 text-amber-900 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <span className="font-bold text-amber-950 block mb-1">
                Official Estimate Disclaimer:
              </span>
              <p>{content.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
  explanationBox?: React.ReactNode;
  breakdownTable?: React.ReactNode;
  customTopSection?: React.ReactNode;
}

export default function CalculatorShell({
  content,
  calculatorInputs,
  resultPanel,
  explanationBox,
  breakdownTable,
  customTopSection,
}: CalculatorShellProps) {
  return (
    <div className="max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
      {/* =========================================================================
          BLOCK 1 & 2: H1, Short Intro, Roman Urdu Box & Verification Badge
         ========================================================================= */}
      <section className="space-y-5 print:hidden">
        <div className="space-y-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-accent uppercase tracking-widest bg-accent-soft px-3.5 py-1 rounded-full border border-accent/25 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Pakistan Official Calculator
          </span>
          <h1 className="text-[26px] sm:text-[32px] lg:text-[36px] font-black text-primary tracking-tight leading-tight">
            {content.h1}
          </h1>
          <p className="text-[15px] sm:text-base text-appText-muted max-w-3xl leading-relaxed font-normal">
            {content.intro}
          </p>
        </div>

        {/* Roman Urdu Explanation Block with Depth */}
        <div className="bg-gradient-to-r from-teal-50/70 via-white to-surface border-l-4 border-accent p-4 sm:p-5 rounded-r-xl text-xs sm:text-sm text-appText leading-relaxed shadow-xs border border-slate-200/60">
          <span className="font-bold text-primary block mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Roman Urdu Wazahat:
          </span>
          <p className="text-slate-700">{content.romanUrduIntro}</p>
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
          BLOCK 3 & 4: Interactive Calculator — Inputs (Left) & ResultPanel + ExplanationBox (Right)
         ========================================================================= */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        aria-label="Calculator workspace"
      >
        {/* Left Column: Inputs in an Elevated Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_12px_30px_-5px_rgba(11,42,74,0.07),0_4px_10px_-2px_rgba(11,42,74,0.03)] space-y-6 print:hidden">
          <div className="border-b border-slate-100 pb-3.5">
            <h2 className="text-xl font-extrabold text-primary tracking-tight">Enter Your Details</h2>
            <p className="text-xs text-appText-muted mt-0.5">
              Live calculation updates instantly with zero page reloads.
            </p>
          </div>
          {calculatorInputs}
        </div>

        {/* Right Column: Live Result Panel & ExplanationBox Directly Under Result */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          {resultPanel}
          {explanationBox}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 5: Line-by-Line / Slab-by-Slab Breakdown Table
         ========================================================================= */}
      {breakdownTable && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_12px_30px_-5px_rgba(11,42,74,0.07)] print:p-0 print:border-none print:shadow-none">
          {breakdownTable}
        </section>
      )}

      {/* =========================================================================
          BLOCK 6: How to Use — Numbered Steps (No Duplicate Numbers)
         ========================================================================= */}
      <section className="bg-gradient-to-br from-surface to-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs print:hidden space-y-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Guide</span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">How to Use This Calculator</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-appText">
          {content.howToUseSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-start gap-3.5"
            >
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                {idx + 1}
              </span>
              <span className="leading-snug text-appText font-medium text-xs sm:text-sm">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 7: Exact Formula in Plain Text
         ========================================================================= */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(11,42,74,0.05)] print:hidden space-y-3">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Formula</span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">{content.formulaTitle}</h2>
        </div>
        <div className="bg-slate-900 text-emerald-300 p-5 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm leading-relaxed shadow-inner">
          {content.formulaDescription}
        </div>
      </section>

      {/* =========================================================================
          BLOCK 8: Worked Example with Real Numbers
         ========================================================================= */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(11,42,74,0.05)] print:hidden space-y-3">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Case Study</span>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">
            {content.workedExample.title}
          </h2>
          <p className="text-sm text-appText-muted mt-1">
            {content.workedExample.description}
          </p>
        </div>
        <ul className="space-y-2.5 text-xs sm:text-sm text-appText bg-surface p-5 rounded-xl border border-slate-200/80">
          {content.workedExample.bulletPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span>
              <span className="font-medium text-slate-800">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* =========================================================================
          BLOCK 9: FAQs, Related Tools & Legal Disclaimer Box
         ========================================================================= */}
      <section className="space-y-10 print:hidden">
        {/* FAQs Component */}
        <Faq items={content.faqs} />

        {/* Related Tools Links */}
        <RelatedTools currentSlug={content.slug} />

        {/* Disclaimer Callout Box */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-50/40 border-l-4 border-amber-500 rounded-r-2xl border border-slate-200/80 text-xs sm:text-sm text-appText-muted space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider text-xs">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Legal &amp; Regulatory Notice</span>
          </div>
          <p className="leading-relaxed">
            {content.disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}

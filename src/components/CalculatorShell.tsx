"use client";

import React, { useState } from "react";
import VerificationBadge from "./VerificationBadge";
import Faq from "./Faq";
import RelatedTools from "./RelatedTools";
import { CalculatorPageContent } from "@/content/pages";
import { useExplanationLang } from "./LanguageContext";
import ExplanationLangToggle from "./ExplanationLangToggle";
import { useSiteContent } from "./SiteContentContext";
import { trackToolUse } from "@/lib/analytics/beacon";
import { CalculatorType } from "@/lib/analytics/types";

function getCalculatorKey(slug: string): CalculatorType {
  if (slug.includes("salary")) return "salary";
  if (slug.includes("zakat")) return "zakat";
  if (slug.includes("property")) return "property";
  if (slug.includes("gst")) return "gst";
  if (slug.includes("fitrana")) return "fitrana";
  if (slug.includes("ushr")) return "ushr";
  return "salary";
}

interface CalculatorShellProps {
  content: CalculatorPageContent;
  calculatorInputs: React.ReactNode;
  resultPanel: React.ReactNode;
  calculatorHistory?: React.ReactNode;
  explanationBox?: React.ReactNode;
  breakdownTable?: React.ReactNode;
  customTopSection?: React.ReactNode;
  printReport?: React.ReactNode;
}

export default function CalculatorShell({
  content,
  calculatorInputs,
  resultPanel,
  calculatorHistory,
  explanationBox,
  breakdownTable,
  customTopSection,
  printReport,
}: CalculatorShellProps) {
  const { lang } = useExplanationLang();
  const { getContent } = useSiteContent();

  const calcKey = getCalculatorKey(content.slug);
  const introKey = `${calcKey}_intro`;
  const romanKey = `${calcKey}_roman_urdu_intro`;
  const englishKey = `${calcKey}_english_intro`;

  const displayIntro = getContent(introKey, content.intro);
  const displayRomanIntro = getContent(romanKey, content.romanUrduIntro);
  const displayEnglishIntro = getContent(englishKey, content.englishIntro);
  const displayWazahat = lang === "roman" ? displayRomanIntro : displayEnglishIntro;
  const activeWazahatKey = lang === "roman" ? romanKey : englishKey;

  // Mobile Accordion States (collapsed by default on mobile)
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const hasTrackedFormUse = React.useRef(false);

  const handleFormInteraction = () => {
    if (!hasTrackedFormUse.current) {
      hasTrackedFormUse.current = true;
      trackToolUse(getCalculatorKey(content.slug));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("pfc_tool_used"));
      }
    }
  };

  // Automatically record tool use when calculator is viewed/interacted with
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasTrackedFormUse.current) {
        hasTrackedFormUse.current = true;
        trackToolUse(getCalculatorKey(content.slug));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("pfc_tool_used"));
        }
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [content.slug]);

  return (
    <>
      <div className="max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 pt-6 pb-28 sm:py-10 space-y-8 sm:space-y-12 print:hidden">
      {/* =========================================================================
          HERO & HEADER BLOCK: Badge, H1, Trimmed/Full Intro & "Calculate Now ↓"
         ========================================================================= */}
      <section className="space-y-4 print:hidden">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-accent uppercase tracking-widest bg-accent-soft px-3.5 py-1 rounded-full border border-accent/25 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Pakistan Official Calculator
          </span>
          <h1 className="text-[24px] sm:text-[32px] lg:text-[36px] font-black text-primary tracking-tight leading-tight">
            {content.h1}
          </h1>

          {/* Desktop full intro paragraph */}
          <p
            data-content-key={introKey}
            className="hidden md:block text-[15px] sm:text-base text-appText-muted max-w-3xl leading-relaxed font-normal"
          >
            {displayIntro}
          </p>

          {/* Mobile full intro paragraph (no line-clamp) */}
          <p
            data-content-key={introKey}
            className="md:hidden text-xs sm:text-sm text-appText-muted leading-relaxed font-normal"
          >
            {displayIntro}
          </p>
        </div>

        {/* "Calculate Now ↓" Button: Prominent Full-Width on Mobile, Brand Navy */}
        <div>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              const calcKey = getCalculatorKey(content.slug);
              trackToolUse(calcKey);
              const el = document.getElementById("calculator");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 min-h-[48px] rounded-xl font-bold text-sm bg-primary hover:bg-[#071F36] active:scale-98 text-white shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <span>Calculate Now</span>
            <span className="text-base animate-bounce" aria-hidden="true">↓</span>
          </a>
        </div>

        {/* DESKTOP-ONLY: Wazahat Box + Verification Badge + Custom Top Section ABOVE calculator */}
        <div className="hidden md:block space-y-4 pt-1">
          {/* Intro Explanation Box (Bilingual with Language Toggle) */}
          <div className="bg-gradient-to-r from-teal-50/70 via-white to-surface border-l-4 border-accent p-4 sm:p-5 rounded-r-xl text-xs sm:text-sm text-appText leading-relaxed shadow-xs border border-slate-200/60">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <span className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                {lang === "roman" ? "Wazahat:" : "Explanation:"}
              </span>
              <ExplanationLangToggle />
            </div>
            <p
              data-content-key={activeWazahatKey}
              className="text-slate-800 text-[14px] sm:text-[15px] leading-relaxed font-normal"
            >
              {displayWazahat}
            </p>
          </div>

          {/* Verification Badge */}
          <VerificationBadge
            source={content.source}
            sourceDocument={content.sourceDocument}
            lastVerified={content.lastVerified}
          />

          {customTopSection}
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CALCULATOR: Inputs (Left) & ResultPanel (Right)
         ========================================================================= */}
      <section
        id="calculator"
        data-statutory="true"
        onInput={handleFormInteraction}
        onChange={handleFormInteraction}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start scroll-mt-20 sm:scroll-mt-24"
        aria-label="Calculator workspace"
      >
        {/* Left Column: Inputs in an Elevated Card */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_12px_30px_-5px_rgba(11,42,74,0.07),0_4px_10px_-2px_rgba(11,42,74,0.03)] space-y-6 print:hidden">
          <div className="border-b border-slate-100 pb-3.5">
            <h2 className="text-xl font-extrabold text-primary tracking-tight">Enter Your Details</h2>
            <p className="text-xs text-appText-muted mt-0.5">
              Live calculation updates instantly with zero page reloads.
            </p>
          </div>
          {calculatorInputs}
        </div>

        {/* Right Column: Live Result Panel & Local History */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          {resultPanel}
          {calculatorHistory}
        </div>
      </section>

      {/* =========================================================================
          FULL-WIDTH EXPLANATION BOX (Immediately under results & inputs)
         ========================================================================= */}
      {explanationBox && (
        <section data-statutory="true" className="w-full print:hidden">
          {explanationBox}
        </section>
      )}

      {/* =========================================================================
          MOBILE-ONLY: Wazahat Box + Verification Badge (Moved Below Calculator on Mobile)
         ========================================================================= */}
      <div className="md:hidden print:hidden space-y-3">
        <button
          type="button"
          onClick={() => setMobileContextOpen(!mobileContextOpen)}
          className="w-full min-h-[48px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-xs text-primary shadow-2xs cursor-pointer hover:bg-slate-100 transition-colors"
          aria-expanded={mobileContextOpen}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span>{lang === "roman" ? "Wazahat aur Sarkari Rates (Official Context)" : "Official Context & Statutory Rates"}</span>
          </span>
          <span className="text-slate-500 font-bold">{mobileContextOpen ? "▲" : "▼"}</span>
        </button>

        {mobileContextOpen && (
          <div className="space-y-3 pt-1 animate-in fade-in duration-200">
            {/* Wazahat Box */}
            <div className="bg-gradient-to-r from-teal-50/70 via-white to-surface border-l-4 border-accent p-4 rounded-r-xl text-xs text-appText leading-relaxed shadow-xs border border-slate-200/60">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  {lang === "roman" ? "Wazahat:" : "Explanation:"}
                </span>
                <ExplanationLangToggle />
              </div>
              <p
                data-content-key={activeWazahatKey}
                className="text-slate-800 text-xs sm:text-sm leading-relaxed font-normal"
              >
                {displayWazahat}
              </p>
            </div>

            {/* Verification Badge */}
            <VerificationBadge
              source={content.source}
              sourceDocument={content.sourceDocument}
              lastVerified={content.lastVerified}
            />

            {customTopSection}
          </div>
        )}
      </div>

      {/* =========================================================================
          LINE-BY-LINE / SLAB BREAKDOWN TABLE
         ========================================================================= */}
      {breakdownTable && (
        <section data-statutory="true" className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200/90 shadow-[0_12px_30px_-5px_rgba(11,42,74,0.07)] print:p-0 print:border-none print:shadow-none">
          {breakdownTable}
        </section>
      )}

      {/* =========================================================================
          GUIDE / HOW TO USE (Collapsible Accordion on Mobile, Open on Desktop)
         ========================================================================= */}
      <section className="bg-gradient-to-br from-surface to-slate-50 rounded-2xl border border-slate-200/90 shadow-xs print:hidden overflow-hidden">
        {/* Accordion trigger on mobile (<768px) */}
        <button
          type="button"
          onClick={() => setGuideOpen(!guideOpen)}
          className="md:hidden w-full min-h-[48px] p-4 sm:p-5 flex items-center justify-between font-extrabold text-sm text-primary text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
          aria-expanded={guideOpen}
        >
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">Guide</span>
            <span className="text-base font-extrabold text-primary">How to Use This Calculator</span>
          </div>
          <span className="text-slate-500 font-bold ml-2">{guideOpen ? "▲" : "▼"}</span>
        </button>

        {/* Content: Visible when guideOpen on mobile, always visible on desktop */}
        <div className={`${guideOpen ? "block" : "hidden"} md:block p-5 sm:p-8 space-y-4 pt-0 md:pt-8`}>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Guide</span>
            <h2 className="text-xl font-extrabold text-primary tracking-tight">How to Use This Calculator</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-sm text-appText">
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
        </div>
      </section>

      {/* =========================================================================
          FORMULA SECTION (Collapsible Accordion on Mobile, Open on Desktop)
         ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(11,42,74,0.05)] print:hidden overflow-hidden">
        <button
          type="button"
          onClick={() => setFormulaOpen(!formulaOpen)}
          className="md:hidden w-full min-h-[48px] p-4 sm:p-5 flex items-center justify-between font-extrabold text-sm text-primary text-left cursor-pointer hover:bg-slate-50 transition-colors"
          aria-expanded={formulaOpen}
        >
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">Formula</span>
            <span className="text-sm font-extrabold text-primary">{content.formulaTitle}</span>
          </div>
          <span className="text-slate-500 font-bold ml-2">{formulaOpen ? "▲" : "▼"}</span>
        </button>

        <div className={`${formulaOpen ? "block" : "hidden"} md:block p-5 sm:p-8 space-y-3 pt-0 md:pt-8`}>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Formula</span>
            <h2 className="text-xl font-extrabold text-primary tracking-tight">{content.formulaTitle}</h2>
          </div>
          <div className="bg-slate-900 text-emerald-300 p-4 sm:p-5 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm leading-relaxed shadow-inner">
            {content.formulaDescription}
          </div>
        </div>
      </section>

      {/* =========================================================================
          WORKED EXAMPLE / CASE STUDY (Collapsible Accordion on Mobile, Open on Desktop)
         ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_25px_-5px_rgba(11,42,74,0.05)] print:hidden overflow-hidden">
        <button
          type="button"
          onClick={() => setCaseStudyOpen(!caseStudyOpen)}
          className="md:hidden w-full min-h-[48px] p-4 sm:p-5 flex items-center justify-between font-extrabold text-sm text-primary text-left cursor-pointer hover:bg-slate-50 transition-colors"
          aria-expanded={caseStudyOpen}
        >
          <div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">Case Study</span>
            <span className="text-sm font-extrabold text-primary">{content.workedExample.title}</span>
          </div>
          <span className="text-slate-500 font-bold ml-2">{caseStudyOpen ? "▲" : "▼"}</span>
        </button>

        <div className={`${caseStudyOpen ? "block" : "hidden"} md:block p-5 sm:p-8 space-y-3 pt-0 md:pt-8`}>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Case Study</span>
            <h2 className="text-xl font-extrabold text-primary tracking-tight">
              {content.workedExample.title}
            </h2>
            <p className="text-sm text-appText-muted mt-1">
              {content.workedExample.description}
            </p>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-appText bg-surface p-4 sm:p-5 rounded-xl border border-slate-200/80">
            {content.workedExample.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span>
                <span className="font-medium text-slate-800">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================================================================
          FAQS (ALWAYS VISIBLE & UNBURIED) → RELATED TOOLS → LEGAL NOTICE
         ========================================================================= */}
      <section className="space-y-8 sm:space-y-10 print:hidden">
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

    {printReport && (
      <div className="hidden print:block w-full">
        {printReport}
      </div>
    )}
  </>
  );
}

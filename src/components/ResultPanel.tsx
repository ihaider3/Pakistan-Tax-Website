"use client";

import React, { useState } from "react";

export interface SecondaryResult {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}

interface ResultPanelProps {
  title: string;
  mainLabel: string;
  mainValue: string;
  mainSubtext?: string;
  statusBadge?: {
    text: string;
    variant: "success" | "warning" | "neutral" | "due" | "not_due";
  };
  secondaryResults: SecondaryResult[];
  copySummaryText: string;
  isEmpty?: boolean;
  emptyPrompt?: string;
  footnote?: string;
  className?: string;
  onReset?: () => void;
}

export default function ResultPanel({
  title,
  mainLabel,
  mainValue,
  mainSubtext,
  statusBadge,
  secondaryResults,
  copySummaryText,
  isEmpty = false,
  emptyPrompt = "Enter an amount above to see your result — Upar raqam likhein, result foran nazar aayega.",
  footnote,
  className = "",
  onReset,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copySummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-white via-[#FAFBFD] to-surface border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_20px_50px_-12px_rgba(11,42,74,0.14),0_0_0_1px_rgba(11,42,74,0.03)] flex flex-col justify-between min-h-[420px] transition-all print:border-none print:p-0 print:shadow-none ${className}`}
      aria-live="polite"
    >
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <h2 className="font-extrabold text-primary text-base sm:text-lg tracking-tight">
              {title}
            </h2>
          </div>

          {statusBadge && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold tracking-wider shadow-2xs ${
                statusBadge.variant === "due" || statusBadge.variant === "warning"
                  ? "bg-amber-100 text-amber-950 border border-amber-300"
                  : statusBadge.variant === "not_due" || statusBadge.variant === "success"
                  ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                  : "bg-surface-hover text-appText border border-slate-200"
              }`}
            >
              {statusBadge.text}
            </span>
          )}
        </div>

        {/* Main Result Display */}
        {isEmpty ? (
          <div className="py-14 text-center text-appText-muted flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-appText-subtle shadow-inner">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-primary">{emptyPrompt}</p>
            <p className="text-xs text-appText-muted max-w-xs">Live calculation updates instantly with zero server roundtrips.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cinematic Main Result Hero Card */}
            <div className="bg-gradient-to-br from-primary via-[#0E355E] to-primary-light text-white p-5 sm:p-6 rounded-xl shadow-xl shadow-primary/25 ring-1 ring-white/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
              
              <span className="block text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {mainLabel}
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-xs">
                {mainValue}
              </div>
              {mainSubtext && (
                <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium leading-relaxed">
                  {mainSubtext}
                </p>
              )}
            </div>

            {/* Secondary Results Grid with Soft Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {secondaryResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    item.highlight
                      ? "bg-accent-soft/90 border-accent/40 shadow-xs"
                      : "bg-white border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  }`}
                >
                  <span className="block text-[11px] font-bold text-appText-muted uppercase tracking-wider mb-0.5">
                    {item.label}
                  </span>
                  <span className="text-lg font-black text-primary block tracking-tight">
                    {item.value}
                  </span>
                  {item.subtext && (
                    <span className="text-[11px] text-appText-subtle block mt-0.5 font-medium">
                      {item.subtext}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons & Footnote */}
      <div className="pt-5 border-t border-slate-200/80 space-y-3 mt-4">
        {!isEmpty && (
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 min-h-[46px] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white hover:from-primary-light hover:to-primary active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-primary/20 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-accent whitespace-nowrap"
              aria-label="Copy summary to clipboard"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="whitespace-nowrap">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap hidden sm:inline">Copy Summary</span>
                  <span className="whitespace-nowrap sm:hidden">Copy</span>
                </>
              )}
            </button>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="min-h-[46px] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 bg-white text-appText hover:bg-surface hover:text-primary active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-accent whitespace-nowrap cursor-pointer"
                aria-label="Reset calculator inputs to default"
              >
                <svg className="w-4 h-4 text-appText-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[46px] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 bg-white text-appText hover:bg-surface hover:text-primary active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-accent whitespace-nowrap cursor-pointer"
              aria-label="Print or save as PDF"
            >
              <svg className="w-4 h-4 text-appText-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / PDF</span>
            </button>
          </div>
        )}

        {footnote && (
          <p className="text-[11px] text-appText-muted leading-relaxed italic pt-1">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

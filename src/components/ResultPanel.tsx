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
  emptyPrompt = "Enter an amount to see your result",
  footnote,
  className = "",
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copySummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
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
      className={`bg-surface border-2 border-appBorder rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[380px] transition-all print:border-none print:p-0 print:shadow-none ${className}`}
      aria-live="polite"
    >
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-appBorder">
          <h2 className="font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
            {title}
          </h2>
          {statusBadge && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
                statusBadge.variant === "due" || statusBadge.variant === "warning"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : statusBadge.variant === "not_due" || statusBadge.variant === "success"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-surface-hover text-appText"
              }`}
            >
              {statusBadge.text}
            </span>
          )}
        </div>

        {/* Main Result Display */}
        {isEmpty ? (
          <div className="py-12 text-center text-appText-muted flex flex-col items-center justify-center space-y-2">
            <svg
              className="w-10 h-10 text-appText-subtle"
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
            <p className="text-base font-medium text-appText">{emptyPrompt}</p>
            <p className="text-xs text-appText-muted">Live calculations update instantly as you type.</p>
          </div>
        ) : (
          <div>
            <div className="bg-white p-4 sm:p-5 rounded-lg border border-appBorder mb-4 shadow-xs">
              <span className="block text-xs font-semibold text-appText-muted uppercase tracking-wider mb-1">
                {mainLabel}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {mainValue}
              </div>
              {mainSubtext && (
                <p className="text-xs text-appText-muted mt-1 font-medium">{mainSubtext}</p>
              )}
            </div>

            {/* Secondary Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {secondaryResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-colors ${
                    item.highlight
                      ? "bg-accent-soft border-accent/30"
                      : "bg-white border-appBorder"
                  }`}
                >
                  <span className="block text-xs text-appText-muted mb-0.5">
                    {item.label}
                  </span>
                  <span className="text-lg font-bold text-primary block">
                    {item.value}
                  </span>
                  {item.subtext && (
                    <span className="text-[11px] text-appText-subtle block mt-0.5">
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
      <div className="pt-4 border-t border-appBorder space-y-3">
        {!isEmpty && (
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 min-h-[44px] px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-light active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-accent"
              aria-label="Copy summary to clipboard"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold rounded-md border border-appBorder bg-white text-appText hover:bg-surface active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-accent"
              aria-label="Print or save as PDF"
            >
              <svg className="w-4 h-4 text-appText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / PDF</span>
            </button>
          </div>
        )}

        {footnote && (
          <p className="text-[11px] text-appText-muted leading-relaxed italic">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

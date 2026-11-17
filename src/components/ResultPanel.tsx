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
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const handleCopy = async () => {
    let success = false;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(copySummaryText);
        success = true;
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      // Fallback for older browsers / webviews / unsupported permissions
      try {
        if (typeof document !== "undefined") {
          const textarea = document.createElement("textarea");
          textarea.value = copySummaryText;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          textarea.setAttribute("readonly", "");
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          success = document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2500);
    } else {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleWhatsAppShare = () => {
    if (!copySummaryText || isEmpty) return;
    const url = `https://wa.me/?text=${encodeURIComponent(copySummaryText)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
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
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 min-h-[46px] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white hover:from-primary-light hover:to-primary active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-primary/20 hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-accent whitespace-nowrap cursor-pointer"
            aria-label="Copy summary to clipboard"
          >
            {copyStatus === "success" ? (
              <>
                <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="whitespace-nowrap text-emerald-300">Summary copied successfully!</span>
              </>
            ) : copyStatus === "error" ? (
              <>
                <svg className="w-4 h-4 text-rose-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="whitespace-nowrap text-rose-300">Copy failed — please try again.</span>
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

          {!isEmpty && copySummaryText && (
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="min-h-[46px] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 bg-white text-appText hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#25D366] whitespace-nowrap cursor-pointer"
              aria-label="Share summary on WhatsApp"
            >
              <svg className="w-4 h-4 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span className="hidden sm:inline">Share on WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          )}

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

        {footnote && (
          <p className="text-[11px] text-appText-muted leading-relaxed italic pt-1">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

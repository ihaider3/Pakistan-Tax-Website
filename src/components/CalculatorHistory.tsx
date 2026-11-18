"use client";

import React from "react";
import { HistoryEntry } from "@/lib/history/types";
import { useExplanationLang } from "@/components/LanguageContext";

interface CalculatorHistoryProps<TInputs = Record<string, unknown>> {
  history: HistoryEntry<TInputs>[];
  onRestore: (inputs: TInputs) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  className?: string;
}

export default function CalculatorHistory<TInputs = Record<string, unknown>>({
  history,
  onRestore,
  onDelete,
  onClear,
  className = "",
}: CalculatorHistoryProps<TInputs>) {
  const { lang } = useExplanationLang();
  const isRoman = lang === "roman";

  // Section ONLY visible when at least 1 entry exists
  if (!history || history.length === 0) {
    return null;
  }

  const title = isRoman ? "Haaliya hisaab" : "Recent calculations";
  const clearBtnText = isRoman ? "History saaf karein" : "Clear history";
  const confirmMsg = isRoman
    ? "Kya aap waqai history saaf karna chahte hain?"
    : "Are you sure you want to clear your calculation history?";
  const privacyText = isRoman
    ? "Aapki history sirf isi device par rehti hai — kuch bhi hamare server par nahi bheja jata."
    : "Your history stays on this device only — nothing is sent to our servers.";
  const deleteAria = isRoman ? "Hisaab delete karein" : "Delete calculation";
  const restoreHint = isRoman ? "Tap karke dobara load karein" : "Tap to restore calculation";

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.confirm(confirmMsg)) {
      onClear();
    }
  };

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_-5px_rgba(11,42,74,0.08),0_2px_8px_-2px_rgba(11,42,74,0.04)] space-y-3.5 print:hidden ${className}`}
      aria-label={title}
    >
      {/* Header: Title, Entry Count & Clear Button */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-primary tracking-tight truncate">
            {title}
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {history.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClearClick}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          title={clearBtnText}
        >
          {clearBtnText}
        </button>
      </div>

      {/* History Rows List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
        {history.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onRestore(entry.inputs)}
            className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-teal-50/40 hover:border-accent/40 active:scale-[0.99] transition-all duration-150 cursor-pointer shadow-2xs"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRestore(entry.inputs);
              }
            }}
            title={restoreHint}
          >
            {/* Left: Timestamp & Summary */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <span className="block text-[11px] font-medium text-slate-400">
                {entry.formattedDate}
              </span>
              <p className="text-xs sm:text-sm font-bold text-primary group-hover:text-accent-hover truncate transition-colors">
                {entry.summary}
              </p>
            </div>

            {/* Right: Result Summary & Delete Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                {entry.resultSummary}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
                className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-colors cursor-pointer"
                aria-label={deleteAria}
                title={deleteAria}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Guarantee Footnote */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
        <svg
          className="w-3.5 h-3.5 text-emerald-500 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="leading-snug">{privacyText}</span>
      </div>
    </div>
  );
}


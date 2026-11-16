import React from "react";

interface VerificationBadgeProps {
  source: string;
  sourceDocument: string;
  lastVerified: string;
  notes?: string;
  className?: string;
}

export default function VerificationBadge({
  source,
  sourceDocument,
  lastVerified,
  notes,
  className = "",
}: VerificationBadgeProps) {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-appText-muted shadow-[0_4px_16px_-2px_rgba(11,42,74,0.05)] transition-all ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white font-extrabold text-[11px] tracking-wider uppercase shadow-xs">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Verified Statutory Table
          </span>
          <span className="font-bold text-primary text-xs sm:text-sm">
            {source}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>Last Audited: {lastVerified}</span>
        </div>
      </div>

      <div className="text-xs text-appText-muted space-y-1 bg-surface p-3 rounded-xl border border-slate-200/60">
        <p>
          <span className="font-bold text-primary">Primary Document:</span> {sourceDocument}
        </p>
        {notes && (
          <p className="text-[11px] text-appText-subtle italic pt-0.5">
            Note: {notes}
          </p>
        )}
      </div>
    </div>
  );
}

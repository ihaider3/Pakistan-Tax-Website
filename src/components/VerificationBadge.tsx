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
      className={`bg-surface border border-appBorder rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-appText-muted ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white font-semibold text-xs tracking-wide uppercase">
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
          Verified Table
        </span>
        <span className="font-medium text-appText">
          Source: <span className="font-semibold">{source}</span>
        </span>
      </div>

      <div className="text-xs text-appText-muted space-y-0.5 mt-1.5">
        <p>
          <span className="font-medium text-appText">Document:</span> {sourceDocument}
        </p>
        <p>
          <span className="font-medium text-appText">Last verified:</span>{" "}
          <span className="text-primary font-medium">{lastVerified}</span>
        </p>
        {notes && (
          <p className="text-xs text-appText-subtle italic mt-1">
            Note: {notes}
          </p>
        )}
      </div>
    </div>
  );
}

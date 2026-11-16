"use client";

import React from "react";

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
}

interface ToggleProps<T extends string> {
  label?: string;
  options: ToggleOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export default function Toggle<T extends string>({
  label,
  options,
  value,
  onChange,
  className = "",
  columns,
}: ToggleProps<T>) {
  // Determine responsive grid layout
  const getGridClasses = () => {
    if (columns === 1) return "grid grid-cols-1";
    if (columns === 2) return "grid grid-cols-1 sm:grid-cols-2";
    if (columns === 3) return "grid grid-cols-1 sm:grid-cols-3";
    if (columns === 4) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

    // Auto layout based on options count
    if (options.length === 4) {
      // 4 options (e.g. Fitrana staples): 1 col on mobile, 2 cols on tablet/desktop for max 1-line readability
      return "grid grid-cols-1 sm:grid-cols-2";
    }
    if (options.length === 3) {
      return "grid grid-cols-1 sm:grid-cols-3";
    }
    if (options.length === 2) {
      // Check if labels are short and without badges (like Tola / Grams)
      const isShort = options.every((o) => o.label.length <= 10 && !o.badge);
      return isShort ? "grid grid-cols-2" : "grid grid-cols-1 sm:grid-cols-2";
    }
    return "grid grid-cols-1 sm:grid-cols-2";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <span className="block text-sm font-bold text-primary tracking-tight">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-label={label || "Selection options"}
        className={`w-full bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80 shadow-inner-soft gap-2 ${getGridClasses()}`}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.value)}
              className={`min-h-[48px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-between gap-2 focus:outline-hidden focus:ring-2 focus:ring-accent text-left ${
                isSelected
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/20 scale-[1.01]"
                  : "text-appText-muted hover:text-primary hover:bg-white/80"
              }`}
            >
              <span className="leading-snug break-words">{opt.label}</span>
              {opt.badge && (
                <span
                  className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider shrink-0 transition-colors ${
                    isSelected
                      ? "bg-accent text-white shadow-2xs"
                      : "bg-slate-200/90 text-appText-muted"
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
